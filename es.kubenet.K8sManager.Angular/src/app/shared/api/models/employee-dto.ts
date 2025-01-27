/* tslint:disable */
import { DepartmentDto } from './department-dto';
export interface EmployeeDto {
  department: DepartmentDto;
  departmentId: string;
  id?: string;
  name: string;
  surname1?: null | string;
  surname2?: null | string;
  userName: string;
}
