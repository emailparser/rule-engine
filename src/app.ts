import express, {Request, Response} from "express";
import compression from "compression"; 
import bodyParser from "body-parser";
import mongoose from "mongoose";
import { MONGODB_URI } from "./util/secrets";
import {BookingParser} from "./services";
// eslint-disable-next-line @typescript-eslint/no-var-requires
//import * as routes from "./routes";


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

app.get("/", (req: Request, res: Response) => {
    res.send("hello");
});

app.post("/parse/email_data/:id", async (req: Request, res: Response) => {
    try {
        const data = await BookingParser.parse(req.params.id);
        console.log(data);
        res.send("OK");
    } catch(e){
        console.log(e);
        res.status(419).send(e);
    }
});

//app.use("/country/", routes.country);

export default app;
