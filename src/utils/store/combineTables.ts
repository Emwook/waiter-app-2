import { Table } from "../../types/tableTypes";

const combineTables = (table1: Table, table2: Table, tableList: Table[]): Table[] => {
    const combinedSet = new Set([...table1.combinedWith, ...table2.combinedWith]);

    combinedSet.delete(table1.tableNumber);
    combinedSet.delete(table2.tableNumber);

    combinedSet.add(table1.tableNumber);
    combinedSet.add(table2.tableNumber);

    const combinedArray = Array.from(combinedSet);

    table1.combinedWith = combinedArray.filter(num => num !== table1.tableNumber);
    table2.combinedWith = combinedArray.filter(num => num !== table2.tableNumber);

    const tablesToUpdate: Table[] = [];
    combinedArray.forEach(tableNumber => {
        if (tableNumber !== table1.tableNumber && tableNumber !== table2.tableNumber) {
            const table = tableList.find(t => t.tableNumber === tableNumber);
            if (table) {
                table.combinedWith = combinedArray.filter(num => num !== table.tableNumber);
                tablesToUpdate.push(table);
            }
        }
    });

    return tablesToUpdate;
};

export default combineTables;
