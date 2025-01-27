import { IIntegraIcon } from './integra-icons.models';
import { ICON_INTEGRA_SVG_DIVIDER } from './integra-icons.svg';

// Librería de iconos de Integra, para integración de FontAwesome

export const faIntSlash: IIntegraIcon = {
  prefix: 'faint',
  iconName: 'slash',
  icon: {
    height: 448,
    width: 448,
    svgPathData: ICON_INTEGRA_SVG_DIVIDER,
  },
};
