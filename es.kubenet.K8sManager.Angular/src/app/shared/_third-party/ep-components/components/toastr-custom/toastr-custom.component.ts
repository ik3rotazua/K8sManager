import { Component, OnInit } from '@angular/core';
import {
  animate,
  state,
  style,
  transition,
  trigger
} from '@angular/animations';
import {
  Toast,
  ToastPackage,
  ToastrService
} from 'ngx-toastr';
import { IconProp } from '@fortawesome/fontawesome-svg-core';

@Component({
  selector: 'app-toastr-custom',
  templateUrl: './toastr-custom.component.html',
  styleUrls: ['./toastr-custom.component.scss'],
  animations: [
    trigger('flyInOut', [
      state('inactive', style({ opacity: 0 })),
      state('active', style({ opacity: 1 })),
      state('removed', style({ opacity: 0 })),
      transition(
        'inactive => active',
        animate('{{ easeTime }}ms {{ easing }}')
      ),
      transition(
        'active => removed',
        animate('{{ easeTime }}ms {{ easing }}')
      )
    ])
  ],
})
export class ToastrCustomComponent
  extends Toast
  implements OnInit {
  icon: IconProp;

  constructor(
    protected toastrService: ToastrService,
    public toastPackage: ToastPackage,
  ) {
    super(toastrService, toastPackage);
  }

  ngOnInit(): void {
  }

}
