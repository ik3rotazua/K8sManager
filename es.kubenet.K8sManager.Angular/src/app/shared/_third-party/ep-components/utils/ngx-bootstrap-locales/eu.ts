/* eslint-disable yoda, max-len */
/* eslint-disable no-bitwise, prefer-template, complexity */
/* eslint-disable default-case, prefer-const */
/* eslint-disable one-var, padding-line-between-statements */

import { LocaleData, getMonth } from 'ngx-bootstrap/chronos';
import { getHours } from 'ngx-bootstrap/chronos/utils/date-getters';

//! moment.js locale configuration
//! locale : Basque [eu]
//! author : Eneko Illarramendi : https://github.com/eillarra

const months = 'urtarrila_otsaila_martxoa_apirila_maiatza_ekaina_uztaila_abuztua_iraila_urria_azaroa_abendua'.split('_');
const monthsShort = 'urt._ots._mar._api._mai._eka._uzt._abu._ira._urr._aza._abe.'.split('_');

// let monthsShortDot = 'urt._ots._mar._api._mai._eka._uzt._abu._ira._urr._aza._abe.'.split('_'),
//     monthsShort = 'urt_ots_mar_api_mai_jun_jul_ago_sep_oct_nov_dic'.split('_');

const monthsParse = [/^urt/i, /^ots/i, /^mar/i, /^api/i, /^mai/i, /^eka/i, /^uzt/i, /^abu/i, /^ira/i, /^urr/i, /^aza/i, /^abe/i];
const monthsRegex = /^(urtarrila|otsaila|martxoa|apirila|maiatza|ekaina|uztaila|abuztua|iraila|urria|azaroa|abendua|urt\.?|ots\.?|mar\.?|api\.?|mai\.?|eka\.?|uzt\.?|abu\.?|ira\.?|urr\.?|aza\.?|abe\.?)/i;

export const euLocale: LocaleData = {
  abbr: 'eu',
  months: months,
  monthsShort(date: Date, format: string, isUTC?: boolean): string | string[] {
    if (!date) {
      return monthsShort;
    }

    if (/-MMM-/.test(format)) {
      return monthsShort[getMonth(date, isUTC)];
    }

    return monthsShort[getMonth(date, isUTC)];
  },
  monthsParseExact: true,
  weekdays: 'igandea_astelehena_asteartea_asteazkena_osteguna_ostirala_larunbata'
    .split('_'),
  weekdaysShort: 'ig._al._ar._az._og._ol._lr.'
    .split('_'),
  weekdaysMin: 'ig_al_ar_az_og_ol_lr'
    .split('_'),
  weekdaysParseExact: true,
  longDateFormat: {
    LT: 'HH:mm',
    LTS: 'HH:mm:ss',
    L: 'YYYY-MM-DD',
    LL: 'YYYY[ko] MMMM[ren] D[a]',
    LLL: 'YYYY[ko] MMMM[ren] D[a] HH:mm',
    LLLL: 'dddd, YYYY[ko] MMMM[ren] D[a] HH:mm',
    l: 'YYYY-M-D',
    ll: 'YYYY[ko] MMM D[a]',
    lll: 'YYYY[ko] MMM D[a] HH:mm',
    llll: 'ddd, YYYY[ko] MMM D[a] HH:mm',
  },
  calendar: {
    sameDay(date: Date) {
      return '[gaur] LT[etan]';
    },
    nextDay(date: Date) {
      return '[bihar] LT[etan]';
    },
    nextWeek(date: Date) {
      return 'dddd LT[etan]';
    },
    lastDay(date: Date) {
      return '[atzo] LT[etan]';
    },
    lastWeek(date: Date) {
      return '[aurreko] dddd LT[etan]';
    },
    sameElse: 'L'
  },
  relativeTime: {
    future: '%s barru',
    past: 'duela %s',
    s: 'segundo batzuk',
    ss: '%d segundo',
    m: 'minutu bat',
    mm: '%d minutu',
    h: 'ordu bat',
    hh: '%d ordu',
    d: 'egun bat',
    dd: '%d egun',
    M: 'hilabete bat',
    MM: '%d hilabete',
    y: 'urte bat',
    yy: '%d urte',
  },
  dayOfMonthOrdinalParse: /\d{1,2}\./,
  ordinal: '%d.',
  week: {
    dow: 1, // Monday is the first day of the week.
    doy: 7, // The week that contains Jan 7th is the first week of the year.
  },
  monthsRegex,
  monthsShortRegex: monthsRegex,
  monthsStrictRegex: /^(urtarrila|otsaila|martxoa|apirila|maiatza|ekaina|uztaila|abuztua|iraila|urria|azaroa|abendua)/i,
  monthsShortStrictRegex: /^(urt\.?|ots\.?|mar\.?|api\.?|mai\.?|eka\.?|uzt\.?|abu\.?|ira\.?|urr\.?|aza\.?|abe\.?)/i,
  monthsParse,
  longMonthsParse: monthsParse,
  shortMonthsParse: monthsParse,
};