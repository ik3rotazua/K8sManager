import { ILabelAndValue } from '@efordevelops/ax-toolbox';

const LAV_ITEMS_SN_BASE: Readonly<['S', 'N']> = Object.freeze([
  'S', 'N'
]);

export const LAV_ITEMS_SN: Readonly<ILabelAndValue<'S' | 'N'>[]> = LAV_ITEMS_SN_BASE
  .map(x => Object.freeze({
    label: x,
    value: x
  }));
