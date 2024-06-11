import { useEffect, useState, useMemo } from "react";
import { Table } from "../../types/tableType";
import { sortTables } from "./sortTables";
import useTables from "../store/useTables";
import { determineNextTableNumber } from "./determineNextTableNumber";
import { defaultNewTable } from "../../config/settings";

const useNextTable = () => {
    const { tables, loadingTables } = useTables();
    const [loadingNextTable, setLoadingNextTable] = useState(true);
    const [nextTable, setNextTable] = useState<Table>(defaultNewTable);

    const memoizedTables = useMemo(() => tables, [tables]);

    useEffect(() => {
        const updateNextTableNumber = () => {
            if (!loadingTables) {
                if (memoizedTables.length === 0) {
                    setNextTable(prevTable => ({
                        ...prevTable,
                        tableNumber: 1
                    }));
                } else {
                    const sortedTables = sortTables([...memoizedTables], 'tableNumber');
                    const lastTableNumber = sortedTables[sortedTables.length - 1].tableNumber;
                    let nextTableNumber = lastTableNumber + 1;
                    if (lastTableNumber > sortedTables.length) {
                        nextTableNumber = determineNextTableNumber(sortedTables);
                    }
                    const table: Table = (defaultNewTable);
                    table.tableNumber = nextTableNumber;
                    setNextTable(table);
                }
                setLoadingNextTable(false);
            }
        };

        updateNextTableNumber();

        const handleUpdate = (event: CustomEvent<{ table: Table }>) => {
            updateNextTableNumber();
        };

        window.addEventListener('tableRefetched', handleUpdate as EventListener);

        return () => {
            window.removeEventListener('tableRefetched', handleUpdate as EventListener);
        };
    }, [memoizedTables, loadingTables]);

    return { nextTable, loadingNextTable };
};

export default useNextTable;
