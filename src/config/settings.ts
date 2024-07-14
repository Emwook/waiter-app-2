import { Table } from "../types/tableTypes";

export const mostNumOfPeople = 10;
export const leastNumOfPeople = 0;
export const possibleStatusList = ['free', 'busy', 'cleaning', 'reserved'];

export const groupTypes = ['none', 'combined', 'status'];
export const maxBill = 10000;
export const defaultSortingMethod = 'tableNumber';

export const defaultCombined = [];
export const defaultGroupingMethod = 'none';

export const possibleRepeatList = ['false', 'daily', 'weekly', 'monthly', 'annually', 'undefined'];


export const openFrom = new Date()
openFrom.setHours(12);
openFrom.setMinutes(0);
export const openTo = new Date()
openTo.setHours(23);
openTo.setMinutes(59);

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
