import {
  Component,
  OnInit,
  ViewChild,
  Output,
  Input,
  EventEmitter
} from '@angular/core';
import {
  FiledropFile,
  FiledropCallback,
  FiledropStatus
} from './models';
import {
  HttpEventType,
  HttpClient,
  HttpEvent
} from '@angular/common/http';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-filedrop',
  templateUrl: './filedrop.component.html',
  styleUrls: ['./filedrop.component.scss']
})
export class FiledropComponent implements OnInit {
  @ViewChild('input') input: HTMLInputElement;
  //#region Translated labels
  /**
   * Default: "Choose a file"
   */
  @Input()
    labelChooseFile = 'Choose a file';
  /**
   * Default: "...or drag it here to upload."
   *
   * *Only appears if the browser suppors drag & drop*
   */
  @Input()
    labelOrDragHere = '...or drag it here to upload.';
  /**
   * Default: "Release to upload"
   */
  @Input()
    labelReleaseToUpload = 'Release to upload';
  /**
   * Default: "Uploading"
   */
  @Input()
    labelStatusUploading = 'Uploading';
  //#endregion

  //#region CSS classes
  /**
   * Class to be applied to the "Choose a file" button.
   */
  @Input()
    btnUploadClass = 'btn btn-sm btn-primary';

  /**
   * Class to be applied to the row containing the file boxes
   */
  @Input()
    fileBoxWrapperClass = '';

  @Input()
    fileBoxClass = 'col-lg-2 col-md-4 col-sm-6 col-12';
  //#endregion

  /**
   * Detects if support for drag & drop exists.
   * Assigned on class' constructo.
   */
  canDragAndDrop = false;
  /**
   * Total processed files.
   *
   * You can populate this manually to display data about files :)
   */
  @Input()
    files: FiledropFile[] = [];

  /**
   * Whether if an Overlay should be displayed.
   */
  get showOverlay() {
    return this.isDragging ||
      this.isUploading;
  }

  /**
   * When you drag something over the desired element's children,
   * dragleave will be triggered. Implementing dragCounter logic will prevent this from happening.
   *
   * Dragging over children elements:
   * @example 0 -> DragEnter -> 1 -> DragEnter (child) -> 2 -> DragLeave (parent) -> 1.
   *
   * Leaving parent element:
   * @example 0 -> DragEnter -> 1 -> DragEnter (child) -> 2 -> DragLeave (parent) -> 1 -> DragLeave (child) -> 0.
   *
   */
  private dragCounter = 0;
  /**
   * Shortcut for dragCounter > 0.
   */
  get isDragging() { return this.dragCounter > 0; }

  isUploading = false;
  uploadPrctg = 0;

  /**
   * Whether the uploader is disabled.
   */
  @Input()
    disabled = false;
  /**
   * The style of the upload progress bar.
   * @see https://material.angular.io/components/progress-bar/api for more info.
   */
  @Input()
    pBarType: 'indeterminate' | 'determinate' | 'query' | 'buffer' = 'determinate';

  /**
   * Allow multiple files to be used.
   */
  @Input()
    inputMultiple = true;

  /**
   * The URL where the files will be uploaded
   */
  @Input() url = '';
  /**
   * If specified, a call to this function will be performed,
   * instead of using the 'url'.
   */
  @Input() uploadFn: FdUploadFn = null;
  /**
   * Additional parameters to be passed to the URL.
   */
  @Input()
    urlParams: any = {};

  //#region Output events
  @Output()
    dragOvered = new EventEmitter<Event>();
  @Output()
    dragLeft = new EventEmitter<Event>();
  @Output()
    dropped = new EventEmitter<FiledropFile[]>();

  @Output() uploadSuccess = new EventEmitter<FiledropCallback>();
  @Output() uploadError = new EventEmitter<FiledropCallback>();
  //#endregion

  constructor(
    public httpClient: HttpClient,
  ) {
    this.checkDaD();
  }

  ngOnInit(): void {
  }


  onManualInputChange(ev: Event) {
    const el = <HTMLInputElement>ev.target;
    const files = el.files;

    const newFiles = this.prepareFiles(files);
    const form = this.buildForm(files);

    this.uploadStart(form, newFiles);
  }

  onDragOver(ev: Event) {
    ev.stopPropagation();
    ev.preventDefault();

    this.dragOvered.emit(ev);
  }
  onDrop(ev: DragEvent) {
    ev.stopPropagation();
    ev.preventDefault();

    if (this.disabled) { return; }
    this.disabled = true;

    const files = ev.dataTransfer.files;

    const newFiles = this.prepareFiles(files);
    const form = this.buildForm(files);

    this.dropped.emit(newFiles);

    this.uploadStart(form, newFiles);

    this.onDragLeave(ev);
  }


  private prepareFiles(files: FileList) {
    const newFiles: FiledropFile[] = [];
    const maxFiles = this.inputMultiple ? files.length : 1;

    for (let i = 0; i < maxFiles; i++) {
      const nf = new FiledropFile(files.item(i));
      newFiles.push(nf);
      this.files.push(nf);
    }

    return newFiles;
  }
  private buildForm(files: FileList) {
    const formData = new FormData();
    const maxFiles = this.inputMultiple ? files.length : 1;

    for (let i = 0; i < maxFiles; i++) {
      const f = files.item(i);
      formData.append('file', f, f.name);
    }
    return formData;
  }


  onDragEnter(ev: Event) {
    this.dragCounter++;
  }
  onDragLeave(ev: Event) {
    this.dragCounter--;
  }


  private uploadToApi(form: FormData, fileReferences: FiledropFile[]): Observable<HttpEvent<unknown>> {

    if (!this.url) {
      fileReferences.forEach(f => {
        this.uploadEnd(fileReferences, FiledropStatus.Error, 'URL is missing!');
        f.status = FiledropStatus.Error;
      });
      setTimeout(() => {
        this.uploadPrctg = 100;
      }, 0);
      return;
    }

    return this.httpClient.post<any>(this.url, form, { reportProgress: true, params: this.urlParams });
  }

  private uploadStart(form: FormData, dfReferences: FiledropFile[]) {
    this.isUploading = true;
    this.uploadPrctg = 0;

    let task: FdUploadFn = null;
    if (this.uploadFn != null) task = this.uploadFn;
    else if (this.url) task = this.uploadToApi.bind(this);

    task(form, dfReferences).subscribe({
      next: (data) => {
        if (data && data.type === HttpEventType.UploadProgress) {
          const percent = Math.round(100 * data.loaded / data.total);
          this.uploadPrctg = percent;
        } else {
          this.uploadEnd(dfReferences, FiledropStatus.Success, data);
          this.uploadPrctg = 100;
        }
      },
      error: (error) => {
        let errMsg = '';
        if (typeof error === 'string') {
          errMsg = error;
        }
        this.uploadEnd(dfReferences, FiledropStatus.Error, errMsg);
        this.uploadPrctg = 100;
      }
    });
  }

  private uploadEnd(uploadedFileReferences: FiledropFile[], status: FiledropStatus, serverResponse?: any) {
    uploadedFileReferences.forEach((f) => {
      f.status = status;
      if (status === FiledropStatus.Error && serverResponse && typeof serverResponse === 'string') {
        f.statusLabel = serverResponse;
      }
    });

    if (status === FiledropStatus.Success) {
      this.uploadSuccess.emit(new FiledropCallback(uploadedFileReferences, status, serverResponse));
    } else if (status === FiledropStatus.Error) {
      this.uploadError.emit(new FiledropCallback(uploadedFileReferences, status, serverResponse));
    }

    setTimeout(() => {
      this.isUploading = false;
      this.disabled = false;
    }, 250);
  }
  private checkDaD() {
    const d = document.createElement('div');
    this.canDragAndDrop = d.draggable !== undefined &&
      d.ondragstart !== undefined &&
      d.ondrop !== undefined;
    d.remove();
  }
}

export type FdUploadFn = (form: FormData, fileReferences: FiledropFile[]) => Observable<HttpEvent<unknown>>;
