/* eslint-disable @typescript-eslint/interface-name-prefix */
import {model, Schema, Document, Types} from "mongoose";

const schema = new Schema({
    client: { type: Schema.Types.ObjectId, ref: "client"},
    condition: {},
    actions: [{}],
    hook: String,
    priority: Number
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

type Hook = "oncreate" | "beforesend"

export interface Ruleable{
    client: any;
    condition: Condition;
    actions: Action[];
    hook: Hook;
    priority?: number;
    prereq?: any;
    _id?: any;
}

interface IRule extends Document{
    client: any;
    condition: Condition;
    actions: Action[];
    hook: Hook;
    priority?: number;
    prereq?: any;
}



export default model<IRule>("rule", schema, "rule");