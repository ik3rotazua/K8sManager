import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ILayoutMenuItem } from '@efordevelops/ax-toolbox';
import {
  AppMenuService
} from 'src/app/shared/services/app-menu/app-menu.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  _menuItems: ILayoutMenuItem[] = [];

  // se genera el ngZone para recargar completamente lo que sería la vista para que cargue los elementos correctamente
  constructor(
    private readonly serviceMenu: AppMenuService,
    private readonly router: Router,
  ) { }

  ngOnInit(): void {
    this.initMenuItems();
  }

  private async initMenuItems() {
    const thisUrl = this.router.routerState.snapshot.url;
    this._menuItems = (await this.serviceMenu.getMenuItems())
      .filter(i => {
        if ((i.routerLinkCommands ?? []).join('/') !== thisUrl) {
          return true;
        }

        const hasValidChildren = (i.children ?? [])
          .filter(c => (c.routerLinkCommands ?? []).join('/') !== thisUrl)
          .length > 0;

        return hasValidChildren;
      });
  }
}
