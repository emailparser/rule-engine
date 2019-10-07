import {Schema, model} from "mongoose";

const schema = new Schema({
    status: { type: Number, default: 0},
    email: { type: Schema.Types.ObjectId, ref: "email"},
    data: { type: String },
    externalRef: String,
    format: { type: Schema.Types.ObjectId, ref: "format"},
    client: { type: Schema.Types.ObjectId, ref: "client"}
}, {timestamps: true});

export default model("parseddata", schema, "parseddata");