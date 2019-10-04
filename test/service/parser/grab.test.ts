import {Parser} from "../../../src/services";
import {Types} from "mongoose";
const OID = Types.ObjectId("507f191e810c19729de860ea");

describe("String between", () => {
    it("should return array of string matches", async (done) => {
        const someParam: any =  {
            after: "yolo",
            before: "he"
        };
        const txt = "kalli he yolo what is going on he";
        const parser = new Parser({}, {agency: OID, hotel: OID});
        const extract = parser.stringBetween(txt, someParam);
        expect(extract).toStrictEqual(["what is going on"]);
        done();
    });
    it("should return array of string matches", async (done) => {
        const someParam: any =  {
            before: "he",
            after: "yolo"
        };
        const txt = "kalli he yolo what is going on he yolo spóló he";
        const parser = new Parser({}, {agency: OID, hotel: OID});
        const extract = parser.stringBetween(txt, someParam);
        expect(extract).toStrictEqual(["what is going on", "spóló"]);
        done();
    });
});


describe("String before", () => {
    it("should return array of string matches", async (done) => {
        const someParam: any =  {
            before: "ekki",
        };
        const txt = "koddaver fjarstyring ekki lampi";
        const parser = new Parser({}, {agency: OID, hotel: OID});
        const extract = parser.stringBefore(txt, someParam);
        expect(extract).toStrictEqual(["koddaver fjarstyring"]);
        done();
    });
    it("should match multiple", async (done) => {
        const someParam: any =  {
            before: "ekki",
        };
        const txt = "koddaver fjarstyring ekki lampi ekki";
        const parser = new Parser({}, {agency: OID, hotel: OID});
        const extract = parser.stringBefore(txt, someParam);
        expect(extract).toStrictEqual(["koddaver fjarstyring"]);
        done();
    });
});


describe("Split by", () => {
    it("should return array of string matches", async (done) => {
        const someParam: any =  {
            splitter: "\r"
        };
        const txt = "stefan double room\r gunnar single room\r jon stefan ocean view";
        const parser = new Parser({}, {agency: OID, hotel: OID});
        const extract = parser.splitBy(txt, someParam);
        expect(extract).toStrictEqual(["stefan double room", "gunnar single room", "jon stefan ocean view"]);
        done();
    });
});


describe("Split after", () => {
    it("should return array of string matches", async (done) => {
        const someParam: any =  {
            after: "type:"
        };
        const txt = "Stefán jón Jónsson room-type: double deluxe";
        const parser = new Parser({}, {agency: OID, hotel: OID});
        const extract = parser.stringAfter(txt, someParam);
        expect(extract).toStrictEqual(["double deluxe"]);
        done();
    });
});


// parseconfig stór JSOON 
parseConfig: {
    date: {

    }, 
    rooms: {

    }
}

// agencyFields

// SPLIT_BY, STRING_BETWEEN, REGE_MATC .. 6 METHODS
// HVERT method krefst ákveðinna parametra
// t.d. STRING_BETWEEN þarf "before", "after"

// þarf að velja return type

// það á aðvera hægt að gera "sub recipes"

{
    agency: Objectid,
    key: "rooms",
    recipe: {}
}

{
    agency: Objectid,
    key: "name",
    recipe: {}
}

{
    agency: Objectid,
    key: "name",
    recipe: {}
}

AgencyFields.find({agency: _id})