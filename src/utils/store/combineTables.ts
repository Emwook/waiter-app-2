import { Table } from "../../types/tableType";
import { updateTable } from "../../utils/store/UpdateTable";

const combineTables = (table1: Table, table2: Table, tableList: Table[]) => {
    // Set of all combined table numbers
    const combinedSet = new Set([...table1.combinedWith, ...table2.combinedWith]);

    // Remove own table numbers if present
    combinedSet.delete(table1.tableNumber);
    combinedSet.delete(table2.tableNumber);

    // Add each other's table numbers
    combinedSet.add(table1.tableNumber);
    combinedSet.add(table2.tableNumber);

    // Convert set back to array
    const combinedArray = Array.from(combinedSet);

    // Update combinedWith for table1 and table2
    table1.combinedWith = combinedArray.filter(num => num !== table1.tableNumber);
    table2.combinedWith = combinedArray.filter(num => num !== table2.tableNumber);

    // Update combinedWith for other tables in the combined array
    combinedArray.forEach(tableNumber => {
        if (tableNumber !== table1.tableNumber && tableNumber !== table2.tableNumber) {
            const table = tableList.find(t => t.tableNumber === tableNumber);
            if (table) {
                table.combinedWith = combinedArray.filter(num => num !== table.tableNumber);
                updateTable(table.tableNumber, { combinedWith: table.combinedWith });
            }
        }
    });

    // Update table1 and table2
    updateTable(table1.tableNumber, { combinedWith: table1.combinedWith });
    updateTable(table2.tableNumber, { combinedWith: table2.combinedWith });
};

export default combineTables;