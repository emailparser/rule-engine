export default class ProblemDuringParsingError extends Error{

    public warnClient: boolean;
    public constructor(msg: string){
        super(msg);
        this.message = msg;
        this.warnClient = true;
    }
}