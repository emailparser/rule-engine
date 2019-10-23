import {ApiConfig, ParsedData, RequestConfig, PaxType} from "./interface";
import {ProblemDuringParsingError} from "..";
import Axios from "axios";
import {ITransformation} from "../../models/transformation";
import * as Models from "../../models";
import {isEmail} from "validator";
import {requestMethods, dateGranularity} from "./enum";
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
    private transctionId: string;
    private parsemessages: any[];
    public constructor(apiConfig: any){
        this.apiConfig = apiConfig;
        this.parsemessages = [];
    }

    public setClientId(id: string){
        this.clientId  = id;
    }
    public setTransaction(id: string){
        this.transctionId  = id;
    }

    public getDateStringNow(): string{
        return this.dateToString(new Date(), dateGranularity.second);
    }

    private async requestCaller(request: requestMethods, path: string,  data?: any): Promise<any>{
        let methodType: string;
        switch(request){
            case requestMethods.GET:
                methodType = "GET";
                break;
            case requestMethods.POST:
                methodType = "POST";
                break;
        }
        const date = this.getDateStringNow();
        const signBase = date + this.apiConfig.accessKey + methodType + path;
        const hash = crypto
            .createHmac("sha1", this.apiConfig.secretKey)
            .update(signBase)
            .digest("base64");

        const headers = {
            "X-Bokun-Date": date,
            "X-Bokun-AccessKey": this.apiConfig.accessKey,
            "X-Bokun-Signature": hash
        };
        
        if(methodType === "POST"){
            return await Axios.post(apiEndPoint + path, data, {headers});
        } 
        return await Axios.get(apiEndPoint + path, {headers});
    }

    public async getTourById(id: string){
        const items = await this.getActivities();
        return items.find((a) => a.id === id);
    }

    public async testMakeBooking(){
        // for testing purposes - can be removed later
        const body = {
            "activityRequest": {
                "activityId": 26577,
                "rateId": 36587,
                "pricingCategoryBookings": [
                    { "pricingCategoryId": 16118 },
                ],
                "date": "2020-02-10",
                "startTimeId": 56266
            },
            "customer": {
                "email": "John@example.com",
                "firstName": "John",
                "lastName": "Doe",
                "phoneNumber": "4993330",
                "phoneNumberCountryCode": "354"
            },
            "paymentOption": "NOT_PAID"
        };
        const {data} = await this.requestCaller(requestMethods.POST, "/booking.json/activity-booking/reserve-and-confirm", body);
        return data;
    }

    public async getActivities(): Promise<any[]>{
        const d1 = new Date();
        const d2 = new Date();
        d1.setMonth(12);
        d2.setMonth(12);

        const paramObj = this.getQueryString({
            start: this.dateToString(d1, dateGranularity.day),
            end: this.dateToString(d2, dateGranularity.day),
        });
        const path = `/activity.json/search?${paramObj}`;
        const {data} = await this.requestCaller(requestMethods.POST, path, {});
        return data.items;
    }

    public _getQueryString(params: any){
        return Object.keys(params).map(key => key + "=" + params[key]).join("&");
    }

    public dateToString(D: Date, granularity: dateGranularity): string{

        const Y = D.getFullYear();
        const M = D.getMonth() < 9 ? `0${D.getMonth() + 1}` : D.getMonth() + 1;
        const DT = D.getDate() < 10 ? `0${D.getDate()}` : D.getDate();
        const H = D.getHours() < 10 ? `0${D.getHours()}` : D.getHours();
        const MIN = D.getMinutes() < 10 ? `0${D.getMinutes()}` : D.getMinutes();
        const SEC = D.getSeconds() < 10 ? `0${D.getSeconds()}` : D.getSeconds();

        switch(granularity){
            case dateGranularity.day:
                return `${Y}-${M}-${DT}`;
            case dateGranularity.minute:
                return `${Y}-${M}-${DT} ${H}:${MIN}`;
            case dateGranularity.second:
                return `${Y}-${M}-${DT} ${H}:${MIN}:${SEC}`;
        }
    }

    public async getTourIds(): Promise<string[]>{
        const items = await this.getActivities();
        return items.map((a) => a.id);
    }

    public capitalize(str: string): string {
        return str.charAt(0).toUpperCase() + str.slice(1, str.length).toLocaleLowerCase();
    }

    private async _getActivities(): Promise<any>{
        const activites = await this.getActivities();
        return activites.map((a: any) => {
            return {
                title: a.title,
                externalKey: a.id,
                client: "NA",
                key: "NA"
            };
        });
    }

    private async _getLocations(): Promise<any>{
        const obj: any = {};
        const retArr = [];
        const activites = await this.getActivities();
        for(const a of activites){
            const path = `/activity.json/${a.id}/pickup-places`;
            const {data} = await this.requestCaller(requestMethods.GET, path, {});
            for(const d of data.pickupPlaces){
                //@ts-ignore
                if(!obj[d.id]) obj[d.id] = d;
            }
        
        }
        for(const key in obj) retArr.push(obj[key]);
        return retArr;
        
    }
    public async getTransformationsFor(key: string): Promise<ITransformation[]> {
        let method: () => Promise<ITransformation[]>;

        switch(key){
            case "paxType":
                method = () => this.getPaxTypes();
                break;
            case "activity":
                method = () => this._getActivities();
                break;
            case "pickupLocation":
                method = () => this._getLocations();
                break;
            default:
                throw new Error(key + " not a valid key");
        }

        return await method();
    }

    public getQueryString(obj: any){
        return this._getQueryString({
            ...obj,
            currrency: this.apiConfig.defaultCurrency ? this.apiConfig.defaultCurrency :  "ISK",
            lang: this.apiConfig.defaultLang ? this.apiConfig.defaultLang : "EN"
        });
    }

    public async getStartTimeId(tourId: string, date: Date){
        let ids = await this.getStartTimeIds(tourId, date);
        if(ids.length === 0){
            this.throwDangerError("Bokun.is didn't have any start time slots available on the day the agent specified", false);
        }
        const fromMidnight = date.getHours() * 60 + date.getMinutes();
        ids = ids.map((a: any) => {
            return {
                ...a,
                dm: Math.abs(fromMidnight - a.startTime)
            };
        });
        ids.sort((a, b) => a.dm - b.dm);
        const id = ids.shift();
        if(id.dm !== 0){
            this.parsemessages.push(new Models.parsemessage({
                message: "We didn't find an exact time that matched available time slots, so we picked the closest one! The difference between the specified time with the agent and the nearest time slot was " + id.dm + " minutes",
                transaction: this.transctionId,
                code: "abb2dc55-383a-4b6d-980d-e07f51a9a976"
            }));
        }
        return id.startTimeId;
    }

    public async throwDangerError(message: string, atFault: boolean){
        this.parsemessages = [];
        this.parsemessages.push(new Models.parsemessage({
            message: message,
            transaction: this.transctionId,
            code: "e67b455b-86b0-4383-99f6-abe094f726ec",
            danger: true,
            atFault
        }));
    }

    public async getStartTimeIds(tourId: string, date: Date): Promise<any[]>{
        const paramObj = this.getQueryString({
            start: this.dateToString(date, dateGranularity.day),
            end: this.dateToString(date, dateGranularity.day)
        });
        const url = `/activity.json/${tourId}/availabilities?${paramObj}`;
        const {data} = await this.requestCaller(requestMethods.GET, url);
        return data.map((a: any) => {
            const hm = a.startTime.split(":");
            return {
                startTimeId: a.startTimeId,
                startTime: parseInt(hm.shift()) * 60 + parseInt(hm.shift())
            };
        });
    }

    public async _getPaxTypes(id: string): Promise<any[]>{
        const {data} = await this.requestCaller(requestMethods.GET, `/activity.json/${id}/price-list`); 
        return data.pricesByDateRange.shift().rates.shift().passengers;
    }

    public async getPaxTypes(): Promise<any>{
        let ids = await this.getTourIds();
        let obj: any = {};
        let retArr = [];
        for(const id of ids){
            const passengerTypes = await this._getPaxTypes(id);
            for(const pax of passengerTypes){
                if(!obj[pax.ticketCategory]) obj[pax.ticketCategory] = 1;
            }
        }

        for(const key in obj)[
            retArr.push({
                externalKey: key,
                title: this.capitalize(key),
                key: "NA",
                client: this.clientId
            })
        ];
        return retArr;   
    }

    public setData(data: ParsedData){
        this.data = data;
    }

    public getData(){
        return this.data;
    }

    public async transformPaxTypes(){
        const paxTypes = await this._getPaxTypes(this.data.activity);
        const paxObj: any = {};
        // throws errr if no pricing category is found
        if(paxTypes.length === 0) this.throwDangerError("No passenger type was specified on the requested tour in Bókun.is", false);
        for(const type of paxTypes)
        {
            paxObj[type.ticketCategory] = type.pricingCategoryId;
        }
        // if only onee pricing category is found then hat is used for all paxTypes
        if(paxTypes.length === 1)
        {
            this.data.pax = this.data.pax.map((a: PaxType) => {
                return {
                    ...a,
                    paxType: paxTypes[0].pricingCategoryId
                };
            });
        }
        // else it maps them together
        else
        {
            this.data.pax = this.data.pax.map((a) => {
                let pricingCategoryId = paxObj[a.paxType];
                // if no match is found then the first data is found
                if(!pricingCategoryId){
                    pricingCategoryId = paxTypes[0].pricingCategoryId;
                    this.parsemessages.push(new Models.parsemessage({
                        message: `We couldn't determine pricing category based on the received value '${a.paxType}' for activy number ${this.data.activity} so we instead registered passenger as ${paxTypes[0].ticketCategory}, you can log into bokun.is to change this if needed`,
                        transaction: this.transctionId,
                        code: "90dab90c-39df-4359-a1a0-c474d62e0944"
                    }));
                }
                return {
                    ...a,
                    paxType: pricingCategoryId
                };
            });
        }
    }
}
