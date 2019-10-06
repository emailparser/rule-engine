import {formatConnection} from "../../src/models";
import mongoose from "mongoose";
import { MONGODB_URI } from "../../src/util/secrets";


beforeAll(async () => {
    await mongoose
        .connect(MONGODB_URI, { useNewUrlParser: true, useCreateIndex: true });
});

describe("Getting data from server", () => {
    it("Should get preexisting from Id", async (done) => {
        const found = await formatConnection.findById("5d99ed9d635de29f97928adc");
        expect(found).toHaveProperty("_id");
        done();
    });
});