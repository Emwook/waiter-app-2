import { useEffect, useState } from "react";
import { Table } from "../types/tableType";
import { sortTables } from "./sortTables";
import useTables from "./useTables";

const useNextTable = (): Table => {
    const tables: Table[] = useTables();
    const [newTable, setNewTable] = useState<Table>({
        tableNumber: 0,
        status: 'free',
        numOfPeople: 0,
        maxNumOfPeople: 1,
        bill: 0
    });

    useEffect(() => {
        const sortedTables = [...tables];
        sortTables(sortedTables, 'tableNumber');

        const lastTableNumber = sortedTables.length > 0 ? sortedTables[sortedTables.length - 1].tableNumber : 0;
        console.log('last: ', lastTableNumber)

        const nextTableNumber = lastTableNumber + 1;
        console.log('next: ', nextTableNumber)

        const newTable: Table = {
            tableNumber: nextTableNumber,
            status: 'free',
            numOfPeople: 0,
            maxNumOfPeople: 1,
            bill: 0
        };

        setNewTable(newTable);
    }, [tables]);
    return newTable;
};
export default useNextTable;
