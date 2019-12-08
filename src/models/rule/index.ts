/* eslint-disable @typescript-eslint/interface-name-prefix */
import {model, Schema, Document, Types} from "mongoose";

const schema = new Schema({
    client: { type: Schema.Types.ObjectId, ref: "client"},
    condition: {},
    actions: [{}],
    hook: String,
    priority: Number,
    comment: String
}, {timestamps: true});


interface AllRule {[key: string]: Condition[]}
interface AnyRule {[key: string]: Condition[]}
interface AtomicCondition{
    accessor: string;
    operator: string;
    value: string;
}

export type Condition = AllRule | AnyRule | AtomicCondition

export interface Action{
    do: Do;
    value?: string | number;

    accessor?: any;
}

type Hook = "oncreate" | "beforesend"
type Do = "__setvalue__" | "__sendparsemessage__" | "__setminute__" | "__sethour__"

export interface Ruleable{
    client: any;
    condition: Condition;
    actions: Action[];
    hook: Hook;
    priority?: number;
    prereq?: any;
    _id?: any;
}

export interface Rule{
    client: any;
    condition: Condition;
    actions: Action[];
    hook: Hook;
    priority?: number;
    prereq?: any;
}

interface IRule extends Rule, Document{}


export default model<IRule>("rule", schema, "rule");