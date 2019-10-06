import {transformationKeywords} from "../../src/models";
import mongoose from "mongoose";
import { MONGODB_URI } from "../../src/util/secrets";


beforeAll(async () => {
    await mongoose
        .connect(MONGODB_URI, { useNewUrlParser: true, useCreateIndex: true });
});

describe("Getting data from server", () => {
    it("Should get preexisting from Id", async (done) => {
        const found = await transformationKeywords.findById("5d99f3eacfb2a6fa262c7a11");
        expect(found).toHaveProperty("_id");
        done();
    });
});