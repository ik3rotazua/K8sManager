import { IconPathData } from '@fortawesome/fontawesome-svg-core';

/**
 * Interfaz definitoria de los iconos personalizados de Integra.
 * La estructrua es similar a FontAwesome para facilitar su integración.
 */
export interface IIntegraIcon {
  /**
   * El prefijo del icono. Fontawesome lo utiliza para cargar el icono.
   */
  prefix: 'faint';
  /**
   * El prefijo del icono. Fontawesome lo utiliza para cargar el icono.
   */
  iconName: string;
  /**
   * La definición del icono y su estilo.
   */
  icon: IIntegraIconDefinition;
}

export interface IIntegraIconDefinition {
  /**
   * Anchura del viewBox del SVG.
   *
   * Recomendado: 448.
   */
  width: number;
  /**
   * Altura del viewBox del SVG
   *
   * Recomendado: 448.
   */
  height: number;
  /**
   * Datos que se adjuntarán al atributo `d` del SVG.
   */
  svgPathData: IconPathData;
  ligatures?: string[];
  unicode?: string;
}
