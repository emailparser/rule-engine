import {ApiConfig, ParsedData, Bookable} from "./interface";
import {ProblemDuringParsingError} from "../";
import Axios from "axios";

const apiEndPoint = "https://booking.caren.is";
export default class Caren{

    private apiConfig: ApiConfig;
    private session: string;

    private data: ParsedData;
    public constructor(config: ApiConfig){
        this.apiConfig = config;
    }


    private async setSession(): Promise<void>{
        try {
            const {data} = await Axios.post(apiEndPoint + "/vehicleapi/user/login", this.apiConfig);
            if(!data.session) throw Error();
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

        return {
            ...this.apiConfig,
            session: this.session,
            classId: this.data.vehicle,
            pickupLocationId: this.data.pickupLocation,
            dropoffLocationId: this.data.dropoffLocation,
            dateFrom: this.dateToString(this.data.dateFrom),
            dateTo: this.dateToString(this.data.dateTo),
            extras: this.getCarenExtras(),
            insurances: this.getCarenInsurances(),
            comments: this.data.comment + " " + this.data.pickupInfo,
            customer: this.data.customer,
            confirmReservation: true,
            pickupLocationExtraInfo: this.data.comment + " " + this.data.pickupInfo,
            affiliate: this.data.bookingRef
        };;
    }

    private async sendReservation(): Promise<string>{
        await this.setSession();
        const params = this.getBookableData();
        if(process.env.NODE_ENV === "test"){
            return;
        }
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
        return this.data.extras
            .map((a) => [a.item, a.quantity]);
    }

}