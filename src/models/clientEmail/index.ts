/* eslint-disable @typescript-eslint/interface-name-prefix */
import {Schema, model, Document} from "mongoose";

const schema = new Schema({
    client: { type: Schema.Types.ObjectId, ref: "client"},
    email: String
}, {timestamps: true});

export interface IClientMail extends Document{
    client: Schema.Types.ObjectId;
    email: string;
}
export default model<IClientMail>("clientemail", schema, "clientemail");