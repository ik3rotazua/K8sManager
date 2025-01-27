import {
  Component,
  OnInit,
  Input,
  HostBinding
} from '@angular/core';
import { faBars } from '@fortawesome/free-solid-svg-icons';
import { DestroySubscriptions } from '@efordevelops/ax-toolbox';
import { faIntSlash } from 'src/app/shared/models/integra-icons';
import { toFontAwesome } from 'src/app/shared/utils/integra-icons.utils';
import { NavSidebarComponent } from '../nav-sidebar/nav-sidebar.component';

type This = NavTopbarComponent;
const CSS_CLASS_COMPONENT = 'navbar navbar-expand-md navbar-light border-0 d-none d-md-flex py-2';

@Component({
  selector: 'app-nav-topbar',
  templateUrl: './nav-topbar.component.html',
  styleUrls: ['./nav-topbar.component.scss']
})
export class NavTopbarComponent
  extends DestroySubscriptions
  implements OnInit {
  @HostBinding('class') class = CSS_CLASS_COMPONENT;

  @Input() sidebar: NavSidebarComponent;

  readonly _iconMenuToggle = Object.freeze(faBars);
  readonly _iconDivider = Object.freeze(toFontAwesome(faIntSlash));

  constructor(
  ) {
    super();
  }

  ngOnInit(): void {
  }

}
