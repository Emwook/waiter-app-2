import { Table, TableStatus } from '../../types/tableTypes';

const combineTables = (selectedTables: Table[], tableList: Table[]): Table[] => {
    const updatedTables = new Set<Table>();

    const updateCombinedWith = (table: Table, combinedNumbers: number[]) => {
        table.combinedWith = combinedNumbers.filter(num => num !== table.tableNumber); // Filter out its own tableNumber
        updatedTables.add(table);
    };

    const allTablesCombined = selectedTables.every(table => 
        selectedTables.every(otherTable => 
            table.tableNumber === otherTable.tableNumber || table.combinedWith.includes(otherTable.tableNumber)
        )
    );

    if (allTablesCombined) {
        // Clear combinedWith array completely for all selected tables
        selectedTables.forEach(table => {
            table.combinedWith = [];
            updatedTables.add(table);
        });

        // Update other tables in the list that were part of the combined set to remove references to the decombined tables
        selectedTables.forEach(table => {
            tableList.forEach(otherTable => {
                if (otherTable.combinedWith.includes(table.tableNumber)) {
                    otherTable.combinedWith = otherTable.combinedWith.filter(num => num !== table.tableNumber);
                    updatedTables.add(otherTable);
                }
            });
        });
    } else {
        const combinedSet = new Set<number>();

        // Add all tables' combined groups to the set
        selectedTables.forEach(table => {
            combinedSet.add(table.tableNumber);
            table.combinedWith.forEach(num => combinedSet.add(num));
        });

        // Determine the status to inherit
        let combinedStatus: TableStatus = 'free';
        selectedTables.forEach(table => {
            if (table.status !== 'free') {
                combinedStatus = table.status;
            }
        });

        // Combine all selected tables and their properties
        const combinedTable: Table = {
            tableNumber: selectedTables[0].tableNumber, // Keep the original table number
            status: combinedStatus,
            numOfPeople: selectedTables.reduce((total, table) => table.numOfPeople, 0),
            maxNumOfPeople: selectedTables.reduce((max, table) => (table.maxNumOfPeople), 0),
            bill: selectedTables.reduce((total, table) => table.bill, 0),
            combinedWith: Array.from(combinedSet).filter(num => num !== selectedTables[0].tableNumber) // Filter out its own tableNumber
        };

        // Update each selected table to reflect the combined state
        selectedTables.forEach(table => {
            updateCombinedWith(table, Array.from(combinedSet));
            tableList.forEach(otherTable => {
                if (combinedSet.has(otherTable.tableNumber)) {
                    updateCombinedWith(otherTable, Array.from(combinedSet));
                }
            });
        });

        updatedTables.add(combinedTable);
    }

    return Array.from(updatedTables);
};

export default combineTables;
