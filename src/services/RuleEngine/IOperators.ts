type DataType = "string" | "array" | "number" | "object" | "any"

export interface Rule{
    dataType: DataType;
    operator?: string;
    description: string;
    title: string;
}