import { Injectable, OnDestroy } from '@angular/core';
import { TranslateService, LangChangeEvent } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { LanguageService } from '../../api/services';
import { LanguageDto } from '../../api/models/language-dto';
import { StringUtilities } from '@efordevelops/ax-toolbox';

/**
 * This service mantains an updated dictionary with all the translations available
 * from the TranslateService. Its static `dictionary` property is used for Interceptors,
 * so that there is no circular dependencies.
 */
@Injectable({
  providedIn: 'root'
})
export class DictionaryService implements OnDestroy {
  // static = avoid circular dependencies in Interceptors
  static dictionary = {};
  static currentLanguage: string;

  serverSideLangs: LanguageDto[] = [];
  isInitialized = false;

  private subs: Subscription[] = [];


  static getFromStatic(dictionaryKey: string): string {
    return StringUtilities.formatFromObject(`{${dictionaryKey}}`, DictionaryService.dictionary);
  }
  constructor(
    public translate: TranslateService,
    public languageSV: LanguageService,
  ) {
    this.init();
  }

  ngOnDestroy() {
    this.subs.forEach(s => s.unsubscribe());
  }

  private init() {
    const s = this.translate.onLangChange
      .subscribe((data: LangChangeEvent) => {
        DictionaryService.currentLanguage = data.lang;
        DictionaryService.dictionary = data.translations;

        document.getElementsByTagName('html').item(0).setAttribute('lang', data.lang);
      });
    const s2 = this.languageSV.apiLanguageGet$Json()
      .subscribe((data) => {
        this.serverSideLangs = data;
        setTimeout(() => {
          s2.unsubscribe();
        }, 3000);
      });

    this.subs.push(s);
  }

}
