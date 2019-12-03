import { ICondition } from "./ICondition";
import { IRule } from "./IRule";
import operators from "./operators";
import lifecycleHooks from "./lifecycleHooks";
import actions from "./actions";

type outcome = "failure" | "success"
export default class RuleEngine{


    /**
     * 
     * static methods
     */

    public static getOperators(){
        const retArr = [];
        for(const [key, val] of Object.entries(operators)){
            retArr.push({operator: key, ...val});
        }
        return retArr;
    }

    public static getLifeCycleHooks(){
        return lifecycleHooks;
    }

    public static getActions(){
        return actions;
    }
    /**
     * Instance methods
     */

    private receivedJSON: any;
    private actions: any;
    private failure: (action: any) => void;
    private success: (action: any) => void;
    public constructor(receivedJSON: any){
        this.receivedJSON = receivedJSON;
    }

    public validate(rule: IRule): void{
        this.actions = rule.actions;
        const result = this._validate(rule.condition);
        this.emit(result);
    }

    private emit(result: boolean){
        for(const action of this.actions){
            const cbName: outcome = result ? "success" : "failure";
            this[cbName](action);
        }
    }
        

    public on(outcome: outcome, cb: (action: any) => void){
        this[outcome] = cb;
        return this;
    }

    private _validate(cond: any): boolean{
        if(Object.entries(cond).length === 1 && cond.any)
            return cond.any.some((sub: any) => this._validate(sub));
        else if(Object.entries(cond).length === 1 && cond.all)
            return cond.all.every((sub: any) => this._validate(sub));
        else if(Object.entries(cond).length === 3 && (cond.accessor && cond.operator && cond.value !== null))
            return this._validateCondition(cond);
        else { 
            console.log("cond", cond);
            throw Error("Invalid Conditions");
        }
    }

    private _validateCondition(cond: ICondition): boolean{
        const jsonValue = this.getJSONvalue(cond.accessor);
        return this[cond.operator](jsonValue, cond.value);
    }

    private getJSONvalue(accessor: string){
        let o = this.receivedJSON;
        const a = accessor.split(".");
        for (var i = 0, n = a.length; i < n; i++) {
            var k = a[i];
            if (k in o) o = o[k];
            else return;
        }
        return o;
    }

    public setJSONvalue(accessor: string, newValue: any){
        let o = this.receivedJSON;
        const a = accessor.split(".");
        for (var i = 1, n = a.length; i <= n; i++) {
            var k = a[i - 1];
            if(i < n ) o = o[k];
            else o[k] = newValue;
        }
    }

    private __strin__(received: string, expected: string): boolean{
        if(!received) return false;
        if(typeof received !== "string") return false;
        return received.toLowerCase().includes(expected.toLowerCase());
    }

    private __strnin__(received: string, expected: string): boolean{
        return !this.__strin__(received, expected);
    }

    private __streq__(received: string, expected: string): boolean{
        if(!received) return false;
        if(typeof received !== "string") return false;
        return received.toLowerCase() === expected.toLowerCase();
    }

    private __strne__(received: string, expected: string): boolean{
        return !this.__streq__(received, expected);
    }

    private __strneq__(received: string, expected: string): boolean{
        return !this.__streq__(received, expected);
    }

    private __valnisnull__(received: string, expected: string): boolean{
        return received === null;
    }

    private __valnotnull__(received: string, expected: string): boolean{
        return !this.__valnisnull__(received, expected);
    }
}


