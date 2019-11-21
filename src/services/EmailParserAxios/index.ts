import * as otplib from "otplib";
import Axios from "axios";
import { env } from "process";

otplib.totp.options = {
    "algorithm": "SHA256",
    "digits": 8,
    "encoding": "base64"
};
type MicroService = "api" | "bookingparser"

export default class EmailParserAxios{

    public static async post(service: MicroService, endpoint: string, data?: any, headers?: any){
        // @ts-ignore
        const secret = env[service.toUpperCase()];
        const url = `http://${service}.emailparser.online${endpoint}`;
        const OTP = otplib.totp.generate(secret);
        console.log("OTP", OTP);
        console.log("secret", secret);
        headers = {headers: {
            ...headers,
            "Parser-Service-Identifier": "ROOMER_SERVICE",
            "Parser-Service-Secret": OTP,
            "Access-Control-Allow-Origin": true
        }};
        /* eslint-disable */
        return await Axios.post(url, data, headers);

    }

    public static async get(service: MicroService, endpoint: string){
        // @ts-ignore
        const secret = env[service.toUpperCase()];
        const url = `http://${service}.emailparser.online${endpoint}`;
        const OTP = otplib.totp.generate(secret);
        console.log("OTP", OTP);
        console.log("secret", secret);
        const headers = {headers: {
            "Parser-Service-Identifier": "ROOMER_SERVICE",
            "Parser-Service-Secret": OTP,
            "Access-Control-Allow-Origin": true
        }};
        /* eslint-disable */
        return await Axios.get(url, headers);
    }


}
