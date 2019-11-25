import {Rule} from "./IOperators";

const rules: {[key: string]: Rule} = {
    /**
     * String 
     */
    __strin__: {
        title: "includes",
        description: "Does the text include the following",
        dataType: "string"
    },
    __streq__: {
        title: "equals",
        description: "Does the text equal the following",
        dataType: "string"
    },
    __strne__: {
        title: "doesn't equal",
        description: "Does the text NOT equal the following",
        dataType: "string"
    },
    __strni__: {
        title: "doesn't include",
        description: "Does the text NOT include the following",
        dataType: "string"
    },

    /**
     * Array
     */
    __arrin__: {
        title: "includes the following",
        description: "Does the list include the following value",
        dataType: "array"
    },

    /**
     * Number
     */
    __numeq__: {
        title: "equals",
        description: "Does the amount equal the following value",
        dataType: "number"
    },
    __numne__: {
        title: "doesn't equals",
        description: "Does the amount NOT equal the following value",
        dataType: "number"
    },
    __numgt__: {
        title: "greater than",
        description: "Is the amount greater than the following",
        dataType: "number"
    },
    __numge__: {
        title: "greater than or equal",
        description: "Is the amount greater than or equal",
        dataType: "number"
    },
    __numt__: {
        title: "less than",
        description: "Is the amount less than than the following",
        dataType: "number"
    },
    __numle__: {
        title: "less than than or equal",
        description: "Is the amount than than than or equal",
        dataType: "number"
    }
};

export default rules;