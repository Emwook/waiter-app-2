import { Table } from "../../types/tableTypes";
import { statusOrder } from "../../config/settings";

export const sortTables = <K extends keyof Table>(arr: Table[], method: K): Table[] => {
    const sortedArr = [...arr];
    const isSortingByStatus = method === 'status';
    const isSortingByTableNumber = method === 'tableNumber';

    for (let i = 1; i < sortedArr.length; i++) {
        let key = sortedArr[i];
        let j = i - 1;

        if (isSortingByStatus) {
            while (j >= 0 && statusOrder[sortedArr[j][method] as string] > statusOrder[key[method] as string]) {
                sortedArr[j + 1] = sortedArr[j];
                j--;
            }
        } 
        else if (isSortingByTableNumber) {
            while (j >= 0 && sortedArr[j][method] > key[method]) {
                sortedArr[j + 1] = sortedArr[j];
                j--;
            }
        } 
        else {
            while (j >= 0 && sortedArr[j][method] < key[method]) {
                sortedArr[j + 1] = sortedArr[j];
                j--;
            }
        }

        sortedArr[j + 1] = key;
    }

    return sortedArr;
};
