// import rule, { Rule, Condition, Action } from "./";
// import * as Models from "../";
// import path from "path";
// import fs from "fs";
// import csv from "csvtojson";

// const ruleBase: Rule = {
//     client: "5ddd5b0674e1a5004ca99c54",
//     condition: {
//         all: []
//     },
//     hook: "beforesend",
//     actions: []
// };

// const rules: Rule[] = [];

// function makeRule(
//     priority: number,
//     condition: Condition,
//     actions: Action[]
// ): Rule {
//     return {
//         ...ruleBase,
//         priority,
//         condition,
//         actions
//     };
// }

// async function main() {
//     const csvFilePath = path.join(__dirname, "./adpickup.csv");
//     interface Icsv{
//         title: string;
//         economy: string;
//         premium: string;
//         smart: string;
//     }

//     const promises: Promise<any>[] = [];

//     csv()
//         .fromFile(csvFilePath)
//         .then((jsonObj: Icsv[]) => {
//             jsonObj.forEach(({ economy, premium }) => {
//                 rules.push(
//                     makeRule(
//                         3,
//                         {
//                             all: [
//                                 {
//                                     accessor: "pickupLocation.location",
//                                     operator: "__streq__",
//                                     value: economy
//                                 },
//                                 {
//                                     accessor: "product",
//                                     operator: "__streq__",
//                                     value: "PREMIUM"
//                                 }
//                             ]
//                         },
//                         [
//                             {
//                                 do: "__setvalue__",
//                                 accessor: "pickupLocation.location",
//                                 value: premium
//                             }
//                         ]
//                     )
//                 ),
//                 rules.push(
//                     makeRule(
//                         3,
//                         {
//                             all: [
//                                 {
//                                     accessor: "dropoffLocation.location",
//                                     operator: "__streq__",
//                                     value: economy
//                                 },
//                                 {
//                                     accessor: "product",
//                                     operator: "__streq__",
//                                     value: "PREMIUM"
//                                 }
//                             ]
//                         },
//                         [
//                             {
//                                 do: "__setvalue__",
//                                 accessor: "dropoffLocation.location",
//                                 value: premium
//                             }
//                         ]
//                     )
//                 );
//             });
//         });
//     await setTimeout(async () => {
//         const promises: Promise<Rule>[] = [];
//         rules.forEach((rule) => {
//             promises.push(Models.rule.create(rule));
//         });
//         await Promise.all(promises).then((res) => console.log("res", res)).then((e) => console.log("e", e));
//     }, 2500);
    
//     throw Error("Stop");
    

 
// }

// main();

// // async function main() {
// //     
// // }

// // main();
