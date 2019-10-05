import {model, Schema} from "mongoose";

const countrySchema = new Schema({
    title: String
});

export default model("country", countrySchema, "country");