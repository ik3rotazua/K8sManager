import { NgModule } from '@angular/core';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';
import { ApiModule } from './shared/api/api.module';
import {
  ApiErrorInterceptor
} from './shared/interceptors/api-error/api-error.interceptor';
import {
  FaIconLibrary,
  FontAwesomeModule
} from '@fortawesome/angular-fontawesome';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { fab } from '@fortawesome/free-brands-svg-icons';
import { faEnvelope, faClock } from '@fortawesome/free-regular-svg-icons';

// CKEditor language load.
// MUST BE INCLUDED ON COMPILATION TIME
import '@ckeditor/ckeditor5-build-classic/build/translations/es';
import '@ckeditor/ckeditor5-build-classic/build/translations/eu';
import {
  ApiHeaderLangInterceptor
} from './shared/interceptors/api-headers/api-header-lang/api-header-lang.interceptor';
import { CarouselModule } from 'ngx-owl-carousel-o';
import {
  EpFullscreenImgModule
} from './shared/_third-party/ep-components/components/ep-fullscreen-img/ep-fullscreen-img.module';
import { AccordionModule } from 'ngx-bootstrap/accordion';
import { AlertModule } from 'ngx-bootstrap/alert';
import { ButtonsModule } from 'ngx-bootstrap/buttons';
import { CollapseModule } from 'ngx-bootstrap/collapse';
import {
  BsDatepickerConfig,
  BsDatepickerModule,
  BsDaterangepickerConfig
} from 'ngx-bootstrap/datepicker';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { ModalModule } from 'ngx-bootstrap/modal';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { PopoverModule } from 'ngx-bootstrap/popover';
import { ProgressbarModule } from 'ngx-bootstrap/progressbar';
import { RatingModule } from 'ngx-bootstrap/rating';
import { SortableModule } from 'ngx-bootstrap/sortable';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { TimepickerModule } from 'ngx-bootstrap/timepicker';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { TypeaheadModule } from 'ngx-bootstrap/typeahead';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TranslateModule } from '@ngx-translate/core';
import {
  APP_MODULE_TOASTR_ROOT_CONFIG,
  APP_MODULE_TRANSLATE_ROOT_CONFIG,
  TRANSL_MISSING_HANDLER_CONFIG,
  MissingTranslationHandlerConfig,
  BsMenuModule,
  BsMenuConfig,
  BreadcrumbService
} from '@efordevelops/ax-toolbox';
import {
  ApiHeaderJwtInterceptor
} from './shared/interceptors/api-header-jwt/api-header-jwt.interceptor';
import {
  ToastrCustomModule
} from './shared/_third-party/ep-components/components/toastr-custom/toastr-custom.module';
import {
  ApiCookiesCorsInterceptor
} from './shared/interceptors/api-cookies-cors/api-cookies-cors.interceptor';
import {
  BreadcrumbCustomService
} from './shared/services/breadcrumb/breadcrumb-custom.service';

/** Setup the global predetermined config for all datepickers */
export function getDatepickerConfig(): BsDatepickerConfig {
  return Object.assign(new BsDatepickerConfig(), {
    containerClass: 'theme-primary',
  } as BsDatepickerConfig);
}
/** Setup the global predetermined config for all date range pickers */
export function getDateRangePickerConfig(): BsDaterangepickerConfig {
  return Object.assign(new BsDaterangepickerConfig(), {
    containerClass: 'theme-primary',
  } as BsDaterangepickerConfig);
}

@NgModule({
  declarations: [AppComponent],
  imports: [
    AppRoutingModule,

    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: environment.production,
    }),

    ApiModule.forRoot({ rootUrl: environment.apiUrl }),
    CarouselModule,
    EpFullscreenImgModule,
    AccordionModule.forRoot(),
    AlertModule.forRoot(),
    ButtonsModule.forRoot(),
    CollapseModule.forRoot(),
    BsDatepickerModule.forRoot(),
    BsDropdownModule.forRoot(),
    ModalModule.forRoot(),
    PaginationModule.forRoot(),
    PopoverModule.forRoot(),
    ProgressbarModule.forRoot(),
    RatingModule.forRoot(),
    SortableModule.forRoot(),
    TabsModule.forRoot(),
    TimepickerModule.forRoot(),
    TooltipModule.forRoot(),
    TypeaheadModule.forRoot(),
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    TranslateModule.forRoot(APP_MODULE_TRANSLATE_ROOT_CONFIG),
    ToastrCustomModule.forRoot(APP_MODULE_TOASTR_ROOT_CONFIG),
    FontAwesomeModule,

    BsMenuModule.forRoot(new BsMenuConfig().setData({
      appLogoSrc: '/assets/img/logo/logo.svg',
      isAppNameLabelShown: true,
      appLogoName: 'K8s Manager',
    })),
  ],
  providers: [
    { provide: TRANSL_MISSING_HANDLER_CONFIG, useValue: { logToConsole: !environment.production, } as MissingTranslationHandlerConfig },
    { provide: BsDatepickerConfig, useFactory: getDatepickerConfig },
    { provide: BsDaterangepickerConfig, useFactory: getDateRangePickerConfig },

    {
      provide: BreadcrumbService,
      useClass: BreadcrumbCustomService
    },

    //#region INTERCEPTORS
    { provide: HTTP_INTERCEPTORS, useClass: ApiCookiesCorsInterceptor, multi: true },
    // //#region INTERCEPTORS - JWT HEADER
    // { provide: HTTP_INTERCEPTORS, useClass: ApiHeaderJwtInterceptor, multi: true },
    //#endregion
    //#region INTERCEPTORS - ERROR
    { provide: HTTP_INTERCEPTORS, useClass: ApiErrorInterceptor, multi: true },
    //#endregion
    //#region INTERCEPTORS - HEADERS
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ApiHeaderLangInterceptor,
      multi: true,
    },
    //#endregion
    //#endregion
  ],
  bootstrap: [AppComponent],
})
export class AppModule {
  constructor(public library: FaIconLibrary) {
    //#region FONTAWESOME ICONS
    library.addIconPacks(fas);
    library.addIconPacks(fab);
    library.addIcons(faEnvelope, faClock);
    //#endregion
  }
}
