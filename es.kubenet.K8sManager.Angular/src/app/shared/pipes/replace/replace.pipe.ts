import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'replace'
})
export class ReplacePipe implements PipeTransform {
  public transform(originalText: any | number, find: string, replaceAs: string): any {
    if (originalText == null) { return originalText; }

    let asString: string = originalText.toString();
    if (asString.length === 0 || asString.indexOf(find) < 0) { return originalText; }
    asString = asString.replace(find, replaceAs);
    return asString;
  }

}
