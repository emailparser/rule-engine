/* eslint-disable @typescript-eslint/interface-name-prefix */
import {Schema, model, Document} from "mongoose";

const schema = new Schema({
    title: String,
    owner: { type: Schema.Types.ObjectId, ref: "company"},
    type: { type: Schema.Types.ObjectId, ref: "type"},
    examples: String,
    shouldParsePattern: { type: String },
    shouldNotParsePattern: { type: String },
    config: Object,
    externalRefPattern: String
}, {timestamps: true});

export interface IFormat extends Document{
    title: string;
    shouldParsePattern: string;
    shouldNotParsePattern: string;
    config: any;
    externalRefPattern: string;
}

export default model("format", schema, "format");