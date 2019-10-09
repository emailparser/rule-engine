/* eslint-disable @typescript-eslint/interface-name-prefix */
import {model, Schema, Document} from "mongoose";

const schema = new Schema({
    title: String,
    company: { type: Schema.Types.ObjectId, ref: "company"},
    type: { type: Schema.Types.ObjectId, ref: "type"},
    postEndpoint: String,
    price: Number
}, {timestamps: true});

export interface IClient extends Document{
    title: string;
    company: any;
    type: any;
    postEndpoint: string;
    price: number;
}

export default model<IClient>("client", schema, "client");