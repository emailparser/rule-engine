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
    res.send("<h1>Caren service</h1>");
});
    
app.post("/new_booking/:tid", async  (req: Request, res: Response) => {
    const {tid} = req.params;
    try {
        const transaction = await Models.transaction
            .findById(tid)
            .populate({
                path: "parseddata",
                model: "parseddata"
            });
        if(!transaction) throw Error("transaction not found");
        if(transaction.internalRef) throw Error("transaction has already been booked");

        const apiConfig = await Models.clientapiconfig.findOne({client: transaction.client});
        const caren = new Services.Caren(apiConfig.apiConnectionInfo);
        const datas: any[] = JSON.parse(transaction.parseddata.data);
        const refs = [];
        for(const data of datas){
            data.dateTo = new Date(data.dateTo);
            data.dateFrom = new Date(data.dateFrom);
            const ref = await caren.book(data);
            refs.push(ref);
        }
        res.send({refs});

    } catch(e) {
        console.log(e);
        res.status(400).send(e);
    }
});

app.get("/transformations/:key/:cid", async (req: Request, res: Response) => {
    const {key, cid} = req.params;

    try {
        const apiConfig = await Models.clientapiconfig.findOne({client: cid});
        if(!apiConfig) throw Error("apiConfig not found");
        const caren = new Services.Caren(apiConfig.apiConnectionInfo);
        caren.setClientId(cid);
        const data = await caren.getTransformationsFor(key);
        res.send(data);
    } catch(e) {
        res.status(400).send({
            message: e.message
        });
    }
});
export default app;
