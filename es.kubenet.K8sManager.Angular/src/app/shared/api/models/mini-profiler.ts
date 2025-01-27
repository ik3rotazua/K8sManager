/* tslint:disable */
import { ClientTimings } from './client-timings';
import { Timing } from './timing';
export interface MiniProfiler {
  clientTimings?: ClientTimings;
  customLinks?: null | { [key: string]: string };
  durationMilliseconds?: number;
  hasUserViewed?: boolean;
  id?: string;
  machineName?: null | string;
  name?: null | string;
  root?: Timing;
  started?: string;
  user?: null | string;
}
