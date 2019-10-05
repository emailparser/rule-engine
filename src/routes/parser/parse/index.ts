
/* eslint-disable @typescript-eslint/no-var-requires */
import {Router, Request, Response} from "express";
import {Parser} from "../../../services";
const router = Router();

router.post("/", async (req: Request, res: Response) => {

    try {
        const parser = new Parser();
        const out = await parser.read(req.body.config, req.body.input);
        res.send(out);
    } catch(e) {
        res.status(400).send({
            message: "Could not parse",
            success: false
        });
    }
});

export = router;