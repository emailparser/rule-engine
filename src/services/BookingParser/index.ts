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

        let format: IFormat;
        let externalRef: string;
        let response: any;

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

        
        connections.forEach((conn) => {
            for(const email of conn.emails){
                if(email == emailData.from){
                    // @ts-ignore
                    format = conn.format;
                    return;
                };
            }
        });

        if(!format) throw new ShouldNotparseError("Format not found");

        const textualData = emailData.body + " \r " + emailData.pdfstring + " \r " + emailData.subject;
        
        try {
            response = await Axios.post("http://dataparser.emailparser.online/parse/", {
                input: textualData,
                config: format.config
            });
            
            externalRef = textualData
                .match(new RegExp(format.externalRefPattern, "g"))
                .shift();
        } catch(e) {
            if(!format) throw new ProblemDuringParsingError("Parsing failed");
        }

        const parsedDataInstance = new parsedData({
            email: emailData._id,
            data: JSON.stringify(response.data),
            externalRef: externalRef,
            format: format._id,
            client: foundEmail.client
        });


        
        await parsedDataInstance.save();

        return parsedDataInstance.toObject();
    }

    public static validateId(id: any){
        try {
            new Types.ObjectId(id);
        } catch(e) {
            throw new ProblemDuringParsingError("Invalid Id");
        }
    }
}