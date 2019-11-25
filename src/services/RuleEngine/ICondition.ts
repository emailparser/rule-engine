/* eslint-disable @typescript-eslint/interface-name-prefix */
type Operator = (
    "__strin__" |
    "__streq__"
)

export interface ICondition{
    accessor: string;
    operator: Operator;
    value: any;
}