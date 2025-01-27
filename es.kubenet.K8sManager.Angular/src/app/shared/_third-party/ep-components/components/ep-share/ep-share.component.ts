import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter
} from '@angular/core';

@Component({
  selector: 'app-ep-share',
  templateUrl: './ep-share.component.html',
  styleUrls: ['./ep-share.component.scss']
})
export class EpShareComponent implements OnInit {
  @Input() labelShare = '';
  @Input() cssClassBtn = 'btn btn-link';

  @Input() shareTitle = document.title;
  @Input() shareText = document.title;
  @Input() shareUrl = document.location.href;

  @Output() shareClick = new EventEmitter<void>();
  /** 
   * Wether the share callback was successfully executed.
   * True if .share() was used.
   * False if coppied to clipboard
   * */
  @Output() shareSuccess = new EventEmitter<boolean>();
  /** 
   * Wether the share callback could not be successfully executed.
   * True if .share() was used.
   * False if coppied to clipboard
   * */
  @Output() shareError = new EventEmitter<boolean>();

  constructor() { }

  ngOnInit(): void {
  }
  onBtnShareClick() {
    this.shareClick.next();
    this.share();
  }

  private share(): Promise<void> {
    if (navigator['share']) {
      return (<Promise<unknown>>navigator['share']({
        title: this.shareTitle,
        text: this.shareText,
        url: this.shareUrl
      })).then(() => {
        this.shareSuccess.next(true);
      }, () => {
        this.shareError.next(true);
      }).catch(() => {
        this.shareError.next(true);
      });
    } else {
      return this.copyToClipboard()
        .then(() => {
          this.shareSuccess.next(false);
        }, () => {
          this.shareError.next(false);
        }).catch(() => {
          this.shareError.next(false);
        });
    }
  }
  private async copyToClipboard() {
    const copyText = `${this.shareTitle ? `${this.shareText}\n` : ''}${this.shareUrl}`;
    if (navigator.clipboard) {
      await navigator.clipboard.writeText(copyText);
    } else {
      const textarea = document.createElement('textarea');
      textarea.value = copyText;
      textarea.style.top = '0';
      textarea.style.left = '0';
      textarea.style.position = 'fixed';
      document.body.appendChild(textarea);
      textarea.focus();
      textarea.select();

      try {
        // eslint-disable-next-line deprecation/deprecation
        const success = document.execCommand('copy');
        if (!success) {
          throw new Error('Command "copy" failed.');
        }
      } finally {
        textarea.blur();
      }
    }
  }
}
