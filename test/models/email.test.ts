import {email} from "../../src/models";
import mongoose from "mongoose";
import { MONGODB_URI } from "../../src/util/secrets";


beforeAll(async () => {
    await mongoose
        .connect(MONGODB_URI, { useNewUrlParser: true, useCreateIndex: true });
});

describe("Getting data from server", () => {
    it("Should get preexisting from Id", async (done) => {
        const found = await email.findById("5d95e93ade22d5522b03154e");
        expect(found).toHaveProperty("_id");
        done();
    });
});