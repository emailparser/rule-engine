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
    res.send("<h1>Roomer.is service</h1>");
});
    
// app.get("/test", async (req: Request, res: Response) => {
//     try {
//         const roomer = new Services.Roomer({
//             hotelKey: "c8019a96",
//             applicationKey: "EMAILPARSER",
//             secret: "M2NjNzBhY2IzMzVjNzczOWQyYTcyODJkNjJhMTNkZTNmZjI4ZmRjZjRlYTRkYWZiMGQ3NjY0M2QwNjRiMzEzNw=="
//         });
//         const data = await roomer.getAvailability();
//         res.send(data);
    
//     } catch(e) {
//         console.log("e", e.response.data);
//         res.send(e.response.data);
//     } 
// });

// app.get("/test-book", async (req: Request, res: Response) => {
//     try {
//         const roomer = new Services.Roomer({
//             hotelKey: "c8019a96",
//             applicationKey: "EMAILPARSER",
//             secret: "M2NjNzBhY2IzMzVjNzczOWQyYTcyODJkNjJhMTNkZTNmZjI4ZmRjZjRlYTRkYWZiMGQ3NjY0M2QwNjRiMzEzNw=="
//         });
//         const data = await roomer.testBooking();
//         res.send(data);
    
//     } catch(e) {
//         console.log("e", e.response.data);
//         res.send(e.response.data);
//     } 
// });



app.post("/post/transform/:cid", async (req: Request, res: Response) => {
    res.status(400).send({message: "not needed"});
});

app.post("/pre/transform/:cid", (req: Request, res: Response) => {
    res.status(400).send({message: "not needed"});
});

app.post("*", async (req, res) => {
    try {
        const {data} = await Services.EmailParserAxios.post("api", req.url);
        res.send(data);
    } catch(e) {
        
        res.send(e);
    }   
});



export default app;
