import { SetData } from '@efordevelops/ax-toolbox';
import { FiledropStatus } from './status';
const UNIT_DIVIDER = 1024;

export class FiledropFile
  extends SetData<FiledropFile> {
  name = '';
  size = 0;
  sizeLabel: string;

  status = FiledropStatus.Iddle;
  statusLabel: string;

  constructor(file: File) {
    super();
    this.name = file.name;
    this.size = file.size;
  }
  setData(newData: Partial<FiledropFile>) {
    super.setData(newData);
    this.recalculateSizeLabel();

    return this;
  }

  private recalculateSizeLabel() {
    const bytes = this.size ?? 0;
    const kB = bytes / UNIT_DIVIDER;
    const mB = kB / UNIT_DIVIDER;
    const gB = mB / UNIT_DIVIDER;

    if (gB > 1) { return `${gB.toFixed(2)} GB`; }
    if (mB > 1) { return `${mB.toFixed(2)} MB`; }
    if (kB > 1) { return `${kB.toFixed(2)} KB`; }
    return `${this.size} B`;
  }
}
