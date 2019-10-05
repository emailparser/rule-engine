/* eslint-disable @typescript-eslint/no-var-requires */
import {
    EmailData,
    Config,
    Reservation,
    Recipe,
    GrabberMethod,
} from "./interface";
import {type} from "./enum";


export default class Parser{

    private data: EmailData;
    private config: Config;
    private reservation: Reservation;

    public constructor(){
        
    }

    public async read(recipe: Recipe, text: string): Promise<any>{
        return await this.intRouter(recipe, text);
    }



    private async intRouter(recipe: Recipe, text: string): Promise<any>{
        let method;
        
        switch(recipe.retrieveType){
            case "date":
                method = () => this.intDate(recipe, text);
                break;
            case "string":
                method = () => this.intString(recipe, text);
                break;
            case "bool":
                method = () => this.intBoolean(recipe, text);
                break;
            case "array":
                method = () => this.intArray(recipe, text);
                break;
            case "object":
                method = () => this.intObject(recipe, text);
                break;
            default:
                throw Error(`Retrieve Type ${recipe.retrieveType} does not exist`);
        }

        return await method();
    }

    private getGrabberMethod(key: string): string{
        const methods: any =  {
            "PATTERN": "pattern",
            "STRING_BETWEEN": "stringBetween",
            "STRING_AFTER": "stringAfter",
            "STRING_BEFORE": "stringBefore",
            "SPLIT_BY": "splitBy"
        };
        return methods[key];
    }

    public async intBoolean(recipe: Recipe, text: string): Promise<any>{
        const {parameters, sub, instruction} = recipe;
        const method: string = this.getGrabberMethod(instruction);
        // @ts-ignore
        const matches = await this[method](text, parameters);
        let tmp = matches ? true : false;
        if(sub){
            if(!Array.isArray(sub)) throw Error("Sub for boolean must be arra with true [bx1] or false [bx0]");
            if(sub.length !== 2) throw Error("Sub for boolean must be arra with true [bx1] or false [bx0]");
            tmp = await this.intSub(sub[tmp ? 1 : 0], text);
        }
        return tmp;
    }

    private async intDate(recipe: Recipe, text: string): Promise<any>{
        
    }

    public async intArray(recipe: Recipe, text: string): Promise<any>{
        const {parameters, sub, instruction} = recipe;
        const method: string = this.getGrabberMethod(instruction);
        // @ts-ignore
        const matches = await this[method](text, parameters);
        if(!matches) return null;
        const tmp = [];
        for(let i = 0; i < matches.length; i++){
            const match = await this.intSub(sub, matches[i]);
            tmp.push(match);
        }
        return tmp;
    }

    public async intObject(recipe: Recipe, text: string): Promise<any>{
        const {sub} = recipe;
        const tmp: any = {};
        if(!sub || !(sub instanceof Object)) return text; 
        for(let key in sub){
            tmp[key] = await this.intSub(sub[key], text);
        }
        return tmp;
    }

    private async intSub(sub: Recipe, text: string): Promise<any>{
        if(!sub) return text;
        return await this.intRouter(sub, text);
    }

    public async intString(recipe: Recipe, text: string): Promise<any>{
        let match: string;
        const {parameters, sub, instruction} = recipe;
        const method: string = this.getGrabberMethod(instruction);
        // @ts-ignore
        const matches = await this[method](text, parameters);
        if(matches) match = matches[parameters.index ? parameters.index : 0];
        else return null;
        return await this.intSub(sub, match);
    }

    private grabSub(str: string, pattern: string): string[]{
        let regex = new RegExp(pattern, "g");
        return str.match(regex);
    }


    public stringBetween(text: string, parameters: any): string[]{
        const {before, after} = parameters;
        const pat = `(?<=(${after}))((?!${after})(?!${before})(.|\r))*(?=(${before}))`;
        //const pat = `(?<=(${after}))((?!${after})(?!${before}).)*(?=(${before}))`;
        const matches =  this.grabSub(text, pat);
        if(!matches) return [];
        for(let i = 0; i < matches.length; i++){
            matches[i] = matches[i].trim();
        }
        return matches;
    }

    public splitBy(text: string, parameters: any): string[]{
        const {splitter} = parameters;
        const matches = text.split(splitter);
        if(!matches) return [];
        for(let i = 0; i < matches.length; i++){
            matches[i] = matches[i].trim();
        }
        return matches;
    }

    public stringBefore(text: string, parameters: any): string[]{
        const {before} = parameters;
        const matches =  text.split(before);
        matches[0] = matches[0].trim();
        return matches.splice(0, 1);
    }

    public stringAfter(text: string, parameters: any): string[]{
        const {after} = parameters;
        const matches =  text.split(after);
        if(matches.length == 1) return null;
        return [matches.pop().trim()];
    }


    public pattern(text: string, parameters: any): string[]{
        return this.grabSub(text, parameters.pattern);
    }
}