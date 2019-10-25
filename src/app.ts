import express, {Request, Response} from "express";
import compression from "compression"; 
import bodyParser from "body-parser";
import mongoose from "mongoose";
import { MONGODB_URI } from "./util/secrets";
import * as Services from "./services";
import * as Models from "./models";
import Axios from "axios";
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
    res.send("<h1>Bokun.is service</h1>");
});
    
app.get("/transformations/:key/:cid", async (req: Request, res: Response) => {
    const {key, cid} = req.params;

    try {
        const apiConfig = await Models.clientapiconfig.findOne({client: cid});
        if(!apiConfig) throw Error("apiConfig not found");
        const bokun = new Services.Bokun(apiConfig.apiConnectionInfo);
        bokun.setClientId(cid);
        const data = await bokun.getTransformationsFor(key);
        res.send(data);
    } catch(e) {
        res.status(400).send({
            message: e.message
        });
    }
});

app.post("/test_booking/:cid", async (req: Request, res: Response) => {
    const {cid} = req.params;

    try {
        const apiConfig = await Models.clientapiconfig.findOne({client: cid});
        const bokun = new Services.Bokun(apiConfig.apiConnectionInfo);
        bokun.setClientId(cid);
        req.body.fromDate.startTime = new Date(req.body.fromDate.startTime);
        await bokun.book(req.body);
        res.send({ref: 1});
    } catch(e) {
        console.log("e", e);
        res.send(500);
    }
});

app.get("/bookingtest", async  (req: Request, res: Response) => {
    try {
        return;
        const bokun = new Services.Bokun({
            accessKey: "359d0d6169484192b7d50c35053cbfc0",
            secretKey: "6347136c95c14a899449d6aa9beb691d",
            vendorId: "658",
            defaultCurrency: "ISK",
            defaultLang: "EN"
        });
        const x = await bokun.testMakeBooking();
        res.send(x);
    } catch(e) {
        res.status(400).send(e);
    }
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

        // const apiConfig = await Models.clientapiconfig.findOne({client: transaction.client});
        // const caren = new Services.Caren(apiConfig.apiConnectionInfo);

        const data = JSON.parse(transaction.parseddata.data);
        console.log("data", data);

        res.send({ref: Math.floor(Math.random() * 100001)});

        

        // return res.send(200);
        // // data.dateTo = new Date(data.dateTo);
        // // data.dateFrom = new Date(data.dateFrom);
        // // const ref = await caren.book(data);
        // res.send({ref});
    } catch(e) {
        res.status(400).send(e);
    }
});


app.post("/post/transform/:cid", async (req: Request, res: Response) => {
    const {cid} = req.params;

    try {
        const apiConfig = await Models.clientapiconfig.findOne({client: cid});
        if(!apiConfig) throw Error("apiConfig not found");
        const bokun = new Services.Bokun(apiConfig.apiConnectionInfo);
        bokun.setClientId(cid);
        await bokun.postTransform(req.body);
        res.send(req.body);
    } catch(e) {
        console.log("e", e);
        res.status(400).send({
            message: e.message
        });
    }

});

app.post("/pre/transform/:cid", (req: Request, res: Response) => {
    res.status(400).send({message: "not needed"});
});



export default app;
