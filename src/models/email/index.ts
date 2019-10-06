import {model, Schema} from "mongoose";

const emailSchema = new Schema({
    client: Schema.Types.ObjectId,
    agency: Schema.Types.ObjectId,
    from: String,
    to: String,
    subject: String,
    html: String,
    body: String,
    pdftext: String,
    createdAt: Date,
    updatedAt: Date,
});

export default model("email", emailSchema, "email");