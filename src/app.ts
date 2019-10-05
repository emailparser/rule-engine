import express from "express";
import compression from "compression"; 
import bodyParser from "body-parser";
import mongoose from "mongoose";
import { MONGODB_URI } from "./util/secrets";
// eslint-disable-next-line @typescript-eslint/no-var-requires
const routes = require("./routes");


// Create Express server
const app = express();

mongoose
    .connect(MONGODB_URI, { useNewUrlParser: true, useCreateIndex: true })
    .then(() => {
        // console.log("Connected to MongoDB");
    })
    .catch((err) => {
        // console.log("MongoDB connection error. Please make sure MongoDB is running. " + err);
    });


// Express configuration
app.set("port", process.env.PORT || 3000);
app.use(compression());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use("/parse/", routes.parser);
app.use("/instructions/", routes.instructions);
app.use("/retrieve_types/", routes.retrieveTypes);
app.use("/validate/", routes.validateJson);



export default app;
