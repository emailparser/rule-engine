import {clientEmail} from "../../src/models";
import mongoose from "mongoose";
import { MONGODB_URI } from "../../src/util/secrets";

// clientEmail

beforeAll(async () => {
    await mongoose
        .connect(MONGODB_URI, { useNewUrlParser: true, useCreateIndex: true });
});

describe("Getting data from server", () => {
    it("Should get preexisting from Id", async (done) => {
        const found = await clientEmail.findById("5d9a228205b1460029dd9667");
        expect(found).toHaveProperty("_id");
        done();
    });
});