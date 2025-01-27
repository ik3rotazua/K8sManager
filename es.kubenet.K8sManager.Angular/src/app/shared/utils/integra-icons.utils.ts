import {
  IconDefinition,
  IconName,
  IconPrefix
} from '@fortawesome/fontawesome-svg-core';
import { IIntegraIcon } from '../models/integra-icons.models';
import { FaIconLibrary } from '@fortawesome/angular-fontawesome';

/**
 * Convierte el icono de Integra con una definición compatible con `FontAwesome`.
 * Se utiliza para hacer que un icono sea compatible con `<fa-icon></fa-icon>`.
 *  
 * @param integraIcon Icono de Integra a convertir
 * @returns Una definición compatible con FontAwesome.
 */
export const toFontAwesome = (integraIcon: IIntegraIcon) => {
  const asProp: IconDefinition = {
    prefix: integraIcon.prefix as IconPrefix,
    iconName: integraIcon.iconName as IconName,
    icon: [
      integraIcon.icon.width,
      integraIcon.icon.height,
      integraIcon.icon.ligatures ?? [],
      integraIcon.icon.unicode,
      integraIcon.icon.svgPathData,
    ],
  };

  return asProp;
};

/**
 * Convierte el icono de Integra con una definición compatible con `FontAwesome`
 * y lo añade a la librería de FontAwesome.
 * Se utiliza para hacer que un icono sea compatible con `<fa-icon></fa-icon>`,
 * y pueda ser utilizada en elementos que no pueda invocar la definición de forma
 * programática.
 *
 * @param library Instancia inyectada de `FaIconLibrary`, en el cual se cargará la
 * definición.
 * @param integraIcons Iconos de Integra a utilizar.
 * @returns Las definiciones de `integraIcons` convertidas a definiciones de FontAwesome,
 * en el mismo orden en el que fueron utilizados en el método.
 */
export const addToLibrary = (library: FaIconLibrary, ...integraIcons: IIntegraIcon[]) => {
  const asFA = integraIcons.map(icon => toFontAwesome(icon));
  library.addIcons(...asFA);
  return asFA;
};
