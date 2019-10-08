import {Types} from "mongoose";
import {IFormat} from "../../models/format";
import Axios from "axios";
import {
    ShouldNotparseError,
    ProblemDuringParsingError
} from "../";

import {
    email,
    parsedData,
    clientEmail,
    formatConnection
} from "../../models";

export default class BookingParser{

    public static async parse(emailId: string){

        BookingParser.validateId(emailId);
        const emailData = await email.findById(emailId);
        if(emailData.status !== 0) throw new ShouldNotparseError("Email doesn't have unparsed status");

        const parsed = await parsedData.findOne({email: emailData._id});
        if(parsed) throw new ShouldNotparseError("Email doesn't have unparsed status");

        const foundEmail = await clientEmail.findOne({email: emailData.to});
        if(!foundEmail) throw new ShouldNotparseError("Email's to is not recognized");

        const connections = await formatConnection
            .find({client: foundEmail.client})
            .populate({
                path: "format",
                populate: { path: "format" }
            });

        const format = BookingParser.getFormat(connections, emailData);
        if(!format) throw new ShouldNotparseError("Format not found");
        const [externalRef, data] = await BookingParser.retrieveDataFromText(emailData, format);

        // add transfoormationos here via method call

        const parsedDataInstance = new parsedData({
            email: emailData._id,
            data: JSON.stringify(data),
            externalRef: externalRef,
            format: format._id,
            client: foundEmail.client
        });
        
        try {
            await parsedDataInstance.save();
        } catch(e) {
            throw Error("There was an error saving the parsed Data");
        }
        

        return parsedDataInstance.toObject();
    }

    public static validateId(id: any){
        try {
            new Types.ObjectId(id);
        } catch(e) {
            throw new ProblemDuringParsingError("Invalid Id");
        }
    }

    public static getFormat(connections: any, emailData: any): IFormat{
        let format: IFormat;
        connections.forEach((conn: any) => {
            for(const email of conn.emails){
                if(email == emailData.from){
                    // @ts-ignore
                    format = conn.format;
                    return;
                };
            }
        });
        return format;
    }

    public static async retrieveDataFromText(emailData: any, format: IFormat){
        let response, externalRef;
        const textualData = "body: " + emailData.body + "pdfstring: " + emailData.pdfstring + "subject: " + emailData.subject;

        try {
            response = await Axios.post("http://dataparser.emailparser.online/parse/", {
                input: textualData,
                config: format.config
            });
        } catch(e) {
            if(!format) throw new ProblemDuringParsingError("Parsing failed during data retrieval");
        }

        try {
            externalRef = textualData
                .match(new RegExp(format.externalRefPattern, "g"))
                .shift();
        } catch(e) {
            if(!format) throw new ProblemDuringParsingError("Parsing failed during parsing of externalRef");
        }

        return [externalRef, response.data];
    }
}