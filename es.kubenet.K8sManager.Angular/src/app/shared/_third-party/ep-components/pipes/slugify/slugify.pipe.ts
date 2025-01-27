import { Pipe, PipeTransform } from '@angular/core';

const SLUGIFY_REGEXS: {[replacement: string]: RegExp[]} = {
  'a': [/á/g],
  'e': [/é/g],
  'i': [/í/g],
  'o': [/ó/g],
  'u': [/ú/g],
  'n': [/ñ/g],
  'c': [/ç/g],
  ' ': [/[^\w\-]+/g, /^-+/, /-+$/],
  '-': [/\s+/g, /\-\-+/g],
};

@Pipe({
  name: 'slugify'
})
export class SlugifyPipe implements PipeTransform {

  transform(input: string): string {
    input = (input || '')
      .toString()
      .toLowerCase();
    
    if (input == null) input = '';

    for (const replacement of Object.keys(SLUGIFY_REGEXS)) {
      const regExes = SLUGIFY_REGEXS[replacement];
      for (const re of regExes) {
        input = input.replace(re, replacement);
      }
    }

    return input;
  }

}
