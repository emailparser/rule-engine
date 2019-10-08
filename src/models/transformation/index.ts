/* eslint-disable @typescript-eslint/interface-name-prefix */
import {model, Schema, Document} from "mongoose";
import {IKeys} from "../keys";

const schema = new Schema({
    title: String,
    client: { type: Schema.Types.ObjectId, ref: "client"},
    key: { type: Schema.Types.ObjectId, ref: "keys"},
    externalKey: String
}, {timestamps: true});

export interface ITransformation extends Document{
    client: string;
    title: string;
    key: IKeys;
    externalKey: string;
}



export default model("transformation", schema, "transformation");