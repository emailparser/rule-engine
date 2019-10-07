/* eslint-disable @typescript-eslint/interface-name-prefix */
import {model, Schema, Document} from "mongoose";

const emailSchema = new Schema({
    from: String,
    to: String,
    subject: String,
    html: String,
    body: String,
    pdfstring: String,
    createdAt: Date,
    updatedAt: Date,
    status: Number
});

export interface IEmail extends Document{
    from: string;
    to: string;
    subject: string;
    html: string;
    body: string;
    pdfstring: string;
    createdAt: Date;
    updatedAt: Date;
    status: number;
}
export default model<IEmail>("email", emailSchema, "email");