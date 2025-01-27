import { Injectable, isDevMode } from '@angular/core';
import { v4 as uuid } from 'uuid';

const STORE_KEY_TEST = `store-test-${uuid()}`;
enum GenericStorage {
  local = 'local',
  session = 'session',
};

const DEFAULT_DESERIALIZER: (<T>(json?: string) => T | undefined) = <T>(json?: string) => json == null
  ? undefined
  : (JSON.parse(json) as T)
  ;

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {
  private static readonly genericStorePriority: Readonly<Map<GenericStorage, boolean>> = new Map([
    [GenericStorage.local, LocalStorageService.isLocalStorageAvailable()],
    [GenericStorage.session, LocalStorageService.isSessionStorageAvailable()],
  ]);

  constructor() { }

  setValue<TValue>(
    key: string,
    value: TValue,
    serializer: (value: TValue) => string = (value) => JSON.stringify(value)
  ): void {
    const toJson = serializer(value);
    const method = LocalStorageService.getGenericStorageSetMethod();
    method(key, toJson);
  }

  getValue<TValue>(
    key: string,
    deserializer = DEFAULT_DESERIALIZER
  ): TValue | undefined {
    const method = LocalStorageService.getGenericStorageGetMethod();
    const asJson = method(key);

    const value = deserializer<TValue>(asJson);
    return value;
  }

  removeValue(key: string): void {
    localStorage.removeItem(key);
  }

  private static getGenericStorageGetMethod() {
    const store = LocalStorageService.getAvailableGenericStorage();
    if (!store) { return null; }

    const method: Storage['getItem'] =
      store === 'local'
        ? localStorage.getItem.bind(localStorage)
        : sessionStorage.getItem.bind(localStorage);

    return method;
  }

  private static getGenericStorageSetMethod() {
    const store = LocalStorageService.getAvailableGenericStorage();
    if (!store) { return null; }

    const method: Storage['setItem'] =
      store === 'local'
        ? localStorage.setItem.bind(localStorage)
        : sessionStorage.setItem.bind(localStorage);
    
    return method;
  }

  private static getAvailableGenericStorage(): GenericStorage | undefined {
    const stores = LocalStorageService.genericStorePriority.keys();
    for (const store of stores) {
      if (LocalStorageService.genericStorePriority.get(store)) {
        return store;
      }
    }

    return undefined;
  }

  private static isLocalStorageAvailable(): boolean {
    try {
      localStorage.setItem(STORE_KEY_TEST, 'abcd123');
      localStorage.removeItem(STORE_KEY_TEST);
      return true;
    } catch (e) {
      if (isDevMode()) {
        console.group('[DEV] Storage');
        console.error('LocalStorage is not available:');
        console.error(e);
        console.groupEnd();
      }
      return false;
    }
  }
  private static isSessionStorageAvailable(): boolean {
    try {
      sessionStorage.setItem(STORE_KEY_TEST, 'abcd123');
      sessionStorage.removeItem(STORE_KEY_TEST);
      return true;
    } catch (e) {
      if (isDevMode()) {
        console.group('[DEV] Storage');
        console.error('SessionStorage is not available:');
        console.error(e);
        console.groupEnd();
      }
      return false;
    }
  }
}
