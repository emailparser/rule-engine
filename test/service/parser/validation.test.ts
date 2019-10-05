/* eslint-disable @typescript-eslint/no-var-requires */
const {ConfigValidator} = require("../../../src/services");

describe("Allowed instructions", () =>  {
    it("Should have five instructions", () => {
        expect(ConfigValidator.getAllowedInstructions().length).toEqual(5);
    });
    it("Should have PATTERN", () => {
        expect(ConfigValidator.getAllowedInstructions().includes("PATTERN")).toEqual(true);
    });
});

describe("Parameters for instructions", () => {

    
    it("Should throw error when non existent instruction is given", () => {
        try {
            ConfigValidator.getParametersFor("PAT TERN");
        } catch(e) {
            return expect(true).toEqual(true);
        }
        return expect(4).toEqual(5);
    });

    it("Should have correct parameters for PATTERN", () => {
        const params = ConfigValidator.getParametersFor("PATTERN");
        expect(params).toHaveProperty("pattern");
        expect(params.pattern).toHaveProperty("instruction");
        expect(params.pattern.required).toBeTruthy();
    });

    it("Should have correct parameters for STRING_BETWEEN", () => {
        const params = ConfigValidator.getParametersFor("STRING_BETWEEN");

        expect(params).toHaveProperty("after");
        expect(params).toHaveProperty("before");
        expect(params).toHaveProperty("index");

        expect(params.after).toHaveProperty("instruction");
        expect(params.after.required).toBeTruthy();

        expect(params.before).toHaveProperty("instruction");
        expect(params.before.required).toBeTruthy();

        expect(params.index).toHaveProperty("instruction");
        expect(params.index.required).toBeFalsy();
    });

    it("Should have correct parameters for STRING_AFTER", () => {
        const params = ConfigValidator.getParametersFor("STRING_AFTER");

        expect(params).toHaveProperty("after");

        expect(params.after).toHaveProperty("instruction");
        expect(params.after.required).toBeTruthy();
    });


    it("Should have correct parameters for STRING_BEFORE", () => {
        const params = ConfigValidator.getParametersFor("STRING_BEFORE");

        expect(params).toHaveProperty("before");

        expect(params.before).toHaveProperty("instruction");
        expect(params.before.required).toBeTruthy();
    });

});

describe("Validate block", () => {
    
    it("Should throw error if no retrieveType", () => {
        try {
            ConfigValidator.validateBlock({});
        } catch(e) {
            return expect(true).toEqual(true);
        }
        return expect(4).toEqual(5);
    });

    it("Should not throw error if validi retrieveType", () => {
        try {
            ConfigValidator.validateBlock({retrieveType: "string", instruction: "PATTERN", parameters: {pattern: "#"}});
            return expect(true).toEqual(true);
        } catch(e) {
            return expect(4).toEqual(5);
        }
    });
    
    it("Should throw error if invalid retrieveType", () => {
        try {
            ConfigValidator.validateBlock({retrieveType: "bitcoin"});
        } catch(e) {
            return expect(true).toEqual(true);
        }
        return expect(4).toEqual(5);
    });

    it("Should throw error if instruction is missing", () => {
        try {
            ConfigValidator.validateBlock({retrieveType: "string"});
        } catch(e) {
            return expect(true).toEqual(true);
        }
        return expect(4).toEqual(5);
    });

    it("Should throw error if correct instruction but a required param is missing", () => {
        try {
            ConfigValidator.validateBlock({retrieveType: "string", instruction: "PATTERN", parameters: {}});
        } catch(e) {
            return expect(true).toEqual(true);
        }
        return expect(4).toEqual(5);
    });
});

describe("Validate Sub", () => {
    
});