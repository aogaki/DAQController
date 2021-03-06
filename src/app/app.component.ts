import { Component } from "@angular/core";

import { HttpClientService } from "./http-client.service";
import { logResponse, daqLog } from "./daq.model";

interface DAQstate {
  configure: boolean;
  unconfigure: boolean;
  start: boolean;
  stop: boolean;
  pause: boolean;
  resume: boolean;
}

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"]
})
export class AppComponent {
  daqResponse: logResponse;
  logs: daqLog[];
  displayedColumns: string[] = ["compName", "state", "eventNum", "compStatus"];

  runNo: number = 0;
  currentRunNo: number = this.runNo;
  ipAddress: string = "172.18.4.60";

  startDate: string;
  stopDate: string;

  checkFlag: boolean;
  connFlag: boolean;

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

    this.connFlag = false;
    this.onGetLog();

    this.runNo = 0;
    this.currentRunNo = this.runNo;

    setInterval(() => {
      if (this.checkFlag) {
        this.onGetLog();
      }
    }, 1000);
  }

  onGetLog() {
    this.httpClientService.getLog(this.ipAddress).then(res => {
      if (res === undefined) {
        this.connFlag = false;
        this.checkFlag = false;
      } else {
        console.log(res);
        this.connFlag = true;
        this.daqResponse = res;
        this.logs = this.daqResponse.returnValue.logs["log"];
        const state = this.logs[0].state;
        switch (state) {
          case "LOADED":
            this.ResetState();
            this.daqState.configure = true;
            this.checkFlag = false;
            break;

          case "CONFIGURED":
            this.ResetState();
            this.daqState.start = true;
            this.daqState.unconfigure = true;
            this.checkFlag = true;
            break;

          case "RUNNING":
            this.ResetState();
            this.daqState.stop = true;
            this.daqState.pause = true;
            this.checkFlag = true;
            break;

          case "PAUSED":
            this.ResetState();
            this.daqState.start = true;
            this.daqState.resume = true;
            this.checkFlag = true;
            break;

          default:
            break;
        }
      }
    });
  }

  onPostConfig() {
    this.httpClientService.postConfigure(this.ipAddress);
    this.onGetLog();
  }

  onPostUnconfig() {
    this.httpClientService.postUnconfigure(this.ipAddress);
    this.onGetLog();
  }

  onPostStart() {
    if (this.daqState.resume) {
      this.onPostResume();
    } else {
      this.httpClientService.postStart(this.runNo, this.ipAddress);
      this.currentRunNo = this.runNo;
      this.runNo++;
      this.startDate = this.getDateAndTime();
      this.stopDate = "";
      this.onGetLog();
    }
  }

  onPostStop() {
    this.httpClientService.postStop(this.ipAddress);
    this.stopDate = this.getDateAndTime();
    this.onGetLog();
  }

  onPostPause() {
    this.httpClientService.postPause(this.ipAddress);
    this.onGetLog();
  }

  onPostResume() {
    this.httpClientService.postResume(this.ipAddress);
    this.onGetLog();
  }

  getDateAndTime(): string {
    let time = new Date();
    let dateAndTime =
      time.getHours() +
      ":" +
      time.getMinutes() +
      ":" +
      time.getSeconds() +
      ", " +
      time.getDate() +
      "." +
      (time.getMonth() + 1) +
      "." +
      time.getFullYear();
    return dateAndTime;
    // return time.toString();
  }
}
