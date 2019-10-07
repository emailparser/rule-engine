import mongoose from "mongoose";
import { MONGODB_URI } from "../../src/util/secrets";
import {BookingParser} from "../../src/services";

beforeAll(async () => {
    await mongoose
        .connect(MONGODB_URI, { useNewUrlParser: true, useCreateIndex: true });
});

describe("Receiving emailId", () => {
    it("Should throw an error with id of emailData with .status != 0", async (done) => {
        async function check(){
            try {
                await BookingParser.parse("5d9a0d6ca63b170028ca988c");
            } catch(e) {
                throw Error("test");
            }
        }
        await expect(check()).rejects.toThrow(Error);
        done();
    });

    it("Should throw an error with id of emailData that has parsedData", async (done) => {
        async function check(){
            try {
                await BookingParser.parse("5d9a16dc586f4b0028eebd47");
            } catch(e) {
                throw Error("test");
            }
        }
        await expect(check()).rejects.toThrow(Error);
        done();
    });

    // it("Should NOT throw an error with id of emailData that has no parsedData", async (done) => {
    //     async function check(){
    //         try {
    //             await BookingParser.parse("5d9a247305b1460029dd9668");
    //             return 4;
    //         } catch(e) {
    //             throw Error("test");
    //         }
    //     }
    //     await expect(check()).resolves.toEqual(4);
    //     done();
    // });
});

describe("Validating sender & receiver", () => {
    it("Should throw an error if no client Email matches to field", async (done) => {
        async function check(){
            try {
                await BookingParser.parse("5d9a0d6ca63b170028ca988c");
            } catch(e) {
                throw Error("test");
            }
        }
        await expect(check()).rejects.toThrow(Error);
        done();
    });
});
