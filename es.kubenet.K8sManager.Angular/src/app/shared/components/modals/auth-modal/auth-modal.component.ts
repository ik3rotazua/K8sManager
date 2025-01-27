import { Component, ViewChild } from '@angular/core';
import {
  AxBsModalUtilities,
  BsModalConfirmationMessageComponent,
  BsModalConfirmationMessageModule,
  DestroySubscriptions
} from '@efordevelops/ax-toolbox';
import { AuthFormComponent } from '../../forms/auth-form/auth-form.component';
import {
  first,
  from,
  takeUntil
} from 'rxjs';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-auth-modal',
  standalone: true,
  imports: [
    TranslateModule,
    BsModalConfirmationMessageModule,
    AuthFormComponent,
  ],
  templateUrl: './auth-modal.component.html',
  styleUrl: './auth-modal.component.scss'
})
export class AuthModalComponent extends DestroySubscriptions {
  @ViewChild('modal') modal: BsModalConfirmationMessageComponent;
  @ViewChild('form', { static: false }) form: AuthFormComponent;

  open() {
    this.modal.open();
  }

  close() {
    this.modal.close();
  }

  async openAsync() {
    const isConfirmed = await AxBsModalUtilities.waitUntilClose(
      this.modal,
      async () => { },
      async () => {
        this.form.authSuccess.pipe(
          takeUntil(this.$onDestroyed),
          takeUntil(this.modal.modalRef.onHide),
          first(),
        ).subscribe(() => {
          this.modal.clickConfirm.next();
        });
      },
    );

    return isConfirmed;
  }

  openObs() {
    const p = this.openAsync();
    const $p = from(p);
    return $p;
  }
}
