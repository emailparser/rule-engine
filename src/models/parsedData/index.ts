/* eslint-disable @typescript-eslint/interface-name-prefix */
import {Schema, model, Document} from "mongoose";

const schema = new Schema({
    status: { type: Number, default: 0},
    email: { type: Schema.Types.ObjectId, ref: "email"},
    data: { type: String },
    externalRef: String,
    format: { type: Schema.Types.ObjectId, ref: "format"},
    client: { type: Schema.Types.ObjectId, ref: "client"}
}, {timestamps: true});

export interface IParsedData extends Document{
    status: number;
    email: any;
    format: any;
    client: any;
    data: any;
    externalRef: string;
}

export default model<IParsedData>("parseddata", schema, "parseddata");