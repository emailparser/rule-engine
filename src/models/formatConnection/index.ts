/* eslint-disable @typescript-eslint/interface-name-prefix */
import {model, Schema, Document} from "mongoose";

const schema = new Schema({
    format: { type: Schema.Types.ObjectId, ref: "format"},
    client: { type: Schema.Types.ObjectId, ref: "client"},
    emails: [String]
}, {timestamps: true});

export interface IFormatConnection extends Document{
    format: Schema.Types.ObjectId;
    client: Schema.Types.ObjectId;
    emails: string[];
}
export default model<IFormatConnection>("formatconnections", schema, "formatconnections");