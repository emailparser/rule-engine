import express, {Request, Response} from "express";
import compression from "compression"; 
import bodyParser from "body-parser";
import mongoose from "mongoose";
import { MONGODB_URI } from "./util/secrets";
import {BookingParser, Transformer} from "./services";
import {keys} from "./models";
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
        res.send(req.body.data);
    } catch(e){
        console.log(e);
        res.status(419).send(e);
    }
});

// app.post("/parse/transform", (req: Request, res: Response) => {
//     try {
//         BookingParser.transform(req.body.data, (key: string, successHandler: any) => {
//             if(req.body.trigger === key){
//                 successHandler();
//             }
//         }, (value: any, setValue: any) => {
//             setValue(req.body.replacement);
//         });
//         res.send(req.body.data);
//     } catch(e){
//         console.log(e);
//         res.status(419).send(e);
//     }
// });

app.post("/transformer/:id", async (req: Request, res: Response) => {
    try {
        const transformer = new Transformer(req.params.id);
        await transformer.getTransfrmations();
        transformer.transform(req.body);
        res.send(req.body);
    } catch(e){
        console.log(e);
        res.status(419).send(e);
    }
});

app.post("/key", async (req: Request, res: Response) => {
    try {
        const key = new keys(req.body);
        key.type = "5d98b86cd6678100291c9a37";
        await key.save();
        res.send(key);
    } catch(e){
        console.log(e);
        res.status(419).send(e);
    }
});

//app.use("/country/", routes.country);
	
export default app;
