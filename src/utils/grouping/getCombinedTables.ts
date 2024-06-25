import { Table } from "../../types/tableTypes";

export const getCombinedTables = (arr: Table[]): Table[][] => {
    let groups: Table[][] = [];
    let visited: Set<number> = new Set();

    const findGroup = (tableNumber: number, arr: Table[], currentGroup: Set<Table>) => {
        if (visited.has(tableNumber)) return;

        visited.add(tableNumber);
        const table = arr.find(t => t.tableNumber === tableNumber);
        if (table) {
            currentGroup.add(table);

            table.combinedWith.forEach(combinedTableNumber => {
                findGroup(combinedTableNumber, arr, currentGroup);
            });
        }
    };

    arr.forEach(table => {
        if (!visited.has(table.tableNumber)) {
            let currentGroup = new Set<Table>();
            findGroup(table.tableNumber, arr, currentGroup);
            groups.push(Array.from(currentGroup));
        }
    });

    // Add single tables that are not combined with any others
    arr.forEach(table => {
        if (!visited.has(table.tableNumber)) {
            groups.push([table]);
        }
    });

    return groups;
};
