import {ApiConfig, ParsedData, Bookable} from "./interface";
import {ProblemDuringParsingError} from "../";
import Axios from "axios";
import {ITransformation} from "../../models/transformation";
import {isEmail} from "validator";

const apiEndPoint = "https://booking.caren.is";


/*
    ATH ORRIGOO BÝST VIÐ FirstName ekki firrstName

    skoða allarr breytur sem eru sendarr á origoo og skoða capital cases

*/
export default class Caren{

    private apiConfig: ApiConfig;
    private session: string;

    private data: ParsedData;
    private clientId: string;
    public constructor(apiConfig: any){
        this.apiConfig = apiConfig;
    }

    public setClientId(id: string){
        this.clientId  = id;
    }


    private async setSession(): Promise<void>{
        const params = {...this.apiConfig};
        delete params.rentalId;
        try {
            const {data} = await Axios.post(apiEndPoint + "/vehicleapi/user/login", this.apiConfig);
            if(!data.Session) throw Error();
            this.session = data.Session;
        } catch(e) {
            throw new ProblemDuringParsingError("Could not get session from Caren for " + this.apiConfig.Username);
        }
    }

    public async book(data: ParsedData): Promise<any>{
        this.data = data;
        this.setSession();
        const guid = await this.sendReservation();
        return guid;
    }

    private getBookableData(): Bookable{
        const retItem = {
            ...this.apiConfig,
            language: "en-GB",
            session: this.session,
            classId: this.data.vehicle,
            pickupLocationId: this.data.locations[0],
            dropoffLocationId: this.data.locations[0],
            dateFrom: this.dateToString(this.data.dateFrom),
            dateTo: this.dateToString(this.data.dateTo),
            extras: this.getCarenExtras(),
            insurances: this.getCarenInsurances(),
            comments: this.data.comment + " " + this.data.pickupInfo,
            customer: this.data.customer,
            confirmReservation: true,
            pickupLocationExtraInfo: this.data.comment + " " + this.data.pickupInfo,
            affiliate: this.data.bookingRef
        };

        if(!isEmail(retItem.customer.email)) retItem.customer.email = "noreply@emailparser.no";
        return retItem;
    }

    private async sendReservation(): Promise<string>{
        await this.setSession();
        const params = this.getBookableData();
        if(process.env.NODE_ENV === "test"){
            return;
        }
        console.log(params);
        const {data}: any = await Axios.post(apiEndPoint + "/vehicleapi/reservation/add", params);
        if(!data.Guid){
            throw Error("Caren didn't accept the booking: " + JSON.stringify(data));
        }
        return data.Guid;
    }

    private dateToString(D: Date): string{
        const Y = D.getFullYear();
        const M = D.getMonth() < 9 ? `0${D.getMonth() + 1}` : D.getMonth() + 1;
        const DT = D.getDate() < 10 ? `0${D.getDate()}` : D.getDate();
        const H = D.getHours() < 10 ? `0${D.getHours()}` : D.getHours();
        const MIN = D.getMinutes() < 10 ? `0${D.getMinutes()}` : D.getMinutes();
        return `${Y}-${M}-${DT} ${H}:${MIN}`;
    }

    private getCarenInsurances(): string[][]{
        return this.data.insurances
            .map((a) => [a]);
    }
    private getCarenExtras(): string[][]{
        if(!this.data.extras) return [];
        return this.data.extras
            .map((a) => [a.item, a.quantity]);
    }


    private baseParams(): any {
        return {
            session: this.session,
            rentalId: this.apiConfig.rentalId,
            language: "en-GB",
        };
    }

    private getSomeDates(): Date[] {
        const d1 = new Date();
        d1.setMonth(d1.getMonth() + 8);
        d1.setDate(1);
        const d2 = new Date(d1.getTime());
        d2.setDate(4);
        return [d1, d2];
    }
    private async getClasses(): Promise<ITransformation[]>{
        // caren needs dates for this lookup
        // we set month as current + 8 months to ensure availability
        const [d1, d2] = this.getSomeDates();
        const params = this.baseParams();
        params.dateFrom = d1;
        params.dateTo = d2;
   
        // @ts-ignore
        const {data}: any = await Axios.post(apiEndPoint + "/vehicleapi/class/getlist", params);
        return this.mapCarenItemToTransformation(data.Classes);
    }

    private async getInsurances(): Promise<ITransformation[]> {
        const {data}: any = await Axios.post(apiEndPoint + "/vehicleapi/insurance/getlist", this.baseParams());
        return this.mapCarenItemToTransformation(data.Insurances); 
    }

    private mapCarenItemToTransformation(list: any[]): ITransformation[]{
        // @ts-ignore
        return list.map((a: any) => {
            return {
                title: a.Name,
                externalKey: a.Id,
                key: "NA",
                client: this.clientId
            };
        });
    }

    private async getExtras(): Promise<ITransformation[]> {
        const {data}: any = await Axios.post(apiEndPoint + "/vehicleapi/extra/getlist", this.baseParams());
        return this.mapCarenItemToTransformation(data.Extras); 
    }

    private async getLocations(): Promise<ITransformation[]> {
        const {data}: any = await Axios.post(apiEndPoint + "/vehicleapi/location/getpickuplist", this.baseParams());
        return this.mapCarenItemToTransformation(data.Locations);
    }

    public async getTransformationsFor(key: string): Promise<ITransformation[]> {
        let method: () => Promise<ITransformation[]>;

        await this.setSession();
        switch(key){
            case "vehicle":
                method = () => this.getClasses();
                break;
            case "insurances":
                method = () => this.getInsurances();
                break;
            case "extras":
                method = () => this.getExtras();
                break;
            case "locations":
                method = () => this.getLocations();
                break;
            default:
                throw new Error(key + " not a valid key");
        }

        return await method();
    }

}