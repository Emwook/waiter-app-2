import { Table } from "../../types/tableTypes";

export const getSortedTables = (arr: Table[]): Table[][] => {
    const groups: { [status: string]: Table[] } = {};

    arr.forEach(table => {
        const status = table.status; 

        if (!groups[status]) {
            groups[status] = [];
        }

        groups[status].push(table);
    });

    const result: Table[][] = Object.values(groups);

    return result;
};
