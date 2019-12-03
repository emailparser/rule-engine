// import rule, { Rule, Condition, Action } from "./";
// import * as Models from "../";
// const ruleBase: Rule = {
//     client: "5ddd5b0674e1a5004ca99c54",
//     condition: {
//         all: []
//     },
//     hook: "beforesend",
//     actions: []
// };

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

// const rules: Rule[] = [
//     /**
// 	 *
// 	 * PREMIUM
// 	 */
//     makeRule(
//         1,
//         {
//             all: [
//                 {
//                     accessor: "pickupLocation.location",
//                     operator: "__streq__",
//                     value: "42229"
//                 },
//                 {
//                     accessor: "activity",
//                     operator: "__streq__",
//                     value: "PREMIUM"
//                 }
//             ]
//         },
//         [
//             {
//                 do: "__setvalue__",
//                 accessor: "activity",
//                 value: "9217"
//             },
//             {
//                 do: "__setvalue__",
//                 accessor: "product",
//                 value: "PREMIUM"
//             }
//         ]
//     ),
//     makeRule(
//         1,
//         {
//             all: [
//                 {
//                     accessor: "dropoffLocation.location",
//                     operator: "__streq__",
//                     value: "42229"
//                 },
//                 {
//                     accessor: "activity",
//                     operator: "__streq__",
//                     value: "PREMIUM"
//                 }
//             ]
//         },
//         [
//             {
//                 do: "__setvalue__",
//                 accessor: "activity",
//                 value: "9652"
//             },
//             {
//                 do: "__setvalue__",
//                 accessor: "product",
//                 value: "PREMIUM"
//             }
//         ]
//     ),

//     /**
// 	 *
// 	 * ECONOMY
// 	 */

//     // pickup Kef, dropoff Terminaal (AD2)
//     makeRule(
//         1,
//         {
//             all: [
//                 {
//                     accessor: "pickupLocation.location",
//                     operator: "__streq__",
//                     value: "42229"
//                 },
//                 {
//                     accessor: "activity",
//                     operator: "__streq__",
//                     value: "ECONOMY"
//                 },
//                 {
//                     accessor: "dropoffLocation.location",
//                     operator: "__streq__",
//                     value: "42080"
//                 }
//             ]
//         },
//         [
//             {
//                 do: "__setvalue__",
//                 accessor: "activity",
//                 value: "22141"
//             },
//             {
//                 do: "__setvalue__",
//                 accessor: "product",
//                 value: "ECONOMY"
//             }
//         ]
//     ),
//     // pickup Terminal, dropoff Kef (AD1)
//     makeRule(
//         1,
//         {
//             all: [
//                 {
//                     accessor: "dropoffLocation.location",
//                     operator: "__streq__",
//                     value: "42229"
//                 },
//                 {
//                     accessor: "activity",
//                     operator: "__streq__",
//                     value: "ECONOMY"
//                 },
//                 {
//                     accessor: "pickupLocation.location",
//                     operator: "__streq__",
//                     value: "42080"
//                 }
//             ]
//         },
//         [
//             {
//                 do: "__setvalue__",
//                 accessor: "activity",
//                 value: "22112"
//             },
//             {
//                 do: "__setvalue__",
//                 accessor: "product",
//                 value: "ECONOMY"
//             }
//         ]
//     ),
//     // pickup kef, dropoff EKKI terminal, EKKI tómt (AD2+)
//     makeRule(
//         1,
//         {
//             all: [
//                 {
//                     // pickup er í keflavík
//                     accessor: "pickupLocation.location",
//                     operator: "__streq__",
//                     value: "42229"
//                 },
//                 {
//                     // activty er econoomy
//                     accessor: "activity",
//                     operator: "__streq__",
//                     value: "ECONOMY"
//                 },
//                 {
//                     // dropoff er EKKI terminal
//                     accessor: "dropoffLocation.location",
//                     operator: "__strneq__",
//                     value: "42080"
//                 },
//                 {
//                     // dropoff er EKKI tómt
//                     accessor: "dropoffLocation.location",
//                     operator: "__valnotnull__",
//                     value: ""
//                 }
//             ]
//         },
//         [
//             {
//                 do: "__setvalue__",
//                 accessor: "activity",
//                 value: "22257"
//             },
//             {
//                 do: "__setvalue__",
//                 accessor: "product",
//                 value: "ECONOMY"
//             }
//         ]
//     ),
//     // dropoff kef, pickup EKKI terminal, EKKI tómt (AD1+)
//     makeRule(
//         1,
//         {
//             all: [
//                 {
//                     // dropooff er í keflavík
//                     accessor: "dropoffLocation.location",
//                     operator: "__streq__",
//                     value: "42229"
//                 },
//                 {
//                     // activty er econoomy
//                     accessor: "activity",
//                     operator: "__streq__",
//                     value: "ECONOMY"
//                 },
//                 {
//                     // pickup er EKKI terminal
//                     accessor: "pickupLocation.location",
//                     operator: "__strneq__",
//                     value: "42080"
//                 },
//                 {
//                     // pickup er EKKI tómt
//                     accessor: "pickupLocation.location",
//                     operator: "__valnotnull__",
//                     value: ""
//                 }
//             ]
//         },
//         [
//             {
//                 do: "__setvalue__",
//                 accessor: "activity",
//                 value: "22246"
//             },
//             {
//                 do: "__setvalue__",
//                 accessor: "product",
//                 value: "ECONOMY"
//             }
//         ]
//     ),

//     // pickup kef, dropoff er tómt
//     makeRule(
//         1,
//         {
//             all: [
//                 {
//                     // pickup er í keflavík
//                     accessor: "pickupLocation.location",
//                     operator: "__streq__",
//                     value: "42229"
//                 },
//                 {
//                     // activty er econoomy
//                     accessor: "activity",
//                     operator: "__streq__",
//                     value: "ECONOMY"
//                 },
//                 {
//                     // dropoff er tómt
//                     accessor: "dropoffLocation.location",
//                     operator: "__valnisnull__",
//                     value: ""
//                 }
//             ]
//         },
//         [
//             {
//                 do: "__setvalue__",
//                 accessor: "activity",
//                 value: "22257"
//             },
//             {
//                 do: "__setvalue__",
//                 accessor: "product",
//                 value: "ECONOMY"
//             },
//             {
//                 do: "__setvalue__",
//                 accessor: "dropoffLocation.location",
//                 value: "677541"
//             },
//             {
//                 do: "__sendparsemessage__",
//                 value:
// 					"Dropoff location unknown, please check if this booking should include dropoff (we registered as 'with hotel connection'), also check if we missed the correct location when reading the email"
//             }
//         ]
//     ),

//     // dropoff kef, pickup er tómt
//     makeRule(
//         1,
//         {
//             all: [
//                 {
//                     // pickup er í keflavík
//                     accessor: "dropoffLocation.location",
//                     operator: "__streq__",
//                     value: "42229"
//                 },
//                 {
//                     // activty er econoomy
//                     accessor: "activity",
//                     operator: "__streq__",
//                     value: "ECONOMY"
//                 },
//                 {
//                     // dropoff er tómt
//                     accessor: "pickupLocation.location",
//                     operator: "__valnisnull__",
//                     value: ""
//                 }
//             ]
//         },
//         [
//             {
//                 do: "__setvalue__",
//                 accessor: "activity",
//                 value: "22246"
//             },
//             {
//                 do: "__setvalue__",
//                 accessor: "product",
//                 value: "ECONOMY"
//             },
//             {
//                 do: "__setvalue__",
//                 accessor: "pickupLocation.location",
//                 value: "677541"
//             },
//             {
//                 do: "__sendparsemessage__",
//                 value:
// 					"Pickup location unknown, please check if this booking should include pickup (we registered as 'with hotel connection'), also check if we missed the correct location when reading the email"
//             }
//         ]
//     ),
//     makeRule(
//         2,
//         {
//             all: [
//                 {
//                     accessor: "dropoffLocation.location",
//                     operator: "__streq__",
//                     value: "42229"
//                 },
//                 {
//                     accessor: "product",
//                     operator: "__streq__",
//                     value: "PREMIUM"
//                 },
//                 {
//                     accessor: "pickupLocation.location",
//                     operator: "__valnisnull__",
//                     value: ""
//                 }
//             ]
//         },
//         [
//             {
//                 do: "__setvalue__",
//                 accessor: "pickupLocation.location",
//                 value: "677541"
//             },
//             {
//                 do: "__sendparsemessage__",
//                 value:
// 					"Pickup location unknown, please check Check if we missed the correct location when reading the email"
//             }
//         ]
//     ),
//     makeRule(
//         2,
//         {
//             all: [
//                 {
//                     accessor: "pickupLocation.location",
//                     operator: "__streq__",
//                     value: "42229"
//                 },
//                 {
//                     accessor: "product",
//                     operator: "__streq__",
//                     value: "PREMIUM"
//                 },
//                 {
//                     accessor: "dropoffLocation.location",
//                     operator: "__valnisnull__",
//                     value: ""
//                 }
//             ]
//         },
//         [
//             {
//                 do: "__setvalue__",
//                 accessor: "dropoffLocation.location",
//                 value: "677541"
//             },
//             {
//                 do: "__sendparsemessage__",
//                 value:
// 					"Dropoff location unknown, please check Check if we missed the correct location when reading the email"
//             }
//         ]
//     )
// ];

// const prom: Promise<Rule>[] = [];
// rules.forEach((rule) => prom.push(Models.rule.create(rule)));
// Promise.all(prom)
//     .then((res) => console.log("res", res))
//     .catch((e) => console.log("e", e));
// console.log("rules", rules);

// export default rules;
