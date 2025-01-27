import { EventEmitter, inject } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  ParamMap,
  UrlSegment,
  Route,
  CanActivateFn,
  CanActivateChildFn,
  CanMatchFn
} from '@angular/router';
import { BehaviorSubject, firstValueFrom } from 'rxjs';
import { locale } from 'moment';
//#region Angular locales
import { registerLocaleData } from '@angular/common';
import localeEN from '@angular/common/locales/en-GB';
import localeES from '@angular/common/locales/es';
//#endregion
//#region Boostrap locales
import { defineLocale } from 'ngx-bootstrap/chronos';
import { esLocale, enGbLocale } from 'ngx-bootstrap/locale';
//#endregion

import { LangChangeEvent, TranslateService } from '@ngx-translate/core';
import { SeoService } from '../../services/seo/seo.service';

export const STORAGE_KEY_LANG = 'lang';
//#region LANGUAGE DECLARATIONS - KEEP THIS UPDATED
const LANG_BS_DEFAULT = 'en';

// Every key should be present at FRONTEND_LANG_CODES.
// All language codes should be in lowercase.
// If missing, LANGUAGES[LANGUAGE_DEFAULT] will be used.
export const LANGUAGES: IAppLangBsLang = {
  en: {
    angular: localeEN, bootstrap: enGbLocale, bootstrapLangKey: LANG_BS_DEFAULT, moment: 'en'
  },
  // engb: {
  //   angular: localeEN, bootstrap: enGbLocale, bootstrapLangKey: 'engb', moment: 'en'
  // },
  es: {
    angular: localeES, bootstrap: esLocale, bootstrapLangKey: 'es', moment: 'es'
  },
};

// All lang codes must be in lowercase.
export const LANGUAGE_CODES = ['es', 'en'];
export const LANGUAGE_DEFAULT = LANGUAGE_CODES[0];
// npm run translate will pick these values.
// see https://github.com/biesbjerg/ngx-translate-extract for more info.
// Dont't attempt to get the function inside a for loop: it won't work.
import { marker } from '@biesbjerg/ngx-translate-extract-marker';
marker('LANG.ES');
marker('LANG.EN');
marker('LANG.ES_SHORT');
marker('LANG.EN_SHORT');

import {
  markApiErrorStrings
} from '../../models/api-translations/api-translations';
import {
  filter,
  first,
  startWith
} from 'rxjs/operators';
import { BsLocaleService } from 'ngx-bootstrap/datepicker';
// Keep this function's content updates
markApiErrorStrings();
//#endregion

const $IS_GUARD_INITIALIZED = new BehaviorSubject(false);
const $IS_GUARD_INITIALIZED_REQ = new EventEmitter<{
  paramMap: ParamMap;
  seoSV: SeoService;
  translate: TranslateService;
  bsLocaleSV: BsLocaleService;
}>();
const $LANG_PARAM = new BehaviorSubject<string>(null);

$IS_GUARD_INITIALIZED_REQ.pipe(
  first()
).subscribe(async ({ paramMap, seoSV, translate, bsLocaleSV, }) => {

  $IS_GUARD_INITIALIZED_REQ.complete();
  const langCode = paramMap.get(LANG_ROUTE_MARKER);
  $LANG_PARAM.next(langCode);

  await initializeGuard(bsLocaleSV, translate, seoSV);
});

const initializeGuard = async (
  bsLocaleSV: BsLocaleService,
  translate: TranslateService,
  seoSV: SeoService,
) => {
  const isInitialized = await firstValueFrom($IS_GUARD_INITIALIZED);

  if (isInitialized) {
    return;
  }

  registerLocales();
  let langCode = await firstValueFrom($LANG_PARAM);
  if (langCode == null) {
    langCode = localStorage.getItem(STORAGE_KEY_LANG)
      // This allows us to default to the browser language,
      // if the user hasn't use the app before.
      ?? translate.getBrowserLang()?.toLowerCase();
  }

  if (!langCode || !LANGUAGE_CODES.includes(langCode)) {
    langCode = LANGUAGE_DEFAULT;
  }

  initLangListeners(bsLocaleSV, translate);

  await firstValueFrom(translate.use(langCode));
  translate.addLangs(LANGUAGE_CODES);

  await seoSV.init();

  $IS_GUARD_INITIALIZED.next(true);
};

const initLangListeners = async (
  bsLocaleSV: BsLocaleService,
  translate: TranslateService,
) => {

  translate.onLangChange
    .subscribe(async (ev) => {
      const bsKey = LANGUAGES[ev.lang].bootstrapLangKey || LANG_BS_DEFAULT;
      bsLocaleSV.use(bsKey);

      const momentKey = LANGUAGES[ev.lang].moment;
      locale(momentKey);
      localStorage.setItem(STORAGE_KEY_LANG, ev.lang);
    });
};

const registerLocales = () => {
  const defLang = LANGUAGES[LANGUAGE_DEFAULT];
  if (!defLang.angular || !defLang.bootstrap) {
    throw new Error('Default language is missing some definitions.');
  }

  for (const l of Object.keys(LANGUAGES)) {
    const lang = LANGUAGES[l];
    const ang = lang.angular || defLang.angular;
    const bs = lang.bootstrap || defLang.bootstrap;
    const bsKey = lang.bootstrapLangKey || LANG_BS_DEFAULT;

    registerLocaleData(ang, l);
    /**
     * ngx-bootstrap's locales definitions do not include information
     * that are already included in the default locale (which is 'en').
     * If 'en' is overwritten by using defineLocale, data could be lost
     * because it cannot not be included in other locales.
     */
    if (bsKey !== LANG_BS_DEFAULT) {
      defineLocale(bsKey, bs);
    }
  }
};


const isLangInitialized = (
  bsLocaleSV: BsLocaleService,
  translate: TranslateService,
  seoSV: SeoService,
  next: ActivatedRouteSnapshot
) => {
  return isLangParamMapInitialized(bsLocaleSV, translate, seoSV, next.paramMap);
};

const isLangParamMapInitialized = async (
  bsLocaleSV: BsLocaleService,
  translate: TranslateService,
  seoSV: SeoService,
  paramMap: ParamMap,
) => {
  $IS_GUARD_INITIALIZED_REQ.next({ paramMap, translate, seoSV, bsLocaleSV });

  const obs = $IS_GUARD_INITIALIZED
    .pipe(filter(isInit => isInit === true));

  const res = await firstValueFrom(obs);
  return res;
};

export const LANG_ROUTE_MARKER = ':navLangCode';

export const canMatch: CanMatchFn = (
  route: Route,
  segments: UrlSegment[]
) => {
  const [bsLocaleSV, translate, seoSV] = [
    inject(BsLocaleService),
    inject(TranslateService),
    inject(SeoService),
  ];

  const segment = segments
    .find((s) => s.parameterMap.has(LANG_ROUTE_MARKER))
    ?? new UrlSegment('', {});

  return isLangParamMapInitialized(
    bsLocaleSV,
    translate,
    seoSV,
    segment.parameterMap);
};

export const canActivate: CanActivateFn = (
  next: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
) => {
  const [bsLocaleSV, translate, seoSV] = [
    inject(BsLocaleService),
    inject(TranslateService),
    inject(SeoService),
  ];

  return isLangInitialized(bsLocaleSV, translate, seoSV, next);
};

export const canActivateChild: CanActivateChildFn = (
  next: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
) => {
  const [bsLocaleSV, translate, seoSV] = [
    inject(BsLocaleService),
    inject(TranslateService),
    inject(SeoService),
  ];
  return isLangInitialized(bsLocaleSV, translate, seoSV, next);
};

export interface IAppLangBsLang {
  [langCode: string]: IAppLangBsLangValue;
}

export interface IAppLangBsLangValue {
  angular: any;
  bootstrap: any;
  bootstrapLangKey: string;
  moment: string;
}
