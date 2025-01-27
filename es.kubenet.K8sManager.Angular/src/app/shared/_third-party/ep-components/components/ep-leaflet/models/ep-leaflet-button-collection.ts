import { EpLeafletActionButton } from './ep-leaflet-button';

export class EpLeafletActionButtonCollection {
  icon = 'arrow-dropdown';
  color = 'primary';
  buttons: EpLeafletActionButton[] = [];

  constructor() {
  }
  clearButtons() {
    this.buttons = [];
    return this;
  }
  addButton(button: EpLeafletActionButton) {
    this.buttons.push(button);
    return this;
  }
  setIcon(name: string) {
    this.icon = name;
    return this;
  }
  setColor(color: string) {
    this.color = color;
    return this;
  }
}