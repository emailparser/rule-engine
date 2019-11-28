import {RuleEngine} from "../";
import { Ruleable } from "../../models/rule";
export default class RuleEnforcer{

    public static reviewMany(rules: any[], data: any){
        const engine = new RuleEngine(data);
        RuleEnforcer.enforceForEngine(engine);
        for(const rule of rules){
            engine.validate(rule);
        }
    }

    private static enforceForEngine(engine: RuleEngine){
        engine
            .on("success", (action) => {
                console.log("SUCCESS");
                switch(action.do){
                    
                    case "__setvalue__":
                        engine.setJSONvalue(action.accessor, action.value);
                        break;
                    default:
                        console.log("Error matching switch statement to case");
                }
            })
            .on("failure", (action) => {
                console.log("failure", action);
            });
    }
}



































