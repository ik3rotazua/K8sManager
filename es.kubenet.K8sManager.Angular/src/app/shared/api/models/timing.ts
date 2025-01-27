/* tslint:disable */
import { CustomTiming } from './custom-timing';
import { TimingDebugInfo } from './timing-debug-info';
export interface Timing {
  children?: null | Array<Timing>;
  customTimings?: null | { [key: string]: Array<CustomTiming> };
  debugInfo?: TimingDebugInfo;
  durationMilliseconds?: null | number;
  id?: string;
  name?: null | string;
  startMilliseconds?: number;
}
