import {Parser} from "../../../src/services";
import {Types} from "mongoose";
const OID = Types.ObjectId("507f191e810c19729de860ea");

describe("String", () => {
    it("should return first instance if no index is provided", async (done) => {
        const recipe: any = {
            instruction: "STRING_BETWEEN",
            parameters: {
                after: "yolo",
                before: "he"
            }
        };  
        const txt = "kalli he yolo what he is going yolo on he";
        const parser = new Parser();
        const extract = await parser.intString(recipe, txt);
        expect(extract).toEqual("what");
        done();
    });

    it("should be able to specify index", async (done) => {
        const recipe: any = {
            instruction: "STRING_BETWEEN",
            parameters: {
                after: "yolo",
                before: "he",
                index: 1
            }
        };  
        const txt = "kalli he yolo what he is going yolo on he";
        const parser = new Parser();
        const extract = await parser.intString(recipe, txt);
        expect(extract).toEqual("on");
        done();
    });

    it("should be able to get sub as String", async (done) => {
        const recipe: any = {
            instruction: "STRING_BETWEEN",
            parameters: {
                after: "yolo",
                before: "he"
            },
            sub: {
                retrieveType: "string",
                instruction: "STRING_BETWEEN",
                parameters: {
                    after: "what",
                    before: "going"
                },
            }
        };  
        const txt = "kalli he yolo what is bla bla going he is going yolo on he";
        const parser = new Parser();
        const extract = await parser.intString(recipe, txt);
        expect(extract).toEqual("is bla bla");
        done();
    });
});


describe("Array", () => {

    it("Should return array instead of element", async (done) => {
        const recipe: any = {
            instruction: "SPLIT_BY",
            parameters: {
                splitter: "\r"
            }
        };  
        const txt = "stefan double room\r gunnar single room\r jon stefan ocean view";
        const parser = new Parser();
        const extract = await parser.intArray(recipe, txt);
        expect(extract).toEqual(["stefan double room", "gunnar single room", "jon stefan ocean view"]);
        done();
    });

    it("Should be able to call instruction on each element", async (done) => {
        const recipe: any = {
            instruction: "SPLIT_BY",
            parameters: {
                splitter: "\r"
            },
            sub: {
                retrieveType: "string",
                instruction: "STRING_BEFORE",
                parameters: {
                    before: "room",
                }
            }
        };  
        const txt = "stefan double room\r gunnar single room\r jon stefan ocean room view";
        const parser = new Parser();
        const extract = await parser.intArray(recipe, txt);
        expect(extract).toEqual(["stefan double", "gunnar single", "jon stefan ocean"]);
        done();
    });
});


describe("Array", () => {

    it("Should return array instead of element", async (done) => {
        const recipe: any = {
            instruction: "SPLIT_BY",
            parameters: {
                splitter: "\r"
            }
        };  
        const txt = "stefan double room\r gunnar single room\r jon stefan ocean view";
        const parser = new Parser();
        const extract = await parser.intArray(recipe, txt);
        expect(extract).toEqual(["stefan double room", "gunnar single room", "jon stefan ocean view"]);
        done();
    });

    it("Should be able to call instruction on each element", async (done) => {
        const recipe: any = {
            sub: {
                guest: {
                    retrieveType: "string",
                    instruction: "STRING_BETWEEN",
                    parameters: {
                        after: "guest:",
                        before: "room",
                    }
                },
                roomType: {
                    retrieveType: "string",
                    instruction: "STRING_BETWEEN",
                    parameters: {
                        after: "room-type:",
                        before: "arrival",
                    }
                }
            }
        };  
        const txt = "guest: Stefán jón Jónsson room-type: double deluxe arrival";
        const parser = new Parser();
        const extract = await parser.intObject(recipe, txt);
        expect(extract).toEqual({
            guest: "Stefán jón Jónsson",
            roomType: "double deluxe"
        });
        done();
    });
});

describe("Recursive string -> string -> array -> object", () => {
    const recipe: any = {
        instruction: "STRING_BETWEEN",
        parameters: {
            after: "begiinning",
            before: "end",
        },
        sub: {
            retrieveType: "array",
            instruction: "SPLIT_BY",
            parameters: {
                splitter: "\r"
            },
            sub: {
                retrieveType: "object",
                sub: {
                    guest: {
                        retrieveType: "string",
                        instruction: "STRING_BETWEEN",
                        parameters: {
                            after: "guest:",
                            before: "room-type",
                        },
                    },
                    roomType: {
                        retrieveType: "string",
                        instruction: "STRING_AFTER",
                        parameters: {
                            after: "room-type:"
                        }
                    }
                }
            }
        },   
    };  
    it("should parse data correrctly", async (next) => {
        const txt = " some begiinning guest: Stefán jón Jónsson room-type: double deluxe \r guest: Kalr Sveinn Ríkharðsson room-type: ocean view \r guest: Jón haraldur stefánsson room-type: double deluxe \r end";
        const parser = new Parser();
        const extract = await parser.intString(recipe, txt);
        expect(extract).toEqual([{"guest": "Stefán jón Jónsson", "roomType": "double deluxe"}, {"guest": "Kalr Sveinn Ríkharðsson", "roomType": "ocean view"}, {"guest": "Jón haraldur stefánsson", "roomType": "double deluxe"}]);
        next();
    }); 
});

describe("Boolean retrieveType", () => {
    it("returns true if retrieve type is bool" , async (done) => {
        const recipe: any = {
            instruction: "PATTERN",
            retrieveType: "bool",
            parameters: {
                pattern: "yolo"
            }
        };  
        const txt = "kalli he yolo what he is going yolo on he";
        const parser = new Parser();
        const extract = await parser.intBoolean(recipe, txt);
        expect(extract).toEqual(true);
        done();
    });

    it("returns false if retrieve type is bool" , async (done) => {
        const recipe: any = {
            instruction: "PATTERN",
            retrieveType: "bool",
            parameters: {
                pattern: "yolo"
            }
        };  
        const txt = "some text that does not match";
        const parser = new Parser();
        const extract = await parser.intBoolean(recipe, txt);
        expect(extract).toEqual(false);
        done();
    });

    it("throws error if sub is not array", async (done) => {
        const recipe: any = {
            instruction: "PATTERN",
            retrieveType: "bool",
            parameters: {
                pattern: "yolo"
            },
            sub: {}
        };  
        const txt = "some text that does not match";
        const parser = new Parser();
        async function check(){
            try {
                await parser.intBoolean(recipe, txt);
            } catch (e){
                throw Error("test");
            }
        }
        await expect(check()).rejects.toThrow(Error);
        done();
    });

    it("throws error if sub array is shorter than 2",  async (done) => {
        const recipe: any = {
            instruction: "PATTERN",
            retrieveType: "bool",
            parameters: {
                pattern: "yolo"
            },
            sub: []
        };  
        const txt = "some text that does not match";
        const parser = new Parser();
        async function check(){
            try {
                await parser.intBoolean(recipe, txt);
            } catch (e){
                throw Error("test");
            }
        }
        await expect(check()).rejects.toThrow(Error);
        done();
        
    });

    it("throws error if sub array is longer than 2", async (done) => {
        const recipe: any = {
            instruction: "PATTERN",
            retrieveType: "bool",
            parameters: {
                pattern: "yolo"
            },
            sub: [
                {
                    instruction: "PATTERN",
                    retrieveType: "bool",
                    parameters: {
                        pattern: "yolo"
                    }
                },
                {
                    instruction: "PATTERN",
                    retrieveType: "bool",
                    parameters: {
                        pattern: "yolo"
                    }
                },
                {
                    instruction: "PATTERN",
                    retrieveType: "bool",
                    parameters: {
                        pattern: "yolo"
                    }
                },
            ]
        };  
        const txt = "some text that does not match";
        const parser = new Parser();
        async function check(){
            try {
                await parser.intBoolean(recipe, txt);
            } catch (e){
                throw Error("test");
            }
        }
        await expect(check()).rejects.toThrow(Error);
        done();
        
    });

    it("should do sub[1] if true", async (done) => {
        const recipe: any = {
            instruction: "PATTERN",
            retrieveType: "bool",
            parameters: {
                pattern: "some"
            },
            sub: [
                {
                    instruction: "PATTERN",
                    retrieveType: "string",
                    parameters: {
                        pattern: "text"
                    }
                },
                {
                    instruction: "PATTERN",
                    retrieveType: "string",
                    parameters: {
                        pattern: "that"
                    }
                }
            ]
        };  
        const txt = "some text that does not match";
        const parser = new Parser();
        const extract = await parser.intBoolean(recipe, txt);
        expect(extract).toEqual("that");
        done();
    });
    const txt = "some text that does not match";

    it("should do sub[0] if false", async (done) => {
        const recipe: any = {
            instruction: "PATTERN",
            retrieveType: "bool",
            parameters: {
                pattern: "scoopidy shoop"
            },
            sub: [
                {
                    instruction: "PATTERN",
                    retrieveType: "string",
                    parameters: {
                        pattern: "text"
                    }
                },
                {
                    instruction: "PATTERN",
                    retrieveType: "string",
                    parameters: {
                        pattern: "that"
                    }
                }
            ]
        };  
        const txt = "some text that does not match";
        const parser = new Parser();
        const extract = await parser.intBoolean(recipe, txt);
        expect(extract).toEqual("text");
        done();
    });
});