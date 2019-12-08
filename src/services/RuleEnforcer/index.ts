import { RuleEngine } from "../";
import { Types } from "mongoose";
import { parsemessage } from "../../models";
import { Rule } from "../../models/rule";
import * as Models from "../../models";
export default class RuleEnforcer {
    private noPreReq: any[];
    private withPreReq: { [key: string]: any[] };
    private engine: RuleEngine;
    private client: Types.ObjectId;
    private ref: string;
    private constructor(
        rules: any[],
        data: any,
        client?: Types.ObjectId,
        bookingRef?: string
    ) {
        this.client = client;
        this.ref = bookingRef;
        this.noPreReq = [];
        this.withPreReq = {};
        this.engine = new RuleEngine(data);
        this.enforceForEngine();
        rules.sort((a, b) => a.priority - b.priority);
        for (const rule of rules) {
            if (!rule.prereq) this.noPreReq.push(rule);
            else this.addToPrereqArray(rule);
        }
        this.validateAll();
    }

    private addToPrereqArray(rule: any) {
        const key = rule.prereq;
        if (!this.withPreReq[key]) this.withPreReq[key] = [];
        this.withPreReq[key].push(rule);
    }

    private validateAll() {
        for (const rule of this.noPreReq) {
            this.reviewMany([rule]);
            const contingentRules = this.withPreReq[rule._id];
            if (contingentRules != null) this.reviewMany(contingentRules);
        }
    }

    private reviewMany(rules: any[]) {
        for (const rule of rules) {
            this.engine.validate(rule);
        }
    }

    public static reviewMany(
        rules: any[],
        data: any,
        client?: Types.ObjectId,
        bookingRef?: string
    ) {
        new RuleEnforcer(rules, data, client, bookingRef);
    }

    private enforceForEngine() {
        this.engine
            .on("success", (action) => {
                switch (action.do) {
                    case "__setvalue__":
                        this.engine.setJSONvalue(action.accessor, action.value);
                        break;
                    case "__sendparsemessage__":
                        parsemessage.create({
                            client: this.client,
                            message: `${this.ref}: ${action.value}`
                        });
                        break;
                    case "__sethour__":
                        this.getDateForAction(action, (date: Date) => {
                            date.setUTCHours(action.value);
                            this.engine.setJSONvalue(action.accessor, date);
                        });
                        break;
                    case "__setminute__":
                        this.getDateForAction(action, (date: Date) => {
                            date.setMinutes(action.value);
                            this.engine.setJSONvalue(action.accessor, date);
                        });
                        break;
                    default:
                        console.log("Error matching switch statement to case");
                }
            })
            .on("failure", (action) => {});
    }

    private getDateForAction(action: any, success: (date: Date) => void) {
        const date = new Date(
            Date.parse(this.engine.getJSONvalue(action.accessor))
        );
        if (isNaN(date.getTime())) {
            console.log(action.do, "Value is not date");
            return;
        }
        success(date);
    }
}

// const example: Rule[] = [
//     {
//         condition: {
//             any: [{
//                 accessor: "fromDate.flightNumber",
//                 operator: "__streq__",
//                 value: "fi 630"

//             },
//             {
//                 accessor: "fromDate.flightNumber",
//                 operator: "__streq__",
//                 value: "fi 680"

//             },
//             {
//                 accessor: "fromDate.flightNumber",
//                 operator: "__streq__",
//                 value: "fi 622"
    
//             },
//             {
//                 accessor: "fromDate.flightNumber",
//                 operator: "__streq__",
//                 value: "fi 602"
    
//             },
//             {
//                 accessor: "fromDate.flightNumber",
//                 operator: "__streq__",
//                 value: "fi 614"
    
//             },
//             {
//                 accessor: "fromDate.flightNumber",
//                 operator: "__streq__",
//                 value: "fi 696"
    
//             }]
//         },
//         actions: [
//             {
//                 do: "__setminute__",
//                 accessor: "fromDate.startTime",
//                 value: 0
//             },
//             {
//                 do: "__sethour__",
//                 accessor: "fromDate.startTime",
//                 value: 7
//             }
//         ],
//         hook: "beforesend",
//         client: "5ddd5b0674e1a5004ca99c54"
//     },
//     {
//         condition: {
//             any: [{
//                 accessor: "fromDate.flightNumber",
//                 operator: "__streq__",
//                 value: "fi 644"

//             },
//             {
//                 accessor: "fromDate.flightNumber",
//                 operator: "__streq__",
//                 value: "fi 852"

//             },
//             {
//                 accessor: "fromDate.flightNumber",
//                 operator: "__streq__",
//                 value: "fi 656"
    
//             }]
//         },
//         actions: [{
//             do: "__setminute__",
//             accessor: "fromDate.startTime",
//             value: 30
//         },
//         {
//             do: "__sethour__",
//             accessor: "fromDate.startTime",
//             value: 7
//         }],
//         hook: "beforesend",
//         client: "5ddd5b0674e1a5004ca99c54"
//     }
// ];
