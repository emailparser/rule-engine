import {client} from "../../src/models";
import mongoose from "mongoose";
import { MONGODB_URI } from "../../src/util/secrets";


beforeAll(async () => {
    await mongoose
        .connect(MONGODB_URI, { useNewUrlParser: true, useCreateIndex: true });
});

describe("Getting data from server", () => {
    it("Should get preexisting from Id", async (done) => {
        const found = await client.findById("5d94e0894ee7dc41f8e22237");
        expect(found).toHaveProperty("_id");
        done();
    });
});