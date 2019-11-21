import {} from "./interface";
import Axios from "axios";
import * as Models from "../../models";
import * as I from "./interface";
import * as E from "./enum";
import * as otplib from "otplib";
import * as base64 from "base-64";
import builder from "xmlbuilder";
import RoomerAdapter from "./roomerAdapter";
import fs from "fs";
import path from "path";

const apiEndPoint = "http://api2.roomerdev.net/openAPI/REST";

type RequestMethod = "POST" | "GET"

export default class Roomer{
    public apiConfig: I.ApiConfig;
    private data: I.ParsedData;
    private clientId: string;
    private transctionId: string;
    private parsemessages: any[];
    
    private connectionSystemParams: any;
    public constructor(apiConfig: any){
        this.apiConfig = apiConfig;
        this.parsemessages = [];
    }


    public getDateStringNow(): string{
        return this.dateToString(new Date(), E.dateGranularity.second);
    }

    public dateToString(D: Date, granularity: E.dateGranularity): string{

        const Y = D.getFullYear();
        const M = D.getMonth() < 9 ? `0${D.getMonth() + 1}` : D.getMonth() + 1;
        const DT = D.getDate() < 10 ? `0${D.getDate()}` : D.getDate();
        const H = D.getUTCHours() < 10 ? `0${D.getUTCHours()}` : D.getUTCHours();
        const MIN = D.getMinutes() < 10 ? `0${D.getMinutes()}` : D.getMinutes();
        const SEC = D.getSeconds() < 10 ? `0${D.getSeconds()}` : D.getSeconds();

        switch(granularity){
            case E.dateGranularity.day:
                return `${Y}-${M}-${DT}`;
            case E.dateGranularity.minute:
                return `${Y}-${M}-${DT} ${H}:${MIN}`;
            case E.dateGranularity.second:
                return `${Y}-${M}-${DT} ${H}:${MIN}:${SEC}`;
        }
    }

    private async requestCaller(methodType: RequestMethod, path: string,  data?: any): Promise<any>{
        const apiConfig = this.apiConfig;
        var bytes = base64.decode(this.apiConfig.secret);
        otplib.totp.options = {
            algorithm: "SHA256",
            digits: 8,
            encoding: "hex"
        };
        const hash = otplib.totp.generate(bytes);
        const headers = {
            "Promoir-Roomer-Hotel-Identifier": apiConfig.hotelKey,
            "Promoir-Roomer-Hotel-ApplicationId": apiConfig.applicationKey,
            "Promoir-Roomer-Hotel-Secret": hash,
            "Content-type": "application/xml"
        };
        if(methodType === "POST"){
            console.log("data", data);
            return await Axios.post(apiEndPoint + path, data, {headers});
        } 
        return await Axios.get(apiEndPoint + path, {headers});
    }

    private async getBookableData(): Promise<I.Bookable>{
        return await RoomerAdapter.getBookableData();
    }

    public async getAvailability(){
        const start = "2019-12-05";
        const end = "2019-12-08";
        const {data} = await this.requestCaller("GET", `/availability/${start}/${end}`, {});
        // const {data} = await this.requestCaller(E.requestMethods.GET, `/availability/${start}/${end}`);
        //console.log("data", data); 
        return data;
    }

    public async testBooking(){
        // const payload = await this.getBookableData();
        // const xml = fs.readFileSync(path.join(__dirname, "/somexml.xml"));
        
        // const {data} = await this.requestCaller("POST", "/bookings", xml.toString());

        var obj = {
            root: {
                xmlbuilder: [{
                    repo: {
                        "@type": "git", // attributes start with @
                        "#text": "git://github.com/oozcitak/xmlbuilder-js.git" // text node
                    }
                },{
                    repo: {
                        "@type": "git", // attributes start with @
                        "#text": "git://github.com/oozcitak/xmlbuilder-js.git" // text node
                    }
                }]
            }
        };
        var xml = builder.create(obj).end({ pretty: true});
        console.log(xml);
        for(const i of [0,1,2,3,4,5]) console.log("");
        return xml;
    }
}
