import {
  animate,
  state,
  style,
  transition,
  trigger
} from '@angular/animations';

/**
 * Trigger: `collapseH`, values: `true`, `false`.
 */
export const ANG_ANIMATION_COLLAPSE_HEIGHT = trigger('collapseH', [
  state('true', style({ height: 0, overflow: 'hidden' })),
  state('false', style({ height: '*', overflow: 'hidden' })),
  transition('true => false', [animate('.3s ease')]),
  transition('false => true', [animate('.3s ease')])
]);

/**
 * Trigger: `collapseH`, values: `:enter`, `:leave`.
 */
export const ANG_ANIMATION_COLLAPSE_HEIGHT_NGIF = trigger('collapseH', [
  transition(':enter', [style({ height: 0, overflow: 'hidden' }), animate('.3s ease', style({ height: '*' }))]),
  transition(':leave', [style({ height: '*', overflow: 'hidden' }), animate('.3s ease', style({ height: 0 }))])
]);

/**
 * Trigger: `collapseW`, values: `true`, `false`.
 */
export const ANG_ANIMATION_COLLAPSE_WIDTH = trigger('collapseW', [
  state('true', style({ width: 0, overflow: 'hidden' })),
  state('false', style({ width: '*', overflow: 'hidden' })),
  transition('true => false', [animate('.3s ease')]),
  transition('false => true', [animate('.3s ease')])
]);

/**
 * Trigger: `collapseW`, values: `:enter`, `:leave`.
 */
export const ANG_ANIMATION_COLLAPSE_WIDTH_NGIF = trigger('collapseW', [
  transition(':enter', [style({ width: 0, overflow: 'hidden' }), animate('.3s ease', style({ width: '*' }))]),
  transition(':leave', [style({ width: '*', overflow: 'hidden' }), animate('.3s ease', style({ width: 0 }))])
]);
