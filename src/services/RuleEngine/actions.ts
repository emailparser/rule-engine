type ActionType =
    "__setvalue__" |
    "__raiserr__" |
    "__sendparsemessage__" |
    "__sethour__" |
    "__setminute__";
        

type DataType = "string" | "any" | "accessor" | "date" | "number";

interface AvailableActionParam{
    key: string;
    type: DataType;
    title: string;
    description: string;
}

interface AvailableAction{
    action: ActionType;
    title: string;
    parameters: AvailableActionParam[];
}

const actions: AvailableAction[] = [
    {
        title: "Set value of",
        action: "__setvalue__",
        parameters: [{
            key: "value",
            type: "string",
            title: "Value",
            description: "What should the new value equal?"
        },
        {
            key: "accessor",
            type: "accessor",
            title: "Pick field",
            description: "What field to you want to set?"
        }] 
    },
    {
        title: "Create an error (stop).",
        action: "__raiserr__",
        parameters: [{
            key: "message",
            type: "string",
            title: "Message",
            description: "Send message to yourself when this happens (optional)"
        }] 
    },
    {
        title: "Send parse message",
        action: "__sendparsemessage__",
        parameters: [{
            key: "value",
            type: "string",
            title: "message",
            description: "What message do you want to get when this happens?"
        }]
    },
    {
        title: "Change hours",
        action: "__sethour__",
        parameters: [{
            key: "value",
            type: "number",
            title: "hour",
            description: "What hour (0-23) do you want to set"
        },
        {
            key: "accessor",
            type: "accessor",
            title: "Date",
            description: "What date do you want to set?"
        }]
    },
    {
        title: "Change hours",
        action: "__setminute__",
        parameters: [{
            key: "value",
            type: "number",
            title: "Hour",
            description: "What minute (0-59) do you want to set"
        },
        {
            key: "accessor",
            type: "accessor",
            title: "Date",
            description: "What date do you want to set?"
        }]
    }
];

export default actions;