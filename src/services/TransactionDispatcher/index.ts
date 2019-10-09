import {Types} from "mongoose";

import Axios from "axios";
import {ITransaction} from "../../models/transaction";
import {
    ShouldNotParseError,
    ProblemDuringParsingError
} from "../";

import * as Models from "../../models";

export default class TransactionDispatch{

    public static async transact(parsedId: string): Promise<ITransaction>{

        let transaction: ITransaction;

        TransactionDispatch.validateId(parsedId);
        const parsedData = await Models.parsedData.findById(parsedId);
        if(!parsedData) throw new ShouldNotParseError("Valid id does not mach any parsed data in database");
        const client = await Models.client.findById(parsedData.client);
        if(!client) throw new ShouldNotParseError("Client not found!");
        if(parsedData.status !== 0) throw new ShouldNotParseError("Parsed data does not have status 0");

        transaction = await Models.transaction.findOne({parsedData: parsedData._id});
        if(transaction) throw new ShouldNotParseError("There exists an transaction already for this parsedData");

        transaction = new Models.transaction({
            client: parsedData.client,
            format: parsedData.format,
            parsedData: parsedData._id,
            externalRef: parsedData.externalRef,
        }); 

        try {
            await transaction.save();
        } catch(e) {
            throw new ShouldNotParseError("Could not save transaction");
        }

        try {
            const {data} = await Axios.post(`${client.postEndpoint}/new_booking/${parsedData._id}`);
            transaction = await Models.transaction.findByIdAndUpdate(transaction._id, {
                internalRef: data.ref
            }, {new: true});
        } catch(e) {
            throw new ProblemDuringParsingError("Received error from client's system");
        }

        return transaction.toObject();
    }

    public static validateId(id: any){
        try {
            new Types.ObjectId(id);
        } catch(e) {
            throw new ShouldNotParseError("Invalid Id");
        }
    }
    

}