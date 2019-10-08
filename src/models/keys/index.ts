/* eslint-disable @typescript-eslint/interface-name-prefix */
import {model, Schema, Document} from "mongoose";

const schema = new Schema({
    title: String,
    type: { type: Schema.Types.ObjectId, ref: "type"},
    required: { type: Boolean, default: true },
}, {timestamps: true});


export interface IKeys extends Document{
    title: string;
    type: string;
    required: boolean;
}



export default model<IKeys>("keys", schema, "keys");