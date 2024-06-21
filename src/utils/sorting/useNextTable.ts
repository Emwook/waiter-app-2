import { useEffect, useState } from "react";
import { Table } from "../../types/tableTypes";
import { sortTables } from "./sortTables";
import { determineNextTableNumber } from "./determineNextTableNumber";
import { defaultNewTable } from "../../config/settings";
import { useSelector } from "react-redux";
import { getAllTables } from "../../store/reducers/tablesReducer";

const useNextTable = () => {
    const tables = useSelector(getAllTables);
    const [nextTable, setNextTable] = useState<Table>(defaultNewTable);

    useEffect(() => {
        const updateNextTableNumber = () => {
            if (tables) {
                if (tables.length === 0) {
                    setNextTable(prevTable => ({
                        ...prevTable,
                        tableNumber: 1
                    }));
                } else {
                    const sortedTables = sortTables([...tables], 'tableNumber');
                    const lastTableNumber = sortedTables[sortedTables.length - 1].tableNumber;
                    let nextTableNumber = lastTableNumber + 1;
                    if (lastTableNumber > sortedTables.length) {
                        nextTableNumber = determineNextTableNumber(sortedTables);
                    }
                    const table: Table = (defaultNewTable);
                    table.tableNumber = nextTableNumber;
                    setNextTable(table);
                }
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
    }, [tables]);

    return { nextTable };
};

export default useNextTable;
