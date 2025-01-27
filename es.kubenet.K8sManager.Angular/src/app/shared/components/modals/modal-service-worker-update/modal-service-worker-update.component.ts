import {
  Component,
  OnInit,
  ViewChild
} from '@angular/core';
import { BsModalConfirmationMessageComponent } from '@efordevelops/ax-toolbox';
import { BsModalService } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-modal-service-worker-update',
  templateUrl: './modal-service-worker-update.component.html',
  styleUrls: ['./modal-service-worker-update.component.scss']
})
export class ModalServiceWorkerUpdateComponent
  extends BsModalConfirmationMessageComponent
  implements OnInit
{
  @ViewChild(BsModalConfirmationMessageComponent) modalConfirmation: BsModalConfirmationMessageComponent;

  constructor(
    modalSV: BsModalService
  ) {
    super(modalSV);
  }

  ngOnInit(): void {
  }


  open() {
    return this.modalConfirmation.open();
  }
  close() {
    this.modalConfirmation.close();
  }
}
