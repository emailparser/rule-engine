/* eslint-disable @typescript-eslint/interface-name-prefix */
import {Schema, model, Document, Types} from "mongoose";
import client from "../client";
import {isEmail} from "validator";

const schema = new Schema<IClientMail>({
    client: { type: Schema.Types.ObjectId, ref: "client"},
    email: {type: String, trim: true}
}, {timestamps: true});

schema.pre("validate", async function(next){

    const clientemail: any = this;
    if(!isEmail(clientemail.email)) throw Error();
    const found = await client.findById(clientemail.client);
    if(!found) throw Error();
    next();

});

export interface IClientMail extends Document{
    client: Types.ObjectId;
    email: string;
}
export default model<IClientMail>("clientemail", schema, "clientemail");