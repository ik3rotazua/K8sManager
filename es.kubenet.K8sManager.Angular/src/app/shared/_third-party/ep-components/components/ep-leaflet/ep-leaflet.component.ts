import {
  Component,
  ViewChild,
  ElementRef,
  Input,
  OnInit,
  OnDestroy,
  Output,
  EventEmitter
} from '@angular/core';
import * as Leaflet from 'leaflet';
import {
  EpLeafletActionButton,
  EpLeafletActionButtonCollection,
  EpLeafletActionButtonAction,
} from './models';

const LEAFLET_DEFAULT_MARKER = Leaflet.icon({
  iconUrl: '/assets/leaflet/images/marker-icon.png',
  iconRetinaUrl: '/assets/leaflet/images/marker-icon-2x.png',
  iconSize: Leaflet.point(25, 41),
  shadowUrl: '/assets/leaflet/images/marker-shadow.png',
  shadowSize: Leaflet.point(41, 41),
  shadowAnchor: Leaflet.point(12, 20),
});
const LEAFLET_DEFAULT_FILLCOLOR = '#FF0000';

@Component({
  selector: 'app-ep-leaflet',
  templateUrl: './ep-leaflet.component.html',
  styleUrls: ['./ep-leaflet.component.scss'],
})
export class EpLeafletComponent implements OnInit, OnDestroy {
  private map: Leaflet.Map;
  private markerLayer: Leaflet.FeatureGroup<Leaflet.Marker>;
  private circleLayer: Leaflet.FeatureGroup<Leaflet.Circle>;

  @ViewChild('container', { static: true }) container: ElementRef;

  // ``
  @Input() tileLayer: { url: string, attribution: string } = {
    url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    // url: 'https://maps.wikimedia.org/osm-intl/{z}/{x}/{y}.png',
    attribution: [
      `&copy;`,
      `<a href="https://www.openstreetmap.org/copyright">Colaboradores de OpenStreetMap</a>`,
      `&hearts;`,
      `<a class="donate-attr" href="https://donate.openstreetmap.org">Hacer una donaci&oacute;n</a>.`,
    ].join(' ')
  };

  private _markers: Leaflet.Marker[] = [];
  @Input()
  set markers(markers: Leaflet.Marker[]) {
    if (!markers) { markers = []; }
    this._markers = markers;
  }
  private _circles: Leaflet.Circle[] = [];
  @Input()
  set circles(circles: Leaflet.Circle[]) {
    if (!circles) { circles = []; }
  }

  @Input() initialCoords?: Leaflet.LatLng = null;
  /** Wether the initial coords should be fitted into the initial zoom of the map when there are no markers nor circles available */
  @Input() initialCoordsFitAlways = false;
  @Input() maxZoom = 19;
  @Input() showYouMarker = true;
  // eslint-disable-next-line,no-underscore-dangle,id-blacklist,id-match
  @Input() labelMarker_YourPosition_Title = 'You';
  // eslint-disable-next-line, no-underscore-dangle, id-blacklist, id-match
  @Input() labelMarker_YourPosition_Body = 'This marker represents your current location';

  //#region Action buttons
  @Input() actionButtons = new EpLeafletActionButtonCollection()
    .addButton(new EpLeafletActionButton()
      .setData({
        iconName: 'map-marker-alt',
        color: 'primary',
        action: EpLeafletActionButtonAction.OPEN_MAPS_ME
      }));
  //#endregion

  //#region Output events
  @Output() mapClicked = new EventEmitter<Leaflet.LatLng>();
  @Output() mapLongPressed = new EventEmitter<Leaflet.LatLng>();
  @Output() userLocated = new EventEmitter<Leaflet.LatLng>();
  @Output() mapInitted = new EventEmitter<void>();
  //#endregion

  get showActionButtons() {
    return false;
  }

  constructor(
    // public geolocation: Geolocation,
  ) {
  }

  ngOnInit() {
    setTimeout(() => {
      this.initMap();
    }, 0);
  }
  ngOnDestroy() {
    if (this.map) {
      this.map.remove();
    }
  }

  executeAction(button: EpLeafletActionButton) {
    button.disabled = true;
    if (button.action === EpLeafletActionButtonAction.OPEN_MAPS_COORDS) {
      this.openMapsCoords(button.coords);
      button.disabled = false;
    } else if (button.action === EpLeafletActionButtonAction.OPEN_MAPS_ME) {
      this.getMylocation(true)
        .then((coords) => {
          this.createMyLocationMarker(coords);
          button.disabled = false;
          this.goTo(coords);
        }, () => {
          button.disabled = false;
        });
    } else if (button.action === EpLeafletActionButtonAction.OPEN_MAPS_COORDS_NAVIGATE) {
      this.getMylocation(true)
        .then((coords) => {
          button.disabled = false;
          this.navigateToCoords(coords, button.coords);
        });
    } else if (button.action === EpLeafletActionButtonAction.CUSTOM_ACTION && button.callback && typeof (button.callback) === 'function') {
      button.callback(this, button);
      button.disabled = false;
    }
  }
  private openMapsCoords(coords: Leaflet.LatLng) {
    if (!coords || coords.lat == null || coords.lng == null) {
      throw new Error('Coords cannot be empty for this action.');
    }

    const uri = `https://www.google.com/maps/search/?api=1&query=${coords.lat},${coords.lng}`;
    window.open(uri, '_blank');
  }
  private navigateToCoords(from: Leaflet.LatLng, to: Leaflet.LatLng) {
    if (!from || from.lat == null || from.lng == null) {
      throw new Error('Coords cannot be empty for this action.');
    }
    if (!to || to.lat == null || to.lng == null) {
      throw new Error('Coords cannot be empty for this action.');
    }

    const uri = `https://www.google.com/maps/dir/${from.lat},${from.lng}/${to.lat},${to.lng}`;
    window.open(uri, '_blank');
  }

  getMylocation(andSetView = false) {
    const p = new Promise<Leaflet.LatLng>((resolve, reject) => {
      this.map
        .locate({
          setView: andSetView || false,
          maxZoom: andSetView ? this.maxZoom : null
        })
        .on('locationfound', (e: Leaflet.LocationEvent) => {
          resolve(e.latlng);
          this.userLocated.next(e.latlng);
        })
        .on('locationerror', (e) => {
          const err = e.type || e.message || e;
          reject(err);
        });
    });
    return p;
  }

  private onMapClick(event: Leaflet.LeafletMouseEvent) {
    this.mapClicked.next(event.latlng);
  }
  private onMapLongPress(event: Leaflet.LeafletMouseEvent) {
    this.mapLongPressed.next(event.latlng);
  }
  private initMap() {
    this.map = Leaflet.map(this.container.nativeElement, { attributionControl: null })
      .fitWorld();
    Leaflet.tileLayer(this.tileLayer.url, {
      maxZoom: this.maxZoom,
    }).addTo(this.map);

    if (this.tileLayer.attribution) {
      this.map.addControl(Leaflet.control.attribution().addAttribution(this.tileLayer.attribution));
    }

    this.map.on('click', this.onMapClick.bind(this));
    this.map.on('contextmenu', this.onMapLongPress.bind(this));

    this.markerLayer = Leaflet.featureGroup();
    this.circleLayer = Leaflet.featureGroup();
    this.map
      .addLayer(this.markerLayer)
      .addLayer(this.circleLayer);

    for (const m of this._markers) {
      if (m != null) {
        // if (!m.options.icon) { m.setIcon(LEAFLET_DEFAULT_MARKER); }
        m.setIcon(LEAFLET_DEFAULT_MARKER);
        this.markerLayer.addLayer(m);
      }
    }
    for (const c of this._circles) {
      if (c != null) {
        this.circleLayer.addLayer(c);
      }
    }

    if (this.showYouMarker) {
      this.getMylocation(true)
        .then((coords) => {
          this.createMyLocationMarker(coords);
          this.recalculateBounds();
        });
    }
    else {
      this.recalculateBounds();
    }

    setTimeout(() => {
      this.mapInitted.next(null);
    }, 250);
  }
  recalculateBounds() {
    const markerBounds = this.markerLayer.getBounds();
    const circleBounds = this.circleLayer.getBounds();

    let bounds: Leaflet.LatLngBounds;

    if (markerBounds.isValid()) {
      if (bounds == null) bounds = markerBounds.pad(0.5);
      else bounds.extend(markerBounds.pad(0.5));
    }
    if (circleBounds.isValid()) {
      if (bounds == null) bounds = circleBounds.pad(0.5);
      else bounds.extend(circleBounds.pad(0.5));
    }

    if (this.initialCoords != null) {
      const icBounds = Leaflet.latLng(this.initialCoords.lat, this.initialCoords.lng).toBounds(50).pad(0.5);
      if (bounds == null) bounds = icBounds.pad(0.5);
      else if (this.initialCoordsFitAlways) bounds.extend(icBounds.pad(0.5));
    }

    if (bounds == null) return;
    this.map.fitBounds(bounds);
  }

  createMyLocationMarker(coords: Leaflet.LatLng) {
    this.removeMyLocationMarker();
    const content = `
    <h4>${this.labelMarker_YourPosition_Title}</h4>
    <ion-note>${this.labelMarker_YourPosition_Body}</ion-note>
    `;

    this.createMarker(
      coords,
      Leaflet.popup()
        .setContent(content));
  }
  removeMyLocationMarker() {
    const content = `
    <h4>${this.labelMarker_YourPosition_Title}</h4>
    <ion-note>${this.labelMarker_YourPosition_Body}</ion-note>
    `;
    const myLocation = this.markerLayer.getLayers().filter(m => m.getPopup().getContent() === content);
    for (const m of myLocation) {
      m.remove();
      const id = this.markerLayer.getLayerId(m);
      this.markerLayer.removeLayer(id);
    }
  }
  createMarker(latlng: Leaflet.LatLng, popup: Leaflet.Popup, onClick?: (event: Leaflet.LeafletMouseEvent) => void) {
    const marker = Leaflet.marker([latlng.lat, latlng.lng], { icon: LEAFLET_DEFAULT_MARKER })
      .on('click', (ev: Leaflet.LeafletMouseEvent) => {
        if (onClick) { onClick(ev); }
      });
    marker.bindPopup(popup.getContent(), popup.options);
    this.markerLayer.addLayer(marker);
  }
  cleanMarkers() {
    // const p = new Promise<null>((resolve) => {
    const markers = this.markerLayer.getLayers();
    for (const m of markers) {
      const id = this.markerLayer.getLayerId(m);
      this.markerLayer.removeLayer(id);
    }
    // resolve();
    // });
    // return p;
  }

  createCircle(latlng: Leaflet.LatLng, radius: number, popup: Leaflet.Popup, onClick?: (event: Leaflet.LeafletMouseEvent) => void) {
    const circle = Leaflet.circle([latlng.lat, latlng.lng], radius, { fillColor: LEAFLET_DEFAULT_FILLCOLOR })
      .on('click', (ev: Leaflet.LeafletMouseEvent) => {
        if (onClick) { onClick(ev); }
      });
    circle.bindPopup(popup.getContent(), popup.options);
    this.circleLayer.addLayer(circle);
    return circle;
  }
  cleanCircles() {
    const circles = this.circleLayer.getLayers();
    for (const c of circles) {
      const id = this.circleLayer.getLayerId(c);
      this.circleLayer.removeLayer(id);
    }
  }

  goTo(latlng: Leaflet.LatLng) {
    this.map.setView(
      latlng,
      this.map.getMaxZoom(),
      {
        animate: true,
      });
  }
}
