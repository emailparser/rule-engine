type ActionType = 
    "__setvalue__" |
    "__raiserr__";

type DataType = "string" | "any" | "accessor";

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
    }
];

export default actions;