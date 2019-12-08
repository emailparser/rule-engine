import rule, { Rule, Condition, Action } from "./";
import * as Models from "../";
const ruleBase: Rule = {
    client: "5ddd5b0674e1a5004ca99c54",
    condition: {
        all: []
    },
    hook: "beforesend",
    actions: []
};

function makeRule(
    priority: number,
    condition: Condition,
    actions: Action[]
): Rule {
    return {
        ...ruleBase,
        priority,
        condition,
        actions
    };
}


export default {};