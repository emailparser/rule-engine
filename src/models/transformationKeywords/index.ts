import {model, Schema} from "mongoose";

const schema = new Schema({
    client: { type: Schema.Types.ObjectId, ref: "client"},
    transformation: { type: Schema.Types.ObjectId, ref: "transformations"},
    pharase: String,
    negative: { type: Boolean, default: false },
    exact: { type: Boolean, default: false }
}, {timestamps: true});

export default model("transformationkeywords", schema, "transformationkeywords");