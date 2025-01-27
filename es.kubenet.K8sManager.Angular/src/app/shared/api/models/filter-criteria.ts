/* tslint:disable */
import { FilterDbType } from './filter-db-type';
import { FilterOperator } from './filter-operator';
export interface FilterCriteria {
  field?: null | string;
  format?: FilterDbType;
  op?: FilterOperator;
  value?: null | string;
}
