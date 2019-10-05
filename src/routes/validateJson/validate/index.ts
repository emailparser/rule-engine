
/* eslint-disable @typescript-eslint/no-var-requires */
import {Router, Request, Response} from "express";
import {ConfigValidator} from "../../../services";
const router = Router();

router.post("/", async (req: Request, res: Response) => {

    try {
        ConfigValidator.validateConfig(req.body);
        res.send({
            success: true
        });
    } catch(e) {
        res.status(400).send({
            message: e.message,
            success: false
        });
    }
});

export = router;