import { Table } from '../../types/tableTypes';

const combineTables = (table1: Table, table2: Table, tableList: Table[]): Table[] => {
    const updatedTables = new Set<Table>();

    const updateCombinedWith = (table: Table, combinedNumbers: number[]) => {
        table.combinedWith = combinedNumbers.filter(num => num !== table.tableNumber);
        updatedTables.add(table);
    };

    const combinedSet = new Set([...table1.combinedWith, ...table2.combinedWith, table1.tableNumber, table2.tableNumber]);

    // Check and update table1 and table2
    if (table1.combinedWith.includes(table2.tableNumber) && table2.combinedWith.includes(table1.tableNumber)) {
        table1.combinedWith = table1.combinedWith.filter(num => num !== table2.tableNumber);
        table2.combinedWith = table2.combinedWith.filter(num => num !== table1.tableNumber);
        console.log(`Tables ${table1.tableNumber} and ${table2.tableNumber} were separated.`);
    } else if (table1.combinedWith.includes(table2.tableNumber)) {
        table2.combinedWith.push(table1.tableNumber);
    } else if (table2.combinedWith.includes(table1.tableNumber)) {
        table1.combinedWith.push(table2.tableNumber);
    } else {
        combinedSet.add(table1.tableNumber);
        combinedSet.add(table2.tableNumber);
    }

    const combinedArray = Array.from(combinedSet);

    // Update combinedWith for each table in combinedArray
    tableList.forEach(table => {
        if (combinedArray.includes(table.tableNumber)) {
            updateCombinedWith(table, combinedArray);
        }
    });

    // Remove the table's own number from combinedWith array
    updateCombinedWith(table1, combinedArray);
    updateCombinedWith(table2, combinedArray);

    return Array.from(updatedTables);
};

export default combineTables;
