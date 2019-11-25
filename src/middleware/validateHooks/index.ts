import {Request, Response, NextFunction} from "express";
import {allowedHooks} from "../../services/RuleEngine/lifecycleHooks";
export default function(req: Request, res: Response, next: NextFunction){
    if(!allowedHooks.includes(req.params.hook)) res.status(400).send({
        message: "Hook doesn't exist"
    });
    next();
}