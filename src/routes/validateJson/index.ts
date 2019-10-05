import {Router} from "express";
const router = Router();

router.use("/", require("./validate"));

export = router;