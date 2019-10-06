import {model, Schema} from "mongoose";

const schema = new Schema({
    title: String,
    company: { type: Schema.Types.ObjectId, ref: "company"},
    type: { type: Schema.Types.ObjectId, ref: "type"},
    postEndpoint: String,
    price: Number
}, {timestamps: true});

export default model("client", schema, "client");