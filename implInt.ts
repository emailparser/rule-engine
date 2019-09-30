import {Types} from "mongoose";
export interface EmailData {
    to: string;
    from: string;
    subject: string;
    body: string;
    pdftext?: string;
    hotel: Types.ObjectId;
    agency: Types.ObjectId;
}

export interface Config{
    agency: Types.ObjectId;
}

export interface Reservation {
    hotel: Types.ObjectId;
    agency: Types.ObjectId;
    rooms?: Room[];
    bookingRef?: string;
    start?: Date;
    end?: Date;
}

interface Room {
    guest: string;
    roomType: string;
}

export interface Recipe{
    retrieveType: any;
    instruction: string;
    parameters: {};
    sub?: ([] | {});
}

export interface InterpraterMethod{
    (recipe: Recipe, text: string): Promise<any>;
}

export interface GrabberMethod{
    (text: string, parameters: {}): Promise<any>;
}