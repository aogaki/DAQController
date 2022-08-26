export class daqResult {
    status: string = "";
    code: string = "";
    className: string = "";
    name: string = "";
    methodName: string = "";
    messageEng: string = "";
    messageJpn: string = "";
}

export class daqResponse {
    methodName!: string;
    result!: daqResult;
}

export class daqLog {
    compName!: string;
    state!: string;
    eventNum!: string;
    compStatus!: string;
}

export class daqReturnValue {
    result!: daqResult;
    logs!: any;
}

export class logResponse {
    methodName!: string;
    returnValue!: daqReturnValue;
}

export class runLog {
    runNumber!: number;
    start!: number;
    stop!: number;
    expName!: string;
    comment!: string;
}

export class apiSettings {
    operatorAddress!: string;
    apiAddress!: string;
    apiName!: string;
    expName!: string;
    computerName!: string;
}

export class link {
    name: string = "";
    URL: string = "";
}

export class linkList {
    URLs!: link[];
}