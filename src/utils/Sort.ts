import { Table } from "../types/tableType";


export const Sort = (arr: Table[]): Table[] => {
    for (let i = 1; i < arr.length; i++) {
        let key = arr[i];
        let j = i - 1;
        while (j >= 0 && arr[j].tableNumber > key.tableNumber) {
            arr[j + 1] = arr[j];
            j--;
        }
        arr[j + 1] = key;
    }
    return arr;
};