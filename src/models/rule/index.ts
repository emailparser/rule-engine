/* eslint-disable @typescript-eslint/interface-name-prefix */
import {model, Schema, Document} from "mongoose";

const schema = new Schema({
    client: { type: Schema.Types.ObjectId, ref: "client"},
    condition: {},
    actions: [{}],
    hook: String
}, {timestamps: true});


interface AllRule {[key: string]: Condition[]}
interface AnyRule {[key: string]: Condition[]}
interface AtomicCondition{
    accessor: string;
    operator: string;
    value: string;
}

type Condition = AllRule | AnyRule | AtomicCondition

interface Action{
    do: string;
    value?: string;

    accessor?: string;
}


export interface ITransformation extends Document{
    client: any;
    condition: Condition;
    actions: Action[];
    hook: string;
}



export default model<ITransformation>("rule", schema, "rule");