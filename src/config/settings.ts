import { Table } from "../types/tableType";

export const mostNumOfPeople = 10;
export const leastNumOfPeople = 0;
export const possibleStatusList = ['free', 'busy', 'cleaning', 'reserved'];
export const maxBill = 10000;
export const defaultSortingMethod = 'tableNumber';
export const defaultCombined = [];

export const defaultNewTable: Table = {
    status: 'free',
    bill: 0,
    numOfPeople: 0,
    maxNumOfPeople: 1,
    tableNumber: 9999,
    combinedWith: defaultCombined
};

export const statusOrder: { [status: string]: number } = {
    'busy': 0,
    'free': 1,
    'cleaning': 2,
    'reserved': 3
};
