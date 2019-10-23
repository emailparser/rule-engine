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

app.get("/bookingtest", async  (req: Request, res: Response) => {
    try {
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

        return res.send(200);
        // data.dateTo = new Date(data.dateTo);
        // data.dateFrom = new Date(data.dateFrom);
        // const ref = await caren.book(data);
        // res.send({ref});
    } catch(e) {
        res.status(400).send(e);
    }
});

app.get("/avails/:tid/:cid", async  (req: Request, res: Response) => {
    const {tid, cid} = req.params;
    try {
        const d = new Date();
        d.setMonth(10);
        const apiConfig = await Models.clientapiconfig.findOne({client: cid});
        if(!apiConfig) throw Error("apiConfig not found");
        const bokun = new Services.Bokun(apiConfig.apiConnectionInfo);
        bokun.setClientId(cid);
        const data = await bokun.getStartTimeId("26577", d);
        res.send({id: data});
    } catch(e) {
        console.log("e", e);
        res.status(400).send(e);
    }
});

app.get("/paxTypes/:id/:cid", async (req: Request, res: Response) => {
    const {key, cid} = req.params;

    try {
        const apiConfig = await Models.clientapiconfig.findOne({client: cid});
        if(!apiConfig) throw Error("apiConfig not found");
        const bokun = new Services.Bokun(apiConfig.apiConnectionInfo);
        bokun.setClientId(cid);
        bokun.setTransaction("5da49417d938fb003b8a3588");
        const data = await bokun._getPaxTypes(req.params.id);
        res.send(data);
    } catch(e) {
        res.status(400).send({
            message: e.message
        });
    }
});

app.post("/pre/transform", (req: Request, res: Response) => {
    res.status(400).send({message: "not needed"});
});

app.post("/post/transform", (req: Request, res: Response) => {
    res.status(400).send({message: "not needed"});
});


// app.get("/t/:id/:cid", async (req: Request, res: Response) => {
//     const {id, cid} = req.params;

//     try {
//         const apiConfig = await Models.clientapiconfig.findOne({client: cid});
//         if(!apiConfig) throw Error("apiConfig not found");
//         const bokun = new Services.Bokun(apiConfig.apiConnectionInfo);
//         bokun.setClientId(cid);
//         bokun.setTransaction("5da49417d938fb003b8a3588");
//         // @ts-ignore
//         bokun.setData({
//             pax: [
//                 {paxType: "CHILD", paxCount: "2"},
//                 {paxType: "UNCLE", paxCount: "6"},
//                 {paxType: "ADULT", paxCount: "4"}
//             ],
//             activity: id
//         });

//         await bokun.transformPaxTypes();
//         res.send(bokun.getData());
//     } catch(e) {
//         res.status(400).send({
//             message: e.message
//         });
//     }
// });






export default app;
