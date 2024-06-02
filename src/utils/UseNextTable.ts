import { useEffect, useState } from "react";
import { Table } from "../types/tableType";
import { sort } from "./Sort";
import { nanoid } from 'nanoid';
import useTables from "./useTables";

const useNextTable = (): Table => {
    const tables: Table[] = useTables();
    const [newTable, setNewTable] = useState<Table>({
        id: '',
        tableNumber: 0,
        status: 'free',
        numOfPeople: 0,
        maxNumOfPeople: 1,
        bill: 0
    });

    useEffect(() => {
        const sortedTables = [...tables];
        sort(sortedTables);

        const lastTableNumber = sortedTables.length > 0 ? sortedTables[sortedTables.length - 1].tableNumber : 0;
        const nextTableNumber = lastTableNumber + 1;

        const newTable: Table = {
            id: nanoid(),
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
