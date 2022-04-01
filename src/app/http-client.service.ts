import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { NgxXml2jsonService } from 'ngx-xml2json';
import { logResponse, daqResponse, runLog, apiSettings, link, linkList } from './daq.model';
import { stringify } from '@angular/compiler/src/util';

@Injectable({
  providedIn: 'root'
})
export class HttpClientService {
  private apiAddress: string = '172.18.4.56:8000';
  private apiName: string = "ELIADETest";
  private expName: string = "";

  constructor(private http: HttpClient, private x2j: NgxXml2jsonService) {
    this.getAPIInfo();
  }

  private GetJSON(response: string): any {
    // Any response from DAQ-MW has XML header and response
    // jsonDoc.response means chopping XML header
    const parser = new DOMParser();
    const xmlDoc: any = parser.parseFromString(response, 'text/xml');
    const jsonDoc: any = this.x2j.xmlToJson(xmlDoc);
    return jsonDoc.response;
  }


  public async getLastRun(): Promise<runLog> {
    const uri: string = "http://" + this.apiAddress + '/' + this.apiName + '/GetLastRun/' + this.expName;

    try {
      const res = await this.http
        .get(uri, { responseType: 'json' })
        .toPromise();
      let retVal = res as runLog[];
      return retVal[0];
    } catch (err) {
      return this.errorHandler(err);
    }
  }

  public async getRunList(): Promise<runLog[]> {
    const uri: string = "http://" + this.apiAddress + '/' + this.apiName + '/GetRunList/' + this.expName;

    try {
      const res = await this.http
        .get(uri, { responseType: 'json' })
        .toPromise();
      return res as runLog[];
    } catch (err) {
      return this.errorHandler(err);
    }
  }

  public async postStartTime(body: runLog): Promise<runLog> {
    const uri: string = "http://" + this.apiAddress + '/' + this.apiName + '/PostStartTime';

    body.expName = this.expName;
    body.dump = false;
    try {
      const res = await this.http
        .post(uri, body, { responseType: 'json' })
        .toPromise();
      return res as runLog;
    } catch (err) {
      return this.errorHandler(err);
    }
  }

  public async postStopTime(body: runLog): Promise<runLog> {
    const uri: string = "http://" + this.apiAddress + '/' + this.apiName + '/PostStopTime';

    body.expName = this.expName;
    body.dump = false;
    try {
      const res = await this.http
        .post(uri, body, { responseType: 'json' })
        .toPromise();
      return res as runLog;
    } catch (err) {
      return this.errorHandler(err);
    }
  }

  public async postEnableDump(body: runLog): Promise<runLog> {
    const uri: string = "http://" + this.apiAddress + '/' + this.apiName + '/EnableDump';

    body.expName = this.expName;
    body.dump = true;
    try {
      const res = await this.http
        .post(uri, body, { responseType: 'json' })
        .toPromise();
      return res as runLog;
    } catch (err) {
      return this.errorHandler(err);
    }
  }

  public async getLog(ipAddress: string): Promise<logResponse> {
    const uri: string = 'http://' + ipAddress + '/daqmw/scripts/daq.py/Log';

    try {
      const res = await this.http
        .get(uri, { responseType: 'text' })
        .toPromise();
      const jsonDoc = this.GetJSON(res) as logResponse;
      return jsonDoc;
    } catch (err) {
      return this.errorHandler(err);
    }
  }

  public async postConfigure(ipAddress: string): Promise<daqResponse> {
    const uri: string = 'http://' + ipAddress + '/daqmw/scripts/daq.py/Params';

    const body =
      "cmd=<?xml version='1.0' encoding='UTF-8' ?><request><params>config.xml</params></request>";

    try {
      const res = await this.http
        .post(uri, body, { responseType: 'text' })
        .toPromise();
      const jsonDoc = this.GetJSON(res) as daqResponse;
      return jsonDoc;
    } catch (err) {
      return this.errorHandler(err);
    }
  }

  public async postUnconfigure(ipAddress: string): Promise<daqResponse> {
    const uri: string =
      'http://' + ipAddress + '/daqmw/scripts/daq.py/ResetParams';

    const body = '';

    try {
      const res = await this.http
        .post(uri, body, { responseType: 'text' })
        .toPromise();
      const jsonDoc = this.GetJSON(res) as daqResponse;
      return jsonDoc;
    } catch (err) {
      return this.errorHandler(err);
    }
  }

  public async postStart(runNo: number, ipAddress: string): Promise<daqResponse> {
    const uri: string = 'http://' + ipAddress + '/daqmw/scripts/daq.py/Begin';

    const body =
      "cmd=<?xml version='1.0' encoding='UTF-8' ?><request><runNo>" +
      runNo +
      '</runNo></request>';

    try {
      const res = await this.http
        .post(uri, body, { responseType: 'text' })
        .toPromise();
      const jsonDoc = this.GetJSON(res) as daqResponse;
      return jsonDoc;
    } catch (err) {
      return this.errorHandler(err);
    }
  }

  public async postStop(ipAddress: string): Promise<daqResponse> {
    const uri: string = 'http://' + ipAddress + '/daqmw/scripts/daq.py/End';

    const body = '';

    try {
      const res = await this.http
        .post(uri, body, { responseType: 'text' })
        .toPromise();
      const jsonDoc = this.GetJSON(res) as daqResponse;
      return jsonDoc;
    } catch (err) {
      return this.errorHandler(err);
    }
  }

  public async postPause(ipAddress: string): Promise<daqResponse> {
    const uri: string = 'http://' + ipAddress + '/daqmw/scripts/daq.py/Pause';

    const body = '';

    try {
      const res = await this.http
        .post(uri, body, { responseType: 'text' })
        .toPromise();
      const jsonDoc = this.GetJSON(res) as daqResponse;
      return jsonDoc;
    } catch (err) {
      return this.errorHandler(err);
    }
  }

  public async postResume(ipAddress: string): Promise<daqResponse> {
    const uri: string = 'http://' + ipAddress + '/daqmw/scripts/daq.py/Restart';

    const body = '';

    try {
      const res = await this.http
        .post(uri, body, { responseType: 'text' })
        .toPromise();
      const jsonDoc = this.GetJSON(res) as daqResponse;
      return jsonDoc;
    } catch (err) {
      return this.errorHandler(err);
    }
  }

  public async getAPIInfo(): Promise<apiSettings> {
    try {
      const res = await this.http.get("assets/apiSettings.json").toPromise();
      var settings: apiSettings = res as apiSettings;
      this.apiAddress = settings["apiAddress"];
      this.apiName = settings["apiName"];
      this.expName = settings["expName"];
      return settings;
    } catch (err) {
      return this.errorHandler(err);
    }
  }

  public async getLinkList(): Promise<link[]> {
    try {
      const res = await this.http.get("assets/linkList.json").toPromise();
      var linkList: linkList = res as linkList;
      return linkList.URLs;
    } catch (err) {
      return this.errorHandler(err);
    }
  }

  private errorHandler(err: any) {
    console.log('Error occured.', err);
    return Promise.reject(err.message || err);
  }
}
