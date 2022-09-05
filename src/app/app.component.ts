import { Component } from "@angular/core";

import { HttpClientService } from "./http-client.service";
import { logResponse, daqLog, runLog, link } from "./daq.model";

interface DAQButtonState {
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
  styleUrls: ["./app.component.css"],
})
export class AppComponent {
  daqResponse: logResponse = new logResponse;
  logs: daqLog[] = [];
  displayedColumns: string[] = ["compName", "state", "eventNum", "compStatus"];

  ipAddress: string = "172.18.4.56";
  computerName: string = "ヽ(´ー｀)ノ"

  runInfo: runLog;
  nextRunNo!: number;
  startDate!: string;
  stopDate!: string;

  commentData!: string;
  sourceData!: string;
  distanceData!: string;

  runList!: runLog[];

  linkList!: link[];
  plotLink: boolean = false;

  connFlag: boolean = false;
  autoIncFlag: boolean = true;

  daqButtonState: DAQButtonState;

  ResetState() {
    this.daqButtonState = {
      configure: false,
      unconfigure: false,
      start: false,
      stop: false,
      pause: false,
      resume: false,
    };
  }

  constructor(private httpClientService: HttpClientService) {
    this.daqButtonState = {
      configure: false,
      unconfigure: false,
      start: false,
      stop: false,
      pause: false,
      resume: false,
    };

    this.httpClientService.getAPIInfo().then(res => {
      this.ipAddress = res["operatorAddress"];
      this.computerName = res["computerName"];

      this.httpClientService.getLastRun().then((res) => {
        this.parseRunInfo(res);
      });

      this.httpClientService.getRunList().then((res) => {
        this.runList = res;
      });

      this.connFlag = false;
      this.onGetLog();
    });

    this.runInfo = {
      runNumber: 0,
      start: 0,
      stop: 0,
      expName: "test",
      comment: "comment",
      source: "",
      distance: ""
    }

    httpClientService.getLinkList().then(res => {
      this.linkList = res;
      if (this.linkList.length > 0) {
        this.plotLink = true;
      }
    })

    setInterval(() => {
      this.onGetLog();
    }, 1000);
  }

  parseRunInfo(res: runLog) {
    this.runInfo = res;
    if (this.autoIncFlag) this.nextRunNo = res.runNumber + 1;
    if (res.start != 0) {
      this.startDate = this.getDateAndTime(res.start * 1000);
    } else {
      this.startDate = "";
    }
    if (res.stop != 0) {
      this.stopDate = this.getDateAndTime(res.stop * 1000);
    } else {
      this.stopDate = "";
    }
    if (this.sourceData === undefined || "") this.sourceData = this.runInfo.source;
    if (this.distanceData === undefined || "") this.distanceData = this.runInfo.distance;
    if (this.commentData === undefined || "") this.commentData = this.runInfo.comment;
  }

  onGetRunList() {
    this.httpClientService.getRunList().then((res) => {
      this.runList = res;
    });
  }

  onGetLog() {
    this.httpClientService.getLastRun().then((res) => {
      this.parseRunInfo(res);
    });

    this.httpClientService.getLog(this.ipAddress).then((res) => {
      if (res === undefined) {
        this.connFlag = false;
      } else {
        this.connFlag = true;
        this.daqResponse = res;
        this.logs = this.daqResponse.returnValue.logs["log"];
        const state = this.logs[0].state;
        switch (state) {
          case "LOADED":
            this.ResetState();
            this.daqButtonState.configure = true;
            break;

          case "CONFIGURED":
            this.ResetState();
            this.daqButtonState.start = true;
            this.daqButtonState.unconfigure = true;
            break;

          case "RUNNING":
            this.ResetState();
            this.daqButtonState.stop = true;
            this.daqButtonState.pause = true;
            break;

          case "PAUSED":
            this.ResetState();
            this.daqButtonState.start = true;
            this.daqButtonState.resume = true;
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
    this.onGetRunList();
  }

  onPostUnconfig() {
    this.httpClientService.postUnconfigure(this.ipAddress);
    this.onGetLog();
    this.onGetRunList();
  }

  onPostStart() {
    if (this.daqButtonState.resume) {
      this.onPostResume();
    } else {
      this.httpClientService.postStart(this.nextRunNo, this.ipAddress);
      this.runInfo.runNumber = this.nextRunNo;
      this.runInfo.start = Math.floor(Date.now() / 1000);
      this.runInfo.stop = 0;
      this.runInfo.source = this.sourceData;
      this.runInfo.distance = this.distanceData;
      this.runInfo.comment = this.commentData;

      this.httpClientService.postStartTime(this.runInfo).then(res => {
        this.parseRunInfo(res);
      });

      this.nextRunNo++;
      this.onGetLog();
    }
    this.onGetRunList();
  }

  onPostStop() {
    this.httpClientService.postStop(this.ipAddress);
    this.runInfo.stop = Math.floor(Date.now() / 1000);
    this.runInfo.source = this.sourceData;
    this.runInfo.distance = this.distanceData;
    this.runInfo.comment = this.commentData;
    this.httpClientService.postStopTime(this.runInfo).then(res => {
      this.parseRunInfo(res);
    });
    this.onGetLog();
    this.onGetRunList();
  }

  onPostPause() {
    this.httpClientService.postPause(this.ipAddress);
    this.onGetLog();
    this.onGetRunList();
  }

  onPostResume() {
    this.httpClientService.postResume(this.ipAddress);
    this.onGetLog();
    this.onGetRunList();
  }

  getDateAndTime(unixTime: number): string {
    if (unixTime === 0) return "No information";

    let time = new Date(unixTime);

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
  }


}
