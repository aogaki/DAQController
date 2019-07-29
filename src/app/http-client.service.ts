import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { NgxXml2jsonService } from 'ngx-xml2json';
import { logResponse, daqResponse } from './daq.model';

@Injectable({
  providedIn: 'root'
})
export class HttpClientService {
  constructor(private http: HttpClient, private x2j: NgxXml2jsonService) {}

  private GetJSON(response: string): any {
    // Any response from DAQ-MW has XML header and response
    // jsonDoc.response means chopping XML header
    const parser = new DOMParser();
    const xmlDoc: any = parser.parseFromString(response, 'text/xml');
    const jsonDoc: any = this.x2j.xmlToJson(xmlDoc);
    return jsonDoc.response;
  }

  public getLog(ipAddress: string): Promise<logResponse> {
    const uri: string = 'http://' + ipAddress + '/daqmw/scripts/daq.py/Log';

    return this.http
      .get(uri, { responseType: 'text' })
      .toPromise()
      .then(res => {
        const jsonDoc = this.GetJSON(res) as logResponse;
        return jsonDoc;
      })
      .catch(this.errorHandler);
  }

  public postConfigure(ipAddress: string): Promise<daqResponse> {
    const uri: string = 'http://' + ipAddress + '/daqmw/scripts/daq.py/Params';

    const body =
      "cmd=<?xml version='1.0' encoding='UTF-8' ?><request><params>config.xml</params></request>";

    return this.http
      .post(uri, body, { responseType: 'text' })
      .toPromise()
      .then(res => {
        const jsonDoc = this.GetJSON(res) as daqResponse;
        return jsonDoc;
      })
      .catch(this.errorHandler);
  }

  public postUnconfigure(ipAddress: string): Promise<daqResponse> {
    const uri: string =
      'http://' + ipAddress + '/daqmw/scripts/daq.py/ResetParams';

    const body = '';

    return this.http
      .post(uri, body, { responseType: 'text' })
      .toPromise()
      .then(res => {
        const jsonDoc = this.GetJSON(res) as daqResponse;
        return jsonDoc;
      })
      .catch(this.errorHandler);
  }

  public postStart(runNo: number, ipAddress: string): Promise<daqResponse> {
    const uri: string = 'http://' + ipAddress + '/daqmw/scripts/daq.py/Begin';

    const body =
      "cmd=<?xml version='1.0' encoding='UTF-8' ?><request><runNo>" +
      runNo +
      '</runNo></request>';

    return this.http
      .post(uri, body, { responseType: 'text' })
      .toPromise()
      .then(res => {
        const jsonDoc = this.GetJSON(res) as daqResponse;
        return jsonDoc;
      })
      .catch(this.errorHandler);
  }

  public postStop(ipAddress: string): Promise<daqResponse> {
    const uri: string = 'http://' + ipAddress + '/daqmw/scripts/daq.py/End';

    const body = '';

    return this.http
      .post(uri, body, { responseType: 'text' })
      .toPromise()
      .then(res => {
        const jsonDoc = this.GetJSON(res) as daqResponse;
        return jsonDoc;
      })
      .catch(this.errorHandler);
  }

  public postPause(ipAddress: string): Promise<daqResponse> {
    const uri: string = 'http://' + ipAddress + '/daqmw/scripts/daq.py/Pause';

    const body = '';

    return this.http
      .post(uri, body, { responseType: 'text' })
      .toPromise()
      .then(res => {
        const jsonDoc = this.GetJSON(res) as daqResponse;
        return jsonDoc;
      })
      .catch(this.errorHandler);
  }

  public postResume(ipAddress: string): Promise<daqResponse> {
    const uri: string = 'http://' + ipAddress + '/daqmw/scripts/daq.py/Restart';

    const body = '';

    return this.http
      .post(uri, body, { responseType: 'text' })
      .toPromise()
      .then(res => {
        const jsonDoc = this.GetJSON(res) as daqResponse;
        return jsonDoc;
      })
      .catch(this.errorHandler);
  }

  private errorHandler(err) {
    console.log('Error occured.', err);
    return Promise.reject(err.message || err);
  }
}
