import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ModalServiceWorkerUpdateComponent
} from './modal-service-worker-update.component';
import { TranslateModule } from '@ngx-translate/core';
import { BsModalConfirmationMessageModule } from '@efordevelops/ax-toolbox';

@NgModule({
  declarations: [ModalServiceWorkerUpdateComponent],
  exports: [ModalServiceWorkerUpdateComponent],
  imports: [
    CommonModule,
    TranslateModule,
    BsModalConfirmationMessageModule
  ]
})
export class ModalServiceWorkerUpdateModule { }
