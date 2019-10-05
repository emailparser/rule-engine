
/* eslint-disable @typescript-eslint/no-var-requires */
import {Router, Request, Response} from "express";
import {ConfigValidator} from "../../../services";
const router = Router();

router.get("/", async (req: Request, res: Response) => {

    try {
        res.send(ConfigValidator.types());
    } catch(e) {
        res.status(400).send({
            message: "Could not get instructions",
            success: false
        });
    }
});

export = router;