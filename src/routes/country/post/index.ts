import {Router, Request, Response} from "express";
import {country} from "../../../models";
const router = Router();

router.post("/", async (req: Request, res: Response) => {

    try {
        const item = new country(req.body);
        await item.save();
        res.send(item);
    } catch(e) {
        res.status(400).send({
            message: "Could not get instructions",
            success: false
        });
    }
});

export default router;