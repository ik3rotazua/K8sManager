import {
  Component,
  OnInit,
  ViewChild
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { faEye } from '@fortawesome/free-solid-svg-icons';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import {
  AngularUtilities,
  AxBsDatatableFilterType,
  BsDatatableComponent,
  BsDatatableModule,
  DestroySubscriptions,
  DtActionButton,
  DtActionColumnButton,
  DtColumnItem,
  DtFilterItem,
  FilterOpType,
  nameof
} from '@efordevelops/ax-toolbox';
import { EmployeeDto } from 'src/app/shared/api/models';
import { takeUntil } from 'rxjs';
import { EmployeeService } from 'src/app/shared/api/services';
;

type This = ListComponent;
type DtType = This['dt']['items'][0];

@Component({
  selector: 'app-list',
  standalone: true,
  imports: [
    BsDatatableModule,
    TranslateModule,
  ],
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent
  extends DestroySubscriptions
  implements OnInit {
  @ViewChild('dt') dt: BsDatatableComponent<EmployeeDto>;

  dtColumns: This['dt']['columns'] = [];
  dtBtns: This['dt']['actionButtons'] = [];

  isLoadingDelete = false;
  constructor(
    private readonly translate: TranslateService,
    private readonly aRoute: ActivatedRoute,
    private readonly emplSV: EmployeeService,
  ) {
    super();
    this.initAsync();
  }

  ngOnInit(): void {
  }

  private async initAsync() {
    await this.initListeners();
  }

  private async initListeners() {
    AngularUtilities.activatedRouteChange(this.aRoute)
      .pipe(takeUntil(this.$onDestroyed))
      .subscribe(async ({ }) => {
        await this.initDtAsync();
      });
  }

  private async initDtAsync() {
    this.initDtColumnsAsync();
    this.initDtButtons();
  }

  private async initDtColumnsAsync() {
    const dtColumns = [
      new DtColumnItem<DtType, string>({
        fieldCssClass: 'cell-narrow',
        buttons: [
          new DtActionColumnButton<DtType, string>({
            //iconName: faEye.iconName, 
            //iconPreffix: faEye.prefix,
            tooltip: this.translate.instant('COMPONENT.DATATABLE.ACTION.GOTO.DETAILS'),
            tooltipPlacement: 'right',
            btnClass: 'btn btn-sm btn-primary',
            url: `../{${nameof<DtType>('id')}}`,
            urlTarget: '_self'
          }),
        ]
      }),
      new DtColumnItem<DtType, DtType['name']>({
        id: 'dt-empl-l-name',
        fieldCssClass: 'cell-narrow',
        columnName: this.translate.instant('PAGE.EMPLOYEE.LIST.NAME'),
        field: nameof<DtType>('name'),
        filterItem: new DtFilterItem({
          field: nameof<DtType>('name'),
          type: AxBsDatatableFilterType.text,
          op: FilterOpType.Cn,
        }),
        filter: true,
      }),
      new DtColumnItem<DtType, DtType['surname1']>({
        id: 'dt-empl-l-sname',
        fieldCssClass: 'cell-narrow',
        columnName: this.translate.instant('PAGE.EMPLOYEE.LIST.SURNAME1'),
        field: nameof<DtType>('surname1'),
      }),
      new DtColumnItem<DtType, DtType['surname2']>({
        id: 'dt-empl-l-sname2',
        fieldCssClass: 'cell-narrow',
        columnName: this.translate.instant('PAGE.EMPLOYEE.LIST.SURNAME2'),
        field: nameof<DtType>('surname2'),
      }),
    ];
    this.dtColumns = dtColumns;
  }

  private initDtButtons() {
    const btns: This['dtBtns'] = [
      new DtActionButton({
        btnClass: 'btn btn-sm btn-primary',
        text: this.translate.instant('BTN.GENERIC.NEW.MALE'),
        url: '/employee/new',
        urlTarget: '_self',
      })
    ];

    this.dtBtns = btns;
  }

  dtGetterFn: This['dt']['dataGetterFn'] = (queryParams, filters) => this.emplSV.apiEmployeeDatatablePost$Json({
    ...queryParams,
    body: [...filters] as any,
  });
}
