export interface daqResult {
  status: string;
  code: string;
  className: string;
  name: string;
  methodName: string;
  messageEng: string;
  messageJpn: string;
}

export interface daqResponse {
  methodName: string;
  result: daqResult;
}

export interface daqLog {
  compName: string;
  state: string;
  eventNum: string;
  compStatus: string;
}

export interface daqReturnValue {
  result: daqResult;
  logs: daqLog[];
}

export interface logResponse {
  methodName: string;
  returnValue: daqReturnValue;
}
