import {
  Component,
  Input,
  OnInit
} from '@angular/core';
import { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import { faCheck, faCopy } from '@fortawesome/free-solid-svg-icons';
import { DestroySubscriptions, timeoutPromise } from '@efordevelops/ax-toolbox';
import { TooltipDirective } from 'ngx-bootstrap/tooltip';
import {
  ToastrCustomService
} from '../../_third-party/ep-components/components/toastr-custom/service/toastr-custom.service';

const ANIMATION_MS_FADE = 300;

@Component({
  selector: 'app-btn-copy-text',
  templateUrl: './btn-copy-text.component.html',
  styleUrls: ['./btn-copy-text.component.scss']
})
export class BtnCopyTextComponent
  extends DestroySubscriptions
  implements OnInit {
  private readonly _iconCopy = Object.freeze(faCopy);
  private readonly _iconCoppied = Object.freeze(faCheck);
  currentIcon = this._iconCopy;
  currentIconClass?: 'fade-in' | 'fade-out';
  btnClass: 'btn-primary' | 'btn-secondary' = 'btn-primary';

  @Input() toastMessage?= 'Contenido copiado al portapapeles';
  @Input() content?: string;
  @Input() showIfNoContent = false;

  private isLoading = false;
  constructor(
    private readonly toastr: ToastrCustomService,
  ) {
    super();
  }

  ngOnInit(): void {
  }

  async copyToClipboard(tooltip?: TooltipDirective) {
    if (this.isLoading) { return; }
    this.isLoading = true;
    try {
      await navigator.clipboard.writeText(this.content);
      tooltip?.show();
      await this.animateIcon();
      if (tooltip?.isOpen === true) {
        tooltip.hide();
      }
    } finally {
      this.isLoading = false;
    }
  }

  private async animateIcon() {
    this.btnClass = 'btn-secondary';
    this.animateIcon_Change(this._iconCoppied);
    await timeoutPromise(2500);
    this.btnClass = 'btn-primary';
    this.animateIcon_Change(this._iconCopy);
  }

  private async animateIcon_Change(newIcon: IconDefinition) {
    this.currentIconClass = 'fade-out';
    await timeoutPromise(ANIMATION_MS_FADE);
    this.currentIcon = newIcon;
    this.currentIconClass = 'fade-in';
    await timeoutPromise(ANIMATION_MS_FADE);
  }
}
