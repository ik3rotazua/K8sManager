import { ApplicationRef, Injectable } from '@angular/core';
import { SwUpdate, VersionReadyEvent } from '@angular/service-worker';
import { DestroySubscriptions } from '@efordevelops/ax-toolbox';
import {
  BehaviorSubject,
  concat,
  interval
} from 'rxjs';
import {
  filter,
  first,
  map,
  takeUntil
} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ServiceWorkerService
  extends DestroySubscriptions {
  currentVersion: string;
  availableVersion: string;
  private updateAvailable = false;
  private updateInProgress = false;

  onUpdateAvailable = new BehaviorSubject<boolean>(this.updateAvailable);
  onUpdateInProgress = new BehaviorSubject<boolean>(this.updateInProgress);

  private swUpdate: SwUpdate;
  constructor(
    appRef: ApplicationRef,
    updates: SwUpdate,
  ) {
    super();
    this.swUpdate = updates;

    const appIsStableListener = appRef.isStable.pipe(first(isStable => isStable === true));
    const intervalListener = interval(5 * 60 * 1000);
    const fullListener = concat(appIsStableListener, intervalListener);

    fullListener.subscribe(() => updates.checkForUpdate().finally(() => { }));

    updates.versionUpdates.pipe(
      takeUntil(this.$onDestroyed),
      filter((evt): evt is VersionReadyEvent => evt.type === 'VERSION_READY'),
      map(evt => ({
        type: 'UPDATE_AVAILABLE',
        current: evt.currentVersion,
        available: evt.latestVersion,
      })))
      .subscribe(() => {
        this.updateAvailable = true;
        this.onUpdateAvailable.next(this.updateAvailable);
      });
  }

  async updateApp() {
    this.updateInProgress = true;
    this.onUpdateInProgress.next(this.updateInProgress);
    try {
      await this.swUpdate.activateUpdate();
      document.location.reload();
    } finally {
      this.updateInProgress = false;
      this.onUpdateInProgress.next(this.updateInProgress);
    }
  }
}
