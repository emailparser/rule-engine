/* eslint-disable @typescript-eslint/interface-name-prefix */
import {model, Schema, Document} from "mongoose";
import {ITransformation} from "../transformation";

interface ICallback {
    ( isMatch:  boolean ): void;
}


export interface ITransformationKeyword extends Document{
    client: string;
    transformation: ITransformation;
    phrase: string;
    negative: boolean;
    exact: boolean;
    matches(str: string, cb: any): void;
}

const schema = new Schema({
    client: { type: Schema.Types.ObjectId, ref: "client"},
    transformation: { type: Schema.Types.ObjectId, ref: "transformations"},
    phrase: String,
    negative: { type: Boolean, default: false },
    exact: { type: Boolean, default: false }
}, {timestamps: true});

schema.methods.matches = function(str: string, cb: ICallback){
    let phrase: string;
    let strList: string[];
    let phraseList: string[];

    if(!this.phrase) this.phrase = "";

    str        = str.toLowerCase().trim();
    phrase     = this.phrase.toLowerCase().trim();
    strList    = str.split(" ");
    phraseList = phrase.split(" ");

    if(this.exact) cb(str.includes(phrase));
    else {
        cb(phraseList.every((word: string) => {
            return strList.includes(word);
        }));
    }
    
};




export default model<ITransformationKeyword>("transformationkeywords", schema, "transformationkeywords");