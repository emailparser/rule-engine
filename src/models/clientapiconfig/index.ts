/* eslint-disable @typescript-eslint/interface-name-prefix */
import {Schema, model, Document} from "mongoose";

const schema = new Schema({
    client: { type: Schema.Types.ObjectId, ref: "client"},
}, {timestamps: true});

export default model("clientapiconfig", schema, "clientapiconfig");