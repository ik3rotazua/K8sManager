/* tslint:disable */
export interface LayoutMenuItem {
  children?: null | Array<LayoutMenuItem>;
  hasChildren?: boolean;
  iconName?: null | string;
  iconPreffix?: null | string;
  label?: null | string;
  routerLinkActiveCssClass?: null | string;
  routerLinkCommands?: null | Array<string>;
}
