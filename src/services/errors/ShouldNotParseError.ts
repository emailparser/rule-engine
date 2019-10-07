export default class ShouldNotparseError extends Error{

    public warnClient: boolean;
    public constructor(msg: string){
        super(msg);
        this.message = msg;
        this.warnClient = false;
    }
}