type DataType = "string" | "array" | "number" | "object"

export interface Rule{
    dataType: DataType;
    operator?: string;
    description: string;
    title: string;
}