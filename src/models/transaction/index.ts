/* eslint-disable @typescript-eslint/interface-name-prefix */

import {Schema, model, Document} from "mongoose";

const schema = new Schema({
    client: { type: Schema.Types.ObjectId, ref: "client"},
    format: { type: Schema.Types.ObjectId, ref: "format"},
    parseddata: { type: Schema.Types.ObjectId, ref: "parseddata"},
    externalRef: String,
    internalRef: { type: String, default: null},
}, {timestamps: true});

export interface ITransaction extends Document{
    client: any;
    format: any;
    parsedData: any;
    externalRef: string;
    internalRef: string;
}

export default model<ITransaction>("transaction", schema, "transaction");