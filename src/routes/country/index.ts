import {Router} from "express";
import getAll from "./getAll";
import post from "./post";
const router = Router();

router.use("/", getAll);
router.use("/", post);

export default router;