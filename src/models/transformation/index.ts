import {model, Schema} from "mongoose";

const schema = new Schema({
    title: String,
    client: { type: Schema.Types.ObjectId, ref: "client"},
    key: { type: Schema.Types.ObjectId, ref: "keys"},
    externalKey: String
}, {timestamps: true});

export default model("transformation", schema, "transformation");