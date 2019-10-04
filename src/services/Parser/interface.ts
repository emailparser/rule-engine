import {Types} from "mongoose";
export interface EmailData {
    [elementType: string]: any;
}

export interface Config{
    agency: Types.ObjectId;
    hotel: Types.ObjectId;
}

export interface Reservation {
    [elementType: string]: any;
}

interface Room {
    guest: string;
    roomType: string;
}

export interface Recipe{
    retrieveType: any;
    instruction: string;
    parameters: any;
    sub?: any;
}

export interface InterpraterMethod{
    (recipe: Recipe, text: string): Promise<any>;
}

export interface GrabberMethod{
    (text: string, parameters: {}): Promise<string[]>;
}