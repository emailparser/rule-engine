/* eslint-disable @typescript-eslint/interface-name-prefix */
import {model, Schema, Document} from "mongoose";
import {isEmail} from "validator";

/**
 * Email schema for incoming emails for clients
 */

const emailSchema = new Schema({
    from: {
        type: String,
        trim: true,
        validate(){
            return isEmail(this.from);
        }
    },
    to: {
        type: String,
        trim: true,
        validate(){
            return isEmail(this.to);
        }
    },
    subject: {
        type: String,
        default: "Not recievied"
    },
    body: {
        type: String,
        default: "Not recievied"
    },
    pdfstring: {
        type: String,
        default: "Not recievied"
    },
    createdAt: Date,
    updatedAt: Date,
    status: {
        type: Number,
        default: 0
    }
});

export interface IEmail extends Document{
    from: string;
    to: string;
    subject: string;
    body: string;
    pdfstring: string;
    createdAt: Date;
    updatedAt: Date;
    status: number;
    html: string;
}

export default model<IEmail>("email", emailSchema, "email");