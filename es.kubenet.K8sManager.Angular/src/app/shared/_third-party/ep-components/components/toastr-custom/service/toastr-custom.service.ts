import { Injectable } from '@angular/core';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import {
  faCheckCircle,
  faExclamationTriangle,
  faInfoCircle,
  faTimesCircle
} from '@fortawesome/free-solid-svg-icons';
import { SetData } from '@efordevelops/ax-toolbox';
import {
  ActiveToast,
  ComponentType,
  IndividualConfig,
  ProgressAnimationType,
  ToastrService
} from 'ngx-toastr';
import { ToastrCustomComponent } from '../toastr-custom.component';


export type ToastrType = 'info' | 'success' | 'warning' | 'error';

@Injectable({
  providedIn: 'root'
})
export class ToastrCustomService<TCustomComponent extends ToastrCustomComponent = ToastrCustomComponent> {

  constructor(
    private toastrSV: ToastrService
  ) {
  }

  show(message?: string, title?: string, override?: Partial<CustomIndividualConfig>, type?: ToastrType): ActiveToast<any> {
    const res = this.toastrSV.show(message, title, override, type);
    const component: TCustomComponent = res.toastRef.componentInstance;
    this.applyIcon(type || 'info', component, override);
    return res;
  }
  success(message?: string, title?: string, override?: Partial<CustomIndividualConfig>): ActiveToast<any> {
    const res = this.toastrSV.success(message, title, override);
    const component: TCustomComponent = res.toastRef.componentInstance;
    this.applyIcon('success', component, override);
    return res;
  }
  error(message?: string, title?: string, override?: Partial<CustomIndividualConfig>): ActiveToast<any> {
    const res = this.toastrSV.error(message, title, override);
    const component: TCustomComponent = res.toastRef.componentInstance;
    this.applyIcon('error', component, override);
    return res;
  }
  info(message?: string, title?: string, override?: Partial<CustomIndividualConfig>): ActiveToast<any> {
    const res = this.toastrSV.info(message, title, override);
    const component: TCustomComponent = res.toastRef.componentInstance;
    this.applyIcon('info', component, override);
    return res;
  }
  warning(message?: string, title?: string, override?: Partial<CustomIndividualConfig>): ActiveToast<any> {
    const res = this.toastrSV.warning(message, title, override);
    const component: TCustomComponent = res.toastRef.componentInstance;
    this.applyIcon('warning', component, override);
    return res;
  }
  clear(toastId?: number): void {
    return this.toastrSV.clear(toastId);
  }
  remove(toastId: number): boolean {
    return this.toastrSV.remove(toastId);
  }
  findDuplicate(title?: string, message?: string, resetOnDuplicate?: boolean, countDuplicates?: boolean): ActiveToast<any> {
    return this.toastrSV.findDuplicate(title, message, resetOnDuplicate, countDuplicates);
  }


  private applyIcon(type: ToastrType, component?: TCustomComponent, override?: Partial<CustomIndividualConfig>) {
    if (!component) { return; }

    const iconDefinition = this.getIconDefinition(type, override);
    component.icon = iconDefinition;
  }
  private getIconDefinition(type: ToastrType, override?: Partial<CustomIndividualConfig>): IconProp {
    if (override?.icon !== undefined) {
      return override.icon;
    }

    switch (type) {
      case 'info':
        return faInfoCircle;
      case 'success':
        return faCheckCircle;
      case 'error':
        return faTimesCircle;
      case 'warning':
        return faExclamationTriangle;
    }
  }
}

export class CustomIndividualConfig<TCustomComponent = ToastrCustomComponent, TPayload = any>
  extends SetData<CustomIndividualConfig<TCustomComponent, TPayload>>
  implements IndividualConfig {
  disableTimeOut: boolean | 'timeOut' | 'extendedTimeOut';
  timeOut: number;
  closeButton: boolean;
  extendedTimeOut: number;
  progressBar: boolean;
  progressAnimation: ProgressAnimationType;
  enableHtml: boolean;
  toastClass: string;
  positionClass: string;
  titleClass: string;
  messageClass: string;
  easing: string;
  easeTime: string | number;
  tapToDismiss: boolean;
  toastComponent?: ComponentType<TCustomComponent>;
  onActivateTick: boolean;
  newestOnTop: boolean;
  payload: TPayload;

  icon?: IconProp;

  constructor(newData?: Partial<CustomIndividualConfig<TCustomComponent, TPayload>>) {
    super();
    this.setData(newData);
  }
}
