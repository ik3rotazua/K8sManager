export function applyMixins(finalClass: any, classesToCombine: any[]) {
  classesToCombine.forEach(baseCtor => {
    Object.getOwnPropertyNames(baseCtor.prototype).forEach(name => {
      if (name !== 'constructor') {
        finalClass.prototype[name] = baseCtor.prototype[name];
      }
    });
  });
}

/**
 * https://stackoverflow.com/a/38327540
 */
export function groupBy<ArrayItemType, KeyType>(list: ArrayItemType[], keyGetter: (item: ArrayItemType) => KeyType) {
  const map = new Map<KeyType, ArrayItemType[]>();
  list.forEach((item) => {
    const key = keyGetter(item);
    const collection = map.get(key);
    if (!collection) {
      map.set(key, [item]);
    } else {
      collection.push(item);
    }
  });
  return map;
}

export function removeHtml(input: string) {
  const el = document.createElement('input');
  el.innerHTML = input;
  return el.innerText;
}

export const toCamelCase = (str) => str
  .replace(
    /(?:^\w|[A-Z]|\b\w)/g,
    (ltr, idx) => idx === 0
      ? ltr.toLowerCase()
      : ltr.toUpperCase())
  .replace(/\s+/g, '');
