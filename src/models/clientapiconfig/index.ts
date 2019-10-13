/* eslint-disable @typescript-eslint/no-empty-interface */
/* eslint-disable @typescript-eslint/interface-name-prefix */
import {Schema, model, Document} from "mongoose";

const schema = new Schema({
    client: { type: Schema.Types.ObjectId, ref: "client"},
    apiConnectionInfo: Object
}, {timestamps: true});

export interface IClientApiConfig extends Document{
    client: string;
    apiConnectionInfo: any;
}

export default model<IClientApiConfig>("clientapiconfig", schema, "clientapiconfig");