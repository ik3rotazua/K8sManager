import {
  Component,
  OnInit,
  ElementRef
} from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ScrollService } from 'src/app/shared/services/scroll/scroll.service';

@Component({
  selector: 'app-cookies',
  templateUrl: './cookies.component.html',
  styleUrls: ['./cookies.component.scss']
})
export class CookiesComponent implements OnInit {

  constructor(
    public translate: TranslateService,
    public scrollSV: ScrollService,
    public el: ElementRef<HTMLElement>
  ) { }

  ngOnInit(): void {
    this.scrollSV.scrollToByContainer(this.el.nativeElement, undefined, -80);
  }

}
