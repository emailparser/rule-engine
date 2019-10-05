import {Router, Request, Response} from "express";
import {country} from "../../../models";
const router = Router();

router.get("/", async (req: Request, res: Response) => {

    try {
        const docs = await country.find();
        res.send(docs);
    } catch(e) {
        res.status(400).send({
            message: "Could not get instructions",
            success: false
        });
    }
});

export default router;