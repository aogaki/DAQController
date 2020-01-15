export class daqResult {
  status: string;
  code: string;
  className: string;
  name: string;
  methodName: string;
  messageEng: string;
  messageJpn: string;
}

export class daqResponse {
  methodName: string;
  result: daqResult;
}

export class daqLog {
  compName: string;
  state: string;
  eventNum: string;
  compStatus: string;
}

export class daqReturnValue {
  result: daqResult;
  logs: daqLog[];
}

export class logResponse {
  methodName: string;
  returnValue: daqReturnValue;
}
