/* eslint-disable @typescript-eslint/no-var-requires */
import {
    EmailData,
    Config,
    Reservation,
    Recipe,
    GrabberMethod
} from "./implInt";

const {ParseConfig} = require("./src/models");

class Parser{

    private data: EmailData;
    private config: Config;
    private reservation: Reservation;

    private constructor(data: EmailData, config: Config){
        this.config = config;
        this.data = data;
        this.reservation = {
            hotel: data.hotel,
            agency: data.agency
        };
    }

    public static async parse(emailData: EmailData){
        const config = await ParseConfig.find({
            agency: emailData.agency
        });
        const parser = new Parser(emailData, config);
        return await parser.parse();
    }

    public async parse(): Promise<Reservation> {
        for(const key in this.config){
            const value = await this.interpret(key);
            if(!value){
                throw Error(`Could not parse ${key}`);
            }
            this.reservation[key] = value;

        }
        return this.reservation;
    }

    private async interpret(key): Promise<any>{
        const dataKeys = ["body", "pdftext", "subject"];
        const recipe: Recipe = this.data[key];
        let value: any;
        while(dataKeys.length > 0 && !value){
            const key = dataKeys.shift();
            const data = this.data[key];
            if(!data) continue;
            value = this.intRouter(recipe, data);
        }
    }

    private async intRouter(recipe: Recipe, text: string): Promise<any>{
        let method;
        
        switch(recipe.retrieveType){
            case Date:
                method = () => this.intDate(recipe, text);
                break;
            case String:
                method = () => this.intPrimitive(recipe, text, String);
                break;
            case Boolean:
                method = () => this.intPrimitive(recipe, text, Boolean);
                break;
            case Array:
                method = () => this.intArray(recipe, text);
                break;
            case Object:
                method = () => this.intObject(recipe, text);
                break;
            default:
                throw Error(`Retrieve Type ${recipe.retrieveType} does not exist`);
        }

        return await method();
    }

    private instructions(){
        return {
            PATTERN: this.pattern,
            STRING_BETWEEN: this.stringBetween,
            STRING_AFTER: this.stringAfter,
            STRING_BEFORE: this.stringBefore,
            EXACT_PHRASE: this.exactPhrase,
            REGEX_STRING: this.regexString
        };
    }

    private async intDate(recipe: Recipe, text: string): Promise<any>{
        
    }

    private async intArray(recipe: Recipe, text: string): Promise<any>{

    }

    private async intObject(recipe: Recipe, text: string): Promise<any>{

    }

    private async intPrimitive(recipe: Recipe, text: string, Type: any): Promise<any>{
        const method: GrabberMethod = this.instructions()[recipe.instruction];
        const value =  await method(text, recipe.parameters);
        return Type(value);
    }

    private pattern(text: string, parameters: {}): string{

        return "-1";
    }

    private stringBetween(text: string, parameters: {}): string{

        return "-1";
    }

    private stringBefore(text: string, parameters: {}): string{

        return "-1";
    }

    private stringAfter(text: string, parameters: {}): string{

        return "-1";
    }

    private exactPhrase(text: string, parameters: {}): string{

        return "-1";
    }

    private regexString(text: string, parameters: {}): string{

        return "-1";
    }
}