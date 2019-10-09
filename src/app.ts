import express, {Request, Response} from "express";
import compression from "compression"; 
import bodyParser from "body-parser";
import mongoose from "mongoose";
import { MONGODB_URI } from "./util/secrets";
import * as Services from "./services";
import * as Models from "./models";
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
    res.send(";)");
});
    
app.post("/new_booking/:tid", async (req, res) => {
    try {
        const transaction = await Models.transaction.findById(req.params.tid);
        if(!transaction) throw Error("transaction not found");
        if(transaction.internalRef) throw Error("transaction has already been booked");

        // skrifa restina tli að sækja clientApiConfig
        // initialize-a caren, .book() og svo skila res.guid sem {ref}
    } catch(e) {
        res.status(400).send(e);
    }
});
export default app;
