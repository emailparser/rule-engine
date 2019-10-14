import {ApiConfig, ParsedData, RequestConfig, PaxType} from "./interface";
import {ProblemDuringParsingError} from "..";
import Axios from "axios";
import {ITransformation} from "../../models/transformation";
import * as Models from "../../models";
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
    private transctionId: string;
    public constructor(apiConfig: any){
        this.apiConfig = apiConfig;
    }

    public setClientId(id: string){
        this.clientId  = id;
    }
    public setTransaction(id: string){
        this.transctionId  = id;
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

    public async getActivities(): Promise<any[]>{
        const path = `/activity.json/search?lang=EN&currency=ISK&vendor=${this.apiConfig.vendorId}&start=2020-02-02&end=2020-02-04`;
        const {data} = await this.requestCaller(requestMethods.POST, path, {vendors: [this.apiConfig.vendorId]});
        return data.items;;
        
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
                client: this.clientId,
                key: "NA"
            };
        });
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
            default:
                throw new Error(key + " not a valid key");
        }

        return await method();
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
        if(paxTypes.length === 0) throw Error("Could not get pricing category");
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
                    const message = new Models.parsemessage({
                        message: `We couldn't determine pricing category based on the received value '${a.paxType}' for activy number ${this.data.activity} so we instead registered passenger as ${paxTypes[0].ticketCategory}, you can log into bokun.is to change this if needed`,
                        transaction: this.transctionId,
                        code: "90dab90c-39df-4359-a1a0-c474d62e0944"
                    });
                    message.save();
                }
                return {
                    ...a,
                    paxType: pricingCategoryId
                };
            });
        }
    }

}



// cases sem þarf að höndla
// stundum bara 1 pricingCategoryId per tour, t.d. "OTHER"
// stundum 2 með "ADULT" t.d. ATV
// stundum ekkert verð en verðið grrerinilega valið í extras
// SEE BELOW
/*
POST
/booking.json/guest/{sessionId}/reserve

The POST body should contain the answers to the questions, along with optional information about discount and payments. It will look similar to the following, which reserves an activity booking:
*/

const x = {
    "answers": {
        "answers": [{
            "type": "first-name",
            "answer": "John"
        }, {
            "type": "last-name",
            "answer": "Doe"
        }, {
            "type": "email",
            "answer": "john.doe@email.com"
        }, {
            "type": "phone-number",
            "answer": "+354 1234567"
        }, {
            "type": "nationality",
            "answer": "UK"
        }, {
            "type": "address",
            "answer": "123 Some St."
        }, {
            "type": "post-code",
            "answer": "101"
        }, {
            "type": "place",
            "answer": "Reykjavik"
        }, {
            "type": "country",
            "answer": "IS"
        }, {
            "type": "organization",
            "answer": "My company"
        }, {
            "type": "email-list-subscription",
            "question": "Yes, I want to subscribe to the email list",
            "answer": "true"
        }],
        "activityBookings": [
            {
                "bookingId": 443,
                "answerGroups": [
                    {
                        "name": "participant-info",
                        "answers": [
                            {
                                "type": "name",
                                "question": "Participant name",
                                "answer": "John"
                            }
                        ]
                    }, 
                    {
                        "name": "other",
                        "answers": [
                            {
                                "type": "special-requests",
                                "question": "Special requests",
                                "answer": "None."
                            }
                        ]
                    }
                ],
                "extraBookings": [
                    {
                        "bookingId": 194,
                        "answerGroups": [
                            {
                                "name": "extra-info",
                                "answers": [
                                    {
                                        "type": "extra-question",
                                        "question": "Which size do you use?",
                                        "answer": "Large",
                                        "questionId": 27
                                    }
                                ]
                            }
                        ]
                    }
                ],
                "pricingCategoryBookings": [
                    {
                        "bookingId": 200
                    }
                ],

                "pickupPlaceDescription": "Hotel Reykjavik",
                "pickupPlaceRoomNumber": "110"
            }
        ]
    }
};
