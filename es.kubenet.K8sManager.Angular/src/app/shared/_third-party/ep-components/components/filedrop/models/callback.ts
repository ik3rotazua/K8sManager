import { FiledropFile } from './file';
import { FiledropStatus } from './status';

export class FiledropCallback<TServerResponse = any> {
  files: FiledropFile[] = [];
  status: FiledropStatus;
  serverResponse: TServerResponse;

  constructor()
  constructor(files: FiledropFile[], status: FiledropStatus, serverResponse?: any)
  constructor(files?: FiledropFile[], status?: FiledropStatus, serverResponse?: any) {
    this.files = files || [];
    this.status = status || FiledropStatus.Uploading;
    this.serverResponse = serverResponse;
  }
}
