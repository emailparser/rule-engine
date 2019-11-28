import {RuleEngine} from "../";
export default class RuleEnforcer{
    private noPreReq: any[];
    private withPreReq: { [key: string]: any[] }
    private engine: RuleEngine;
    private constructor(rules: any[], data: any){
        this.noPreReq = [];
        this.withPreReq = {};
        this.engine = new RuleEngine(data);
        this.enforceForEngine();
        rules.sort((a, b) => (a.priority - b.priority));
        for(const rule of rules){
            if(!rule.prereq) this.noPreReq.push(rule);
            else this.addToPrereqArray(rule); 
        }
        this.validateAll();
    }

    private addToPrereqArray(rule: any){
        const key = rule.prereq;
        if(!this.withPreReq[key]) this.withPreReq[key] = [];
        this.withPreReq[key].push(rule);
    }

    private validateAll(){
        for(const rule of this.noPreReq){
            this.reviewMany([rule]);
            const contingentRules = this.withPreReq[rule._id];
            if(contingentRules != null) this.reviewMany(contingentRules);
        }
    }

    private reviewMany(rules: any[]){
        for(const rule of rules){
            this.engine.validate(rule);
        }
    }

    public static reviewMany(rules: any[], data: any){
        new RuleEnforcer(rules, data);
    }

    private enforceForEngine(){

        this.engine
            .on("success", (action) => {
                switch(action.do){
                    
                    case "__setvalue__":
                        this.engine.setJSONvalue(action.accessor, action.value);
                        break;
                    default:
                        console.log("Error matching switch statement to case");
                }
            })
            .on("failure", (action) => {
            });
    }
}



































