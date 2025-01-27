import {
  Component,
  HostBinding,
  OnInit,
  NgModule,
  ViewChild
} from '@angular/core';
import {
  faCheck,
  faCheckCircle,
  faEllipsisV,
  faEye,
  faPlug,
  faPlus,
  faSearch,
  faTimes,
  faTrash,
  faTrashAlt
} from '@fortawesome/free-solid-svg-icons';
import {
  BsDatatableComponent,
  BsDatatableModule,
  BsDatatableUtils,
  BsFormInputModule,
  ColumnItemIconConfig,
  ColumnItemIconDefinition,
  DateUtilities,
  DtActionColumnButton,
  DtColumnItem,
  nameof
} from '@efordevelops/ax-toolbox';
import { IMockupItem } from './models/dt-item';
import { of } from 'rxjs';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { AccordionModule } from 'ngx-bootstrap/accordion';
import { FormsModule } from '@angular/forms';

type This = StylesComponent;
type TDtItem = This['dt']['items'][0];

@Component({
  selector: 'app-styles',
  imports: [
    BsFormInputModule,
    BsDatatableModule,

    FontAwesomeModule,

    TabsModule,
    BsDropdownModule,
    AccordionModule,

    FormsModule,
  ],
  standalone: true,
  templateUrl: './styles.component.html',
  styleUrls: ['./styles.component.scss']
})
export class StylesComponent implements OnInit {
  @ViewChild('dt') dt: BsDatatableComponent<IMockupItem>;
  dtColumns: This['dt']['columns'] = [];

  mockupForm = {
    inputValue: '',
  };

  _iconNew = faPlus;

  //Accordion
  oneAtATime = true;

  constructor() { }

  ngOnInit(): void {
    this.initDtAsync();
  }

  // #region Init Datatable

  dtGetterFn: This['dt']['dataGetterFn'] = (
    queryParams,
    filters,
  ) => {
    const items: TDtItem[] = [
      {
        id: 1,
        string: 'Item 1',
        boolean: true,
        date: DateUtilities.nowAsMoment().toDate(),
        dateString: DateUtilities.nowAsMoment().format(),
      },
      {
        id: 2,
        string: 'Item 2',
        boolean: false,
        date: DateUtilities.nowAsMoment().toDate(),
        dateString: DateUtilities.nowAsMoment().format(),
      }
    ];

    const result = BsDatatableUtils.collectionToDtApiResponse(
      items,
      queryParams,
      filters
    );

    return of(result);
  };




  private async initDtAsync() {
    await this.initDtColumnsAsync();
  }

  private async initDtColumnsAsync() {
    this.dtColumns = [
      new DtColumnItem({
        columnName: 'ID',
        field: nameof<TDtItem>('id'),
        navigation: {
          routerLink: ['/'],
          target: '_blank',
        }
      }),
      new DtColumnItem({
        columnName: 'String',
        field: nameof<TDtItem>('string'),
      }),
      new DtColumnItem({
        columnName: 'Date',
        field: nameof<TDtItem>('date'),
      }),
      new DtColumnItem({
        columnName: 'Date, string',
        field: nameof<TDtItem>('dateString'),
      }),
      new DtColumnItem({
        columnName: 'Boolean',
        field: nameof<TDtItem>('boolean'),
        fieldDisplayType: 'boolean',
        valueIcons: [
          new ColumnItemIconConfig().setData({
            icon: faTimes,
            iconCssClass: 'text-danger',
            iconOnly: true,
            value: false,
          }),
          new ColumnItemIconConfig().setData({
            icon: faCheckCircle,
            iconCssClass: 'text-success',
            iconOnly: true,
            value: true,
          }),
        ]
      }),
    ];

  }
  // #endregion
}
