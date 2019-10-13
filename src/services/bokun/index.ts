import {ApiConfig, ParsedData, RequestConfig} from "./interface";
import {ProblemDuringParsingError} from "..";
import Axios from "axios";
import {ITransformation} from "../../models/transformation";
import {isEmail} from "validator";
import {requestMethods} from "./enum";
import crypto from "crypto";

const apiEndPoint = "https://api.bokun.is";


/*
    ATH ORRIGOO BÝST VIÐ FirstName ekki firrstName

    skoða allarr breytur sem eru sendarr á origoo og skoða capital cases

*/
export default class Caren{

    private apiConfig: ApiConfig;
    private data: ParsedData;
    private clientId: string;
    public constructor(apiConfig: any){
        this.apiConfig = apiConfig;
    }

    public setClientId(id: string){
        this.clientId  = id;
    }

    private dateToString(D: Date): string{
        const Y = D.getFullYear();
        const M = D.getMonth() < 9 ? `0${D.getMonth() + 1}` : D.getMonth() + 1;
        const DT = D.getDate() < 10 ? `0${D.getDate()}` : D.getDate();
        const H = D.getHours() < 10 ? `0${D.getHours()}` : D.getHours();
        const MIN = D.getMinutes() < 10 ? `0${D.getMinutes()}` : D.getMinutes();
        const SEC = D.getSeconds() < 10 ? `0${D.getSeconds()}` : D.getSeconds();
        return `${Y}-${M}-${DT} ${H}:${MIN}:${SEC}`;
    }

    public getDateStringNow(): string{
        return this.dateToString(new Date());
    }

    private getReuestConfig(path: string, request: requestMethods): RequestConfig{
        let method: string;
        switch(request){
            case requestMethods.GET:
                method = "GET";
                break;
            case requestMethods.POST:
                method = "POST";
                break;
        }
        const date = this.getDateStringNow();
        const signBase = date + this.apiConfig.accessKey + method + path;
        const hash = crypto.createHmac("sha1", this.apiConfig.secretKey).update(signBase).digest("base64");
        return {
            route: apiEndPoint + path,
            headers: {
                "X-Bokun-Date": date,
                "X-Bokun-AccessKey": this.apiConfig.accessKey,
                "X-Bokun-Signature": hash
            },

        };
    }


    public async test(): Promise<any>{
        const {route, headers} = this.getReuestConfig("/activity.json/search?lang=EN&currency=ISK", requestMethods.POST);
        const {data} = await Axios.post(route, {}, {headers});
        return data;
        
    }



}