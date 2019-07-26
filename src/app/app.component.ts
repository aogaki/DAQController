import { Component } from '@angular/core';
import { MatInputModule } from '@angular/material/input';

import { HttpClientService } from './http-client.service';
import { logResponse, daqLog } from './daq.model';

interface DAQstate {
  configure: boolean;
  unconfigure: boolean;
  start: boolean;
  stop: boolean;
  pause: boolean;
  resume: boolean;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  daqStatus: logResponse;
  logs: daqLog[];
  displayedColumns: string[] = ['compName', 'state', 'eventNum', 'compStatus'];

  runNo: number = 1;

  daqState: DAQstate;

  ResetState() {
    this.daqState = {
      configure: false,
      unconfigure: false,
      start: false,
      stop: false,
      pause: false,
      resume: false
    };
  }

  constructor(private httpClientService: HttpClientService) {
    this.daqState = {
      configure: false,
      unconfigure: false,
      start: false,
      stop: false,
      pause: false,
      resume: false
    };

    this.onGetLog();

    setInterval(() => {
      this.onGetLog();
    }, 1000);
  }

  onGetLog() {
    this.httpClientService.getLog().then(res => {
      this.daqStatus = res;
      this.logs = this.daqStatus.returnValue.logs['log'];
      const state = this.logs[0].state;
      switch (state) {
        case 'LOADED':
          this.ResetState();
          this.daqState.configure = true;
          break;

        case 'CONFIGURED':
          this.ResetState();
          this.daqState.start = true;
          this.daqState.unconfigure = true;
          break;

        case 'RUNNING':
          this.ResetState();
          this.daqState.stop = true;
          this.daqState.pause = true;
          break;

        case 'PAUSED':
          this.ResetState();
          this.daqState.start = true;
          this.daqState.resume = true;
          break;

        default:
          break;
      }
    });
  }

  onPostConfig() {
    this.httpClientService.postConfigure();
    this.onGetLog();
  }

  onPostUnconfig() {
    this.httpClientService.postUnconfigure();
    this.onGetLog();
  }

  onPostStart() {
    if (this.daqState.resume) {
      this.onPostResume();
    } else {
      this.httpClientService.postStart(this.runNo);
      this.onGetLog();
    }
  }

  onPostStop() {
    this.httpClientService.postStop();
    this.onGetLog();
  }

  onPostPause() {
    this.httpClientService.postPause();
    this.onGetLog();
  }

  onPostResume() {
    this.httpClientService.postResume();
    this.onGetLog();
  }
}
