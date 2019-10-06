import {Schema, model} from "mongoose";

const schema = new Schema({
    title: String,
    emails: String,
    owner: { type: Schema.Types.ObjectId, ref: "company"},
    type: { type: Schema.Types.ObjectId, ref: "type"},
    examples: String,
    shouldParsePattern: { type: String },
    shouldNotParsePattern: { type: String },
    config: Object,
    externalRefPattern: String
}, {timestamps: true});

export default model("format", schema, "format");