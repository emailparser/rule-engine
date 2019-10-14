/* eslint-disable @typescript-eslint/interface-name-prefix */
import {model, Schema, Document} from "mongoose";

const schema = new Schema({
    message: String,
    transaction: { type: Schema.Types.ObjectId, ref: "transaction"},
    seen: {type: Boolean, default: false},
    danger: {type: Boolean, default: false},
    code: String
}, {timestamps: true});

export interface IParseMessage extends Document{
    message: string;
    transaction: any;
    seen: boolean;
    danger: boolean;
    code: string;
}

export default model<IParseMessage>("parsemessage", schema, "parsemessage");