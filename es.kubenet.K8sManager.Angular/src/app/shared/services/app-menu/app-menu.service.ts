import { Injectable } from '@angular/core';
import { ILayoutMenuItem, keys } from '@efordevelops/ax-toolbox';
import { BehaviorSubject, firstValueFrom } from 'rxjs';
import { first } from 'rxjs/operators';
import { LayoutMenuService } from '../../api/services';
import { LayoutMenuItem as ApiMenuItem } from '../../api/models';
import { FaIconLibrary } from '@fortawesome/angular-fontawesome';

@Injectable({
  providedIn: 'root'
})
export class AppMenuService {

  // menu item albergará los elementos rescatados de la api
  private _menuItem: ILayoutMenuItem[] = [];
  // comprueba el comportamiento de los items y devuelve false toco el rato
  private isReady = new BehaviorSubject<boolean>(false);

  constructor(
    private readonly layoutSv: LayoutMenuService,
    private readonly icons: FaIconLibrary,
  ) {
    this.initAsync();
  }

  private async initAsync() {
    this.isReady.next(false);
    // entramos en el servicio de la api para que nos devuelva ese item y los mapeamos
    const apiCall = this.layoutSv.apiAppLayoutmenuGet$Json();
    const data = await firstValueFrom(apiCall);

    const originalMenuItems = data
      .map((apiMenu) => this.toAppMenuItem(apiMenu));

    // Al cambiar el companyNo, tenemos que cambiar las rutas que necesiten
    // el valor de la empresa. Para no llamar con cada cambio a la API,
    // necesitamos una subscripción que cambie de forma automática las rutas
    // del menú. Para que eso funcione, necesitamos tener emparejados
    // la ruta original (que tendrá las claves que hay que reemplazar) junto
    // con la instancia del ítem del menú que está usando la aplicación.
    const mappedMenuItems = originalMenuItems
      .map(item => ({
        original: item,
        instanced: this.getPreparedMenuItem(item, {}),
      }));

    // Preparamos las instancias que van a mutar a lo largo del ciclo de vida
    // de la app.
    this._menuItem = mappedMenuItems.map(i => i.instanced);

    // lanzamos un true para que sepa que ha terminado
    this.isReady.next(true);
  }

  private toAppMenuItem(apiItem: ApiMenuItem) {
    const item: ILayoutMenuItem = {
      label: apiItem.label,
      routerLinkActiveCssClass: apiItem.routerLinkActiveCssClass ?? 'active',
      routerLinkCommands: apiItem.routerLinkCommands,
      children: [],
    };

    if ((apiItem.children ?? []).length > 0) {
      item.children = apiItem.children.map(c => this.toAppMenuItem(c));
    }

    if (apiItem.iconPreffix && apiItem.iconName) {
      const icon = this.icons.getIconDefinition(apiItem.iconPreffix as any, apiItem.iconName as any);
      if (icon) {
        item.icon = icon;
      }
    }

    return item;
  }

  async getMenuItems() {
    // hacemos una promesa que se resolverá cuando, haciendo el pipe, primero el isReady sea true
    const obs = this.isReady
      .pipe(first(isReady => isReady === true));
    await firstValueFrom(obs);

    return this._menuItem;
  }

  private getPreparedMenuItem(item: ILayoutMenuItem, properties: { [searchFor: string]: string }): ILayoutMenuItem {
    const copy: ILayoutMenuItem = {
      ...item,
      children: item.children == null
        ? item.children
        : item.children.map(c => this.getPreparedMenuItem(c, properties)),
      routerLinkCommands: item.routerLinkCommands == null
        ? item.routerLinkCommands
        : item.routerLinkCommands.map(cmd => this.getMenuItemCommand(cmd, properties)),
    };

    return copy;
  }

  private getMenuItemCommand(command: string, properties: { [searchFor: string]: string }) {
    const searchForKeys = keys(properties) as string[];

    for (const ks of searchForKeys) {
      command = command.replace(ks, properties[ks]);
    }

    return command;
  }
}
