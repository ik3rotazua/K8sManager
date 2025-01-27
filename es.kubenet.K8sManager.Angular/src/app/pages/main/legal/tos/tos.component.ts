import {
  Component,
  OnInit,
  ElementRef
} from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ScrollService } from 'src/app/shared/services/scroll/scroll.service';

@Component({
  selector: 'app-tos',
  templateUrl: './tos.component.html',
  styleUrls: ['./tos.component.scss']
})
export class TosComponent implements OnInit {

  constructor(
    public translate: TranslateService,
    public scrollSV: ScrollService,
    public el: ElementRef<HTMLElement>
  ) { }

  ngOnInit(): void {
    this.scrollSV.scrollToByContainer(this.el.nativeElement, undefined, -80);
  }

}
