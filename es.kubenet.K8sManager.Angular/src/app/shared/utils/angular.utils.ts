import { ActivatedRoute, Data } from '@angular/router';
import { keyValues, keys } from '@efordevelops/ax-toolbox';
import { Subject } from 'rxjs';

export interface IUpdateDataOptions<T> {
  /**
   * El dato vinculado que debe compartirse.
   */
  data: T;
  /**
   * Especifica si los datos deben pasarse a los componentes
   * activos en secciones superiores de la ruta actual.
   * 
   * Si no se especifica, su valor predeterminado es `true`.
   */
  spreadUp?: boolean;
  /**
   * Especifica si los datos deben pasarse a componentes
   * activados en secciones inferiores, es decir: a sus
   * herederos.
   * 
   * Si no se especifica, su valor predeterminado es `true`.
   */
  spreadDown?: boolean;
}

/**
 * Actualiza el objeto {@link ActivatedRoute.data} de todas las rutas
 * vinculadas a la actual, tanto en herencias como en rutas raíz. De esta forma,
 * todos los componentes que estén vinculados a la ruta que el usuario está
 * visualizando simularán que los resolvers han actualizado los datos, para poder
 * recargar y mostrar la información actualizada.
 *
 * @param aRoute La ruta que activada actualmente.
 */
export const updateRouteData = <TData, TOptions extends { [key: string]: IUpdateDataOptions<TData> }>(
  aRoute: ActivatedRoute,
  options: TOptions
) => {
  const optionsCopy = copyOptions(options);
  emitNewData(aRoute, optionsCopy);
  
  const optionsForUpwards = copyOptionsForUpwards(options);
  updateRouteDataUpwards(aRoute, optionsForUpwards);
  
  const optionsForDownwards = copyOptionsForDownwards(options);
  updateRouteDataDownwards(aRoute, optionsForDownwards);
};

const copyOptionsForUpwards = <TData, TOptions extends { [key: string]: IUpdateDataOptions<TData> }>(
  options: TOptions
) => {
  const copy = copyOptions(options, 'spreadUp');

  return copy;
};

const copyOptionsForDownwards = <TData, TOptions extends { [key: string]: IUpdateDataOptions<TData> }>(
  options: TOptions
) => {
  const copy = copyOptions(options, 'spreadDown');
  return copy;
};

const copyOptions = <TData, TOptions extends { [key: string]: IUpdateDataOptions<TData> }>(
  options: TOptions,
  boolKey?: 'spreadDown' | 'spreadUp',
  boolValueDefault = true
) => {
  const copy: Partial<{ [key in keyof TOptions]: TData }> = {};
  for (const kv of keyValues(options)) {
    const dataForCopy = boolKey == null || (kv.value[boolKey] ?? boolValueDefault)
      ? kv.value.data
      : undefined;
    
    if (dataForCopy !== undefined) {
      copy[kv.key] = kv.value.data;
    }
  }

  return copy;
};

/**
 * Actualiza el objeto {@link ActivatedRoute.data} de todas las rutas
 * vinculadas a la actual, sólo en las rutas que precedan a esta. De esta forma,
 * todos los componentes que estén vinculados a la ruta que el usuario está
 * visualizando simularán que los resolvers han actualizado los datos, para poder
 * recargar y mostrar la información actualizada.
 *
 * @param aRoute La ruta que activada actualmente.
 */
export const updateRouteDataUpwards = <TData, TOptions extends { [key: string]: TData }>(
  aRoute: ActivatedRoute,
  options: TOptions
) => {
  const parent = aRoute.parent;
  if (parent) {
    emitNewData(parent, options);
    updateRouteDataUpwards(parent, options);
  }
};

/**
 * Actualiza el objeto {@link ActivatedRoute.data} de todas las rutas
 * vinculadas a la actual, sólo en aquellas que hereden de la actual. De esta forma,
 * todos los componentes que estén vinculados a la ruta que el usuario está
 * visualizando simularán que los resolvers han actualizado los datos, para poder
 * recargar y mostrar la información actualizada.
 *
 * @param aRoute La ruta que activada actualmente.
 */
export const updateRouteDataDownwards = <TData, TOptions extends { [key: string]: TData }>(
  aRoute: ActivatedRoute,
  options: TOptions
) => {
  const children = aRoute.children ?? [];
  for (const child of children) {
    emitNewData(child, options);
    updateRouteDataDownwards(child, options);
  }
};

const emitNewData = <TData, TOptions extends { [key: string]: TData }>(
  aRoute: ActivatedRoute,
  options: TOptions
) => {
  const $data = aRoute.data as Subject<Data>;
  for (const key of keys(options)) {
    const hasResolver = aRoute.snapshot.data[key] !== undefined;
    if (hasResolver) {
      const newData = { ...aRoute.snapshot.data };
      newData[key] = options[key];

      $data.next(newData);
    }
  }
};
