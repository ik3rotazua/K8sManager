import { ModuleWithProviders, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastrCustomComponent } from './toastr-custom.component';
import { GlobalConfig, ToastrModule } from 'ngx-toastr';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';



@NgModule({
  declarations: [ToastrCustomComponent],
  imports: [
    CommonModule,
    FontAwesomeModule,
  ]
})
export class ToastrCustomModule {
  static forRoot(config?: Partial<GlobalConfig>): ModuleWithProviders<ToastrCustomModule> {
    if (config == null) { config = {}; }
    config.toastComponent = ToastrCustomComponent;

    return ToastrModule.forRoot(config);
  }
}
