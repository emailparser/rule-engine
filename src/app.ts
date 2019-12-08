import express, {Request, Response} from "express";
import compression from "compression"; 
import bodyParser from "body-parser";
import mongoose from "mongoose";
import { MONGODB_URI } from "./util/secrets";
import * as Services from "./services";
import * as Models from "./models";
import * as middleware from "./middleware";
import Axios from "axios";
import {Ruleable} from "./models/rule";
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
    res.send("<h1>Rule engine</h1>");
});

// get operatrs
app.get("/operators", (req, res) => {
    res.send(Services.RuleEngine.getOperators());
});

app.get("/hooks", (req, res) => {
    res.send(Services.RuleEngine.getLifeCycleHooks());
});


app.get("/actions", (req, res) => {
    res.send(Services.RuleEngine.getActions());
});

app.post("/rule", async (req, res) => {
    try {
        const doc = await Models.rule.create(req.body);
        res.send(doc);
    } catch(e) {
        res.status(400).send({
            message: "Error creating new rule"
        });
    }
});

app.post("/rule/:hook", middleware.validateHooks, async (req: Request, res: Response) => {
    try {
        const doc = await Models.rule.create({
            ...req.body,
            hook: req.params.hook
        });
        res.send(doc);
    } catch (e) {
        res.status(400).send(e);
    }
});

app.post("/rule/:hook/parseddata/:pid", middleware.validateHooks, async (req: Request, res: Response) => {


    console.log(`Parsed data ${req.params.pid} is being edited according to rules`);

    const {pid, hook} = req.params;
    try {
        const {data, client} = await Models.parsedData.findById(pid);
        const rules = await Models.rule.find({ client: client, hook: hook });
        const parsed = JSON.parse(data);
        Services.RuleEnforcer.reviewMany(rules, parsed, client, parsed.bookingRef);
        const updated = await Models.parsedData.findByIdAndUpdate(pid, {
            $set: {data: JSON.stringify(parsed)},
        }, {
            new: true
        });
        res.send(updated);
    } catch (e) {
        console.log("e", e);
        res.status(400).send(e);
    }
});;

app.post("/rule/oncreate/email/:eid",  async (req: Request, res: Response) => {
    
    console.log(`Email ${req.params.eid} is being edited according to rules`);

    const {eid} = req.params;
    try {
        const email = await Models.email.findById(eid).lean();
        const clientEmail = await Models.clientEmail.findOne({email: email.to}).lean();
        console.log("clientEmail", clientEmail);
        const rules = await Models.rule.find({client: clientEmail.client, hook: "oncreate"});
        console.log("rules", rules);
        Services.RuleEnforcer.reviewMany(rules, email, clientEmail.client, null);
        console.log("email", email);
        const updated = await Models.email.findByIdAndUpdate(eid, {
            $set: {...email},
        }, {
            new: true
        });
        res.send(updated);
    } catch (e) {
        console.log("e", e);
        res.status(400).send(e);
    }
});;


// get lifecycles

// apply rules


export default app;
