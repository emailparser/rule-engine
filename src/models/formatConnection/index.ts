import {model, Schema} from "mongoose";

const schema = new Schema({
    format: { type: Schema.Types.ObjectId, ref: "format"},
    client: { type: Schema.Types.ObjectId, ref: "client"},
}, {timestamps: true});

export default model("formatconnections", schema, "formatconnections");