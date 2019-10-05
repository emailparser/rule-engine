export default class ConfigValidator{
    public static instructions(): any{
        return [
            {
                title: "Regex Pattern",
                method: "PATTERN",
                parameters: {
                    pattern: {
                        instruction: "A regex pattern in a string (can be an regular string)",
                        required: true
                    },
                    index: {
                        required: false,
                        instruction: "If there are many matches and the match type is a string, you can specify which match with 0 based index"
                    }
                }
            },
            {
                title: "String between",
                method: "STRING_BETWEEN",
                parameters: {
                    before: {
                        instruction: "A string or regex pattern that is at the end (not inclusive) of string",
                        required: true
                    },
                    after: {
                        instruction: "A string or regex pattern that is at the end (not inclusive) of string",
                        required: true
                    },
                    index: {
                        required: false,
                        instruction: "If there are many matches and the match type is a string, you can specify which match with 0 based index"
                    }
                }
            },
            {
                title: "String after",
                method: "STRING_AFTER",
                parameters: {
                    after: {
                        instruction: "A string or regex pattern that is at the beginning (not inclusive) of string",
                        required: true
                    }
                }
            },
            {
                title: "String before",
                method: "STRING_BEFORE",
                parameters: {
                    before: {
                        instruction: "A string or regex pattern that is at the end (not inclusive) of string",
                        required: true
                    }
                }
            },
            {
                title: "split by",
                method: "SPLIT_BY",
                parameters: {
                    splitter: {
                        instruction: "A string or regex pattern",
                        required: true
                    },
                    index: {
                        required: false,
                        instruction: "If there are many matches and the match type is a string, you can specify which match with 0 based index"
                    }
                }
            },
        ];
    }

    public static types(): any{
        return [
            {
                title: "String",
                retrieveType: "string",
                requiresParameters: true,
                requiresInsruction: true
            },
            {
                title: "Boolean",
                retrieveType: "bool",
                requiresParameters: true,
                requiresInsruction: true
            },
            {
                title: "Object",
                retrieveType: "object",
                requiresParameters: false,
                requiresInsruction: false
            },

            {
                title: "List",
                retrieveType: "array",
                requiresParameters: true,
                requiresInsruction: true
            }
        ];
    }

    public static retrieveTypes(): string[]{
        const retArr = [];
        const types = ConfigValidator.types();
        for(const type of types){
            retArr.push(type.retrieveType);
        }
        return retArr;
    }

    public static validateBlock(block: any): void{

        // checks if object
        if(!ConfigValidator.isObject(block))
            throw Error("Block is not an object");
        
        const requiredKeys = ["retrieveType"];
        let retrieveTypes;
        
        retrieveTypes = ConfigValidator
            .types();

        const retrieveTypesRequeringInstruction = retrieveTypes
            .filter((a: any) => a.requiresInsruction)
            .map((a: any) => a.retrieveType);
        
        retrieveTypes = retrieveTypes
            .map((a: any) => a.retrieveType);

        // validates rrequired keys
        for(const key of requiredKeys){
            if(!block[key]) throw Error(`${key} must exist on block`);
        }
    
        // checks if instruction is valid
        if(!retrieveTypes.includes(block.retrieveType))
            throw Error(`${block.retrieveType} is not a valid retrieveType`);

        // validates if proper instructions are given
        if(retrieveTypesRequeringInstruction.includes(block.retrieveType) && !block.instruction){
            throw Error(`${block.retrieveType} must have instruction`);
        }

        if(block.instruction){

            if(!block.parameters)
                throw Error("Parameters are missing");
            const params = ConfigValidator.getParametersFor(block.instruction);

            for(const key in params){
                if(params[key].required && !block.parameters[key]){
                    throw Error(`${key} must be in params if ${block.instruction} is selected`);
                }
            }
        }
    }

    public static validateConfig(config: any){
        ConfigValidator.validateBlock(config);
        if(config.sub){
            switch(config.retrieveType){
                case "bool":
                    if(!ConfigValidator.isArray(config.sub))
                        throw Error("Sub must be an array lengh 2 if retrieveType is boolean");
                    ConfigValidator.validateBlock(config.sub[0]);
                    ConfigValidator.validateBlock(config.sub[1]);
                case "object":
                    if(!ConfigValidator.isObject(config.sub))
                        throw Error("Sub must be an object if retrieveType is object");
                    for(var key in config.sub){
                        ConfigValidator.validateBlock(config.sub[key]);
                    }
                default:
                    ConfigValidator.validateBlock(config.sub);
            }
        }
    }

    public static isObject(a: any): boolean {
        return (!!a) && (a.constructor === Object);
    };

    public static isArray(a: any): boolean{
        return Array.isArray(a);
    }


    public static getParametersFor(key: string): any {
        const instructions = ConfigValidator.instructions();
        for(const instruction of instructions){
            if(instruction.method === key) return instruction.parameters;

        }
        throw Error(`${key} is not a valid instruction`);
    }

    public static getAllowedInstructions(): string[]{
        const retArr = [];
        const instructions = ConfigValidator.instructions();
        for(const instruction of instructions){
            retArr.push(instruction.method);
        }
        return retArr;
    }

    // public static getParametersForInstruction
}