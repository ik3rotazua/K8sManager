import { LatLng } from 'leaflet';
import { EpLeafletActionButtonAction } from './ep-leaflet-button-action';
import { EpLeafletComponent } from '../ep-leaflet.component';
import { IconPrefix, IconName } from '@fortawesome/fontawesome-svg-core';
import { SetData } from '@efordevelops/ax-toolbox';

export class EpLeafletActionButton
  extends SetData<EpLeafletActionButton> {
  iconPrefix: IconPrefix = 'fas';
  iconName: IconName = 'map-pin';
  color = 'secondary';
  tooltip = null;
  action: EpLeafletActionButtonAction;
  disabled = false;
  coords?: LatLng;
  /**
     * Will only be called if action = custom.
     */
  callback?: (component: EpLeafletComponent, button: EpLeafletActionButton) => void;

  constructor() {
    super();
  }

  /**
     * @deprecated Use `.setData({ iconName: iconName })` instead
     */
  setIcon(name: IconName) {
    return this.setData({ iconName: name });
  }
  /**
     * @deprecated Use `.setData({ color: color })` instead
     */
  setColor(color: string) {
    return this.setData({ color: color });
  }
  /**
     * @deprecated Use `.setData({ action: action, coords: coords })` instead
     */
  setAction(action: EpLeafletActionButtonAction, coords?: LatLng) {
    return this.setData({ action: action, coords: coords || null });
  }
  setCallback(callback: (component: EpLeafletComponent, button: EpLeafletActionButton) => void) {
    return this.setData({
      callback: callback,
      action: EpLeafletActionButtonAction.CUSTOM_ACTION,
      coords: this.coords || null,
    });
  }
  /**
     * @deprecated Use `.setData({ coords: coords })` instead
     */
  setCoords(coords?: LatLng) {
    return this.setData({ coords: coords });
  }
  /**
     * @deprecated Use `.setData({ tooltip: newTooltip })` instead
     */
  setTooltip(newTooltip: string) {
    return this.setData({ tooltip: newTooltip });
  }
}
