import {Router} from "express";
const router = Router();

router.use("/", require("./parse"));

export = router;