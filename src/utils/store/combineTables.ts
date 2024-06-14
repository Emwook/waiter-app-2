import { Table } from "../../types/tableTypes";
import { updateTable } from "../../utils/store/UpdateTable";

const combineTables = (table1: Table, table2: Table, tableList: Table[]): Table[] => {
    const combinedSet = new Set([...table1.combinedWith, ...table2.combinedWith]);

    combinedSet.delete(table1.tableNumber);
    combinedSet.delete(table2.tableNumber);

    combinedSet.add(table1.tableNumber);
    combinedSet.add(table2.tableNumber);

    const combinedArray = Array.from(combinedSet);

    table1.combinedWith = combinedArray.filter(num => num !== table1.tableNumber);
    table2.combinedWith = combinedArray.filter(num => num !== table2.tableNumber);

    combinedArray.forEach(tableNumber => {
        if (tableNumber !== table1.tableNumber && tableNumber !== table2.tableNumber) {
            const table = tableList.find(t => t.tableNumber === tableNumber);
            if (table) {
                table.combinedWith = combinedArray.filter(num => num !== table.tableNumber);
                updateTable(table.tableNumber, { combinedWith: table.combinedWith });
            }
        }
    });

    updateTable(table1.tableNumber, { combinedWith: table1.combinedWith });
    updateTable(table2.tableNumber, { combinedWith: table2.combinedWith });

    return tableList.map(table => {
        if (table.tableNumber === table1.tableNumber) {
            return table1;
        }
        if (table.tableNumber === table2.tableNumber) {
            return table2;
        }
        return table;
    });
};

export default combineTables;
