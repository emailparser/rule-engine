import {Types} from "mongoose";
import {transformationKeywords} from "../../models";
import {ITransformationKeyword} from "../../models/transformationKeywords";
import {ProblemDuringParsingError} from "../";
export default class Transformer{
    private client: Types.ObjectId;
    private groupped:  { [key: string]: ITransformationKeyword[] }

    public constructor(id: Types.ObjectId){
        this.client = id;
        this.groupped = {};
    }

    public async getTransformations(): Promise<void>{
        const allKeywords = await transformationKeywords
            .find({client: this.client})
            .populate({
                path: "transformation",
                model: "transformation",
                populate: {
                    path: "key",
                    model: "keys",
                }
            });
        for(const keyword of allKeywords){
            const key = keyword.transformation.key.title;
            if(!this.groupped[key]) this.groupped[key] = [];
            this.groupped[key].push(keyword);
        }
    }

    private transformValue(key: string, value: string): string {

        // if there are no transformations for this key
        // then we return the label unchanged
        if(!this.groupped[key]) return value;

        // copies array
        const matches = this.groupped[key].map((a: any) => a);

        let negative: ITransformationKeyword[] = [];
        let positive: ITransformationKeyword[] = [];
        let transformedValue: string;

        negative = matches.filter((match: ITransformationKeyword) => {
            let negativeMatch = false;
            if(!match.negative) return false;
            match.matches(value, (isMatch: boolean) => {
                return isMatch;
            });
        });

        positive = matches.filter((match: ITransformationKeyword) => !match.negative);  
        negative.forEach((n: ITransformationKeyword) => {
            positive = positive.filter((p: ITransformationKeyword) => {
                return p.transformation.externalKey !== n.transformation.externalKey;
            });
        });
        positive.forEach((match: ITransformationKeyword) => {
            match.matches(value, (isMatch: boolean) => {
                if(isMatch){
                    transformedValue= match.transformation.externalKey;
                    return;
                };
            });
        });

        if(transformedValue) return transformedValue;
        else throw new ProblemDuringParsingError(`Coud not find ${key} with the value ${value}`);
    }
    
    private isObject(a: any): boolean {
        return (!!a) && (a.constructor === Object);
    };

    private isArray(a: any): boolean{
        return Array.isArray(a);
    }

    public transform(data: any){
        this._transform(data, (key: string, value: string, setValue: any) => {
            setValue(this.transformValue(key, value));
        });
    }

    private _transform(data: any, getReplacement: any): void{
        // if it's an array we check for keys in all array elements
        if(this.isArray(data))
        {
            for(const item of data){
                this._transform(item, getReplacement);
            }
        } 
        // if it's an object then we start by chcking it's keys
        else if (this.isObject(data))
        {
            for(const key in data)
            {
                const value = data[key];
                // if the value too key is array or object we go deeper
                if(this.isObject(value) || this.isArray(value))
                {
                    this._transform(value, getReplacement);
                } 
                // else its primitive and we check if transformations apply
                else 
                {
                    // call back which provides key and receiives another callback if key should be transformed
                    
                    getReplacement(key, data[key], function getValue(newValue: any){
                        data[key] = newValue;
                    });
                }
            }
        }
    }
}