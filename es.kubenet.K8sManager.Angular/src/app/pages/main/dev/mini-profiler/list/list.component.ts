import { DecimalPipe } from '@angular/common';
import {
  Component,
  HostBinding,
  OnInit,
  ViewChild
} from '@angular/core';
import {
  faArrowDown,
  faArrowUp,
  faEye
} from '@fortawesome/free-solid-svg-icons';
import {
  AxBsModalUtilities,
  BsDatatableComponent,
  BsDatatableUtils,
  BsModalConfirmationMessageComponent,
  DateUtilities,
  DestroySubscriptions,
  DtActionColumnButton,
  DtColumnItem,
  nameof,
  StringUtilities
} from '@efordevelops/ax-toolbox';
import { TranslateService } from '@ngx-translate/core';
import { firstValueFrom } from 'rxjs';
import {
  map,
  startWith,
  takeUntil
} from 'rxjs/operators';
import { format } from 'sql-formatter';
import {
  CustomTiming,
  ListResultsOrder,
  MiniProfiler,
  Timing
} from 'src/app/shared/api/models';
import { MiniProfilerService } from 'src/app/shared/api/services';
import { ScrollService } from 'src/app/shared/services/scroll/scroll.service';

type This = ListComponent;
type DtItemDetails = MiniProfiler & { sqlMs: number; };
type DtItem = DtItemDetails;

const TIMING_THRESHOLDS = {
  warning: 200,
  danger: 650,
};

const SQL_TIMING_EXCLUDED_TYPES = Object.freeze([
  'Open',
  'OpenAsync',
  'Close',
  'CloseAsync'
]);

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent
  extends DestroySubscriptions
  implements OnInit {
  @HostBinding('class') classes = 'd-block container-fluid';

  @ViewChild('dt') dt: BsDatatableComponent<DtItem>;
  @ViewChild('modalProfileDetails') modalProfileDetails: BsModalConfirmationMessageComponent;

  readonly _dummySqlExcludedTypes = SQL_TIMING_EXCLUDED_TYPES;
  readonly _iconPrev = faArrowUp;
  readonly _iconNext = faArrowDown;

  dtRange: Date[] = [
    DateUtilities.nowAsMoment().clone().startOf('date').toDate(),
    DateUtilities.nowAsMoment().clone().endOf('date').toDate(),
  ];
  dtRangeLimit: Date[] = [
    undefined,
    DateUtilities.nowAsMoment().clone().endOf('date').toDate(),
  ];
  dtColumns: This['dt']['columns'] = [];

  selectedProfile?: DtItemDetails;

  langCode: string;
  constructor(
    private readonly mpSv: MiniProfilerService,
    private readonly decPipe: DecimalPipe,
    private readonly translate: TranslateService,
    private readonly scrollSV: ScrollService,
  ) {
    super();

    this.initListeners();
    this.initDtColumns();
    this.langCode = translate.currentLang;
  }

  ngOnInit(): void {
  }

  goToSqlTimingById(nextId: string) {
    const elId = `sql-timing-${nextId}`;
    const el = document.getElementById(elId);
    if (!el) {
      throw new Error(`ID for next element "${nextId}" is not valid.`);
    }

    this.scrollToElement(elId);
  }

  private scrollToElement(elementId: string) {
    const el = document.getElementById(elementId);
    if (!el) { return; }

    this.scrollSV.scrollTo(el, 'smooth');
  }

  private initDtColumns() {
    const formatDate = this.translate.instant('FORMAT.MOMENT.DATE');
    const formatTime = `${this.translate.instant('FORMAT.MOMENT.TIME24')}.SSSS`;

    const columns: This['dtColumns'] = [
      new DtColumnItem<DtItem, DtItem['id']>({
        id: 'mp-btns',
        columnName: 'ID',
        thTHeadClass: 'cell-narrow text-left text-nowrap',
        fieldCssClass: 'cell-narrow text-left text-nowrap',
        field: nameof<DtItem>('id'),
        fieldDisplayMiddleware: () => '',
        buttons: [
          new DtActionColumnButton<DtItem, DtItem['id']>().setData({
            btnClass: 'btn btn-sm btn-primary',
            //iconPreffix: faEye.prefix,
            //iconName: faEye.iconName,
            onClick: async (ev, item, field, displayed, column, btn) => {
              btn.disabled = true;
              try {
                const apiCall = this.mpSv.apiMiniprofilerIdGet$Json({ id: item.id });
                const profile = await firstValueFrom(apiCall);

                this.dtCompleteItem(profile);
                const sqlProfiles = this.crawlForSql(...(profile.root.children ?? []));
                for (const profile of sqlProfiles) {
                  this.dtCompleteSqlString(profile);
                }

                this.selectedProfile = {
                  ...profile,
                  sqlMs: item.sqlMs,
                };

                await AxBsModalUtilities.waitUntilClose(
                  this.modalProfileDetails,
                  async () => { },
                  async () => { });
              } finally {
                btn.disabled = false;
              }
            },
          }),
        ]
      }),
      new DtColumnItem<DtItem, DtItem['started']>({
        id: 'mp-datetime',
        columnName: 'Datetime',
        thTHeadClass: 'cell-narrow text-left text-nowrap',
        fieldCssClass: 'cell-narrow text-left text-nowrap',
        field: nameof<DtItem>('started'),
        fieldDisplayType: 'html',
        fieldDisplayMiddleware: (displayed, col, row) => {
          const data = row.started;
          if (!data) { return displayed; }

          const asMoment = DateUtilities.toMomentClone(row.started);
          const output = `${asMoment.format(formatDate)}<br>${asMoment.format(formatTime)}`;
          return output;
        }
      }),
      new DtColumnItem({
        id: 'mp-timing',
        columnName: 'Duration (ms)',
        thTHeadClass: 'cell-narrow text-right',
        fieldCssClass: 'cell-narrow text-right text-nowrap',
        field: `${nameof<DtItem>('durationMilliseconds')}`,
        fieldDisplayType: 'text',
        fieldDisplayMiddleware: this.dtMdlwMilliseconds.bind(this),
      }),
      new DtColumnItem({
        id: 'mp-timing-sql',
        columnName: 'SQL (ms)',
        thTHeadClass: 'cell-narrow text-right',
        fieldCssClass: 'cell-narrow text-right text-nowrap',
        field: `${nameof<DtItem>('sqlMs')}`,
        fieldDisplayType: 'text',
        fieldDisplayMiddleware: this.dtMdlwGetSqlTiming.bind(this),
      }),
      new DtColumnItem({
        id: 'mp-path',
        columnName: 'Path',
        thTHeadClass: 'text-left text-nowrap',
        fieldCssClass: 'text-left text-nowrap',
        field: `${nameof<MiniProfiler>('root')}.${nameof<MiniProfiler['root']>('name')}`,
      }),
      new DtColumnItem<DtItem, DtItem['id']>({
        id: 'mp-id',
        columnName: 'ID',
        thTHeadClass: 'cell-narrow text-left text-nowrap',
        fieldCssClass: 'cell-narrow text-left text-nowrap',
        field: nameof<DtItem>('id'),
        fieldDisplayMiddleware: (displayed, col, row) => row.id?.substring(0, 8),
      }),
      new DtColumnItem({
        id: 'mp-username',
        columnName: 'User',
        thTHeadClass: 'cell-narrow text-left text-nowrap',
        fieldCssClass: 'cell-narrow text-left text-nowrap',
        field: nameof<DtItem>('user'),
      }),
      new DtColumnItem({
        id: 'mp-machine',
        columnName: 'Server',
        thTHeadClass: 'cell-narrow text-left text-nowrap',
        fieldCssClass: 'cell-narrow text-left text-nowrap',
        field: nameof<DtItem>('machineName'),
      }),
    ];

    this.dtColumns = columns;
  }

  private dtCompleteItem(item: MiniProfiler) {
    const sqlProfiles = this.crawlForSql(...(item.root.children ?? []));
    const ms = sqlProfiles.reduce((total, timing) => total + timing.durationMilliseconds ?? 0, 0);

    if (ms > 0) {
      const cssClass = Object.entries(TIMING_THRESHOLDS)
        .filter(thrs => thrs[1] <= ms)
        .sort((a, b) => b[1] - a[1])[0]?.[0];

      if (cssClass) {
        item[this.dt.cssClassTBodyRowProperty] = `table-${cssClass}`;
      }
    }

    for (let sqlIndex = 0; sqlIndex < sqlProfiles.length; sqlIndex++) {
      const sql = sqlProfiles[sqlIndex];
      sql['_prevId'] = sqlProfiles[sqlIndex - 1]?.id;
      sql['_nextId'] = sqlProfiles[sqlIndex + 1]?.id;
    }

    const output: This['dt']['items'][0] = {
      ...item,
      sqlMs: ms,
    };

    return output;
  }

  private dtCompleteSqlString(timing: CustomTiming) {
    if (SQL_TIMING_EXCLUDED_TYPES.includes(timing.executeType)) {
      return;
    }

    timing.commandString = format(
      timing.commandString,
      {
        language: 'tsql',
      });
  }

  private dtMdlwMilliseconds(ms?: string | number) {
    if (ms == null) { return ''; }
    if (typeof (ms) === 'string' && StringUtilities.isNullOrWhitespace(ms)) { return ''; }
    const asNum = Number(ms);
    if (isNaN(asNum)) { throw new Error(`Value [${ms}] is not a valid milliseconds value.`); }

    const output = this.decPipe.transform(ms, '1.2-2', this.translate.currentLang);
    return output;
  }

  private dtMdlwGetSqlTiming(displayedData: any, column: This['dtColumns'][0], row: This['dt']['items'][0]) {
    const sqlProfiles = this.crawlForSql(...(row.root.children ?? []))
      .filter(sql => SQL_TIMING_EXCLUDED_TYPES.includes(sql.executeType));

    const ms = row.sqlMs;
    if (ms === 0) { return '-'; }

    const msString = this.dtMdlwMilliseconds(ms);
    return `${msString} ms (${sqlProfiles.length})`;
  }

  private crawlForSql(...timings: Timing[]) {
    const sqlTimings: CustomTiming[] = [];
    for (const timing of timings) {
      if (timing.customTimings?.sql != null) {
        sqlTimings.push(...timing.customTimings.sql);
      }

      const children = this.crawlForSql(...timing.children ?? []);
      sqlTimings.push(...children);
    }

    return sqlTimings;
  }

  dtGetterFn(
    queryParams: Parameters<This['dt']['dataGetterFn']>[0],
    filters: Parameters<This['dt']['dataGetterFn']>[1]
  ): ReturnType<This['dt']['dataGetterFn']> {
    const dtFrom = this.dtRange?.[0] == null
      ? undefined
      : DateUtilities.toMomentClone(this.dtRange[0]).startOf('date').format();
    const dtTo = this.dtRange?.[0] == null
      ? undefined
      : DateUtilities.toMomentClone(this.dtRange[1]).endOf('date').format();

    const apiCall = this.mpSv.apiMiniprofilerGet$Json({
      pSize: 0,
      sd: ListResultsOrder.Descending,
      dtFrom: dtFrom,
      dtTo: dtTo,
    }).pipe(
      map(items => {
        const completed = items.map(item => this.dtCompleteItem(item));
        return BsDatatableUtils.collectionToDtApiResponse(completed, queryParams);
      })
    );

    return apiCall;
  }

  private initListeners() {
    this.initLangListener();
  }

  private initLangListener() {
    this.translate.onLangChange
      .pipe(
        startWith({
          lang: this.translate.currentLang,
          translations: this.translate.translations,
        }),
        takeUntil(this.$onDestroyed),
      ).subscribe((ev) => {
        this.langCode = ev.lang;
      });
  }
}
