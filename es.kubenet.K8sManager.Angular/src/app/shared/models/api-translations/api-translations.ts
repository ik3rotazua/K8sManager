import { marker } from '@biesbjerg/ngx-translate-extract-marker';

/**
 * This function does nothing by itself, it is only used
 * to keep track of the errors the API returns and make sure
 * translations files are updated.
 */
export function markApiStrings() {
  markApiErrorStrings();
  markApiResponseStrings();
}
export function markApiErrorStrings() {
  marker('API.ERROR.AUTH.PASS.FAIL');
}
export function markApiResponseStrings() {
  marker('GENERIC.BTN.LOGOUT');

  marker('MENU.PAGE.HOME');

  marker('MENU.PAGE.COMPANY.MAIN');

  marker('MENU.PAGE.EMPLOYEE.MAIN');
  marker('MENU.PAGE.EMPLOYEE.LIST');
  marker('MENU.PAGE.EMPLOYEE.DETAILS');
  marker('MENU.PAGE.EMPLOYEE.NEW');
}
