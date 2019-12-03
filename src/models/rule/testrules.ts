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

// const data = fs.readFileSync(path.join(__dirname, "./pickupps.csv")).toString();
// async function saveresults(): Promise<string[][]> {
//     return new Promise((res) => {
//         csv({ noheader: true, output: "csv" })
//             .fromString(data)
//             .then((csvRow) => {
//                 res(csvRow);
//             });
//     });
// }

// async function main() {
//     const rows: string[][] = await saveresults();
//     rows.forEach(([economy, premium]) => {
//         rules.push(
//             makeRule(
//                 3,
//                 {
//                     all: [
//                         {
//                             accessor: "pickupLocation.location",
//                             operator: "__streq__",
//                             value: economy
//                         },
//                         {
//                             accessor: "product",
//                             operator: "__streq__",
//                             value: "PREMIUM"
//                         }
//                     ]
//                 },
//                 [
//                     {
//                         do: "__setvalue__",
//                         accessor: "pickupLocation.location",
//                         value: premium
//                     }
//                 ]
//             ),
//             makeRule(
//                 3,
//                 {
//                     all: [
//                         {
//                             accessor: "dropoffLocation.location",
//                             operator: "__streq__",
//                             value: economy
//                         },
//                         {
//                             accessor: "product",
//                             operator: "__streq__",
//                             value: "PREMIUM"
//                         }
//                     ]
//                 },
//                 [
//                     {
//                         do: "__setvalue__",
//                         accessor: "dropoffLocation.location",
//                         value: premium
//                     }
//                 ]
//             )
//         );
//     });
//     const promises: Promise<Rule>[] = [];
//     rules.forEach((rule) => {
//         promises.push(Models.rule.create(rule));
//     });
//     await Promise.all(promises).then((res) => console.log("res", res)).then((e) => console.log("e", e));
// }

// main();
