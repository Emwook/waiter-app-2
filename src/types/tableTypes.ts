export type TableStatus = "free" | "busy" | "reserved" | "cleaning";

export type GroupOption = "combined" | "none" | "free" | "busy" | "reserved" | "cleaning";
export type GroupingMethod = "status" | "none" | "combined";


export interface Table {
    tableNumber: number;
    bill: number;
    numOfPeople: number;
    maxNumOfPeople: number;
    status: TableStatus;
    combinedWith: number[]
}
