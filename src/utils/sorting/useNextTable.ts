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
            if (tables.length === 0) { // Changed from if(tables) and updated to handle empty table case
                setNextTable({
                    ...defaultNewTable,
                    tableNumber: 1 // Directly setting tableNumber to 1 if no tables
                });
            } else {
                const sortedTables = sortTables([...tables], 'tableNumber'); // Sorting tables by tableNumber
                const lastTableNumber = sortedTables[sortedTables.length - 1].tableNumber;
                let nextTableNumber = lastTableNumber + 1;

                if (lastTableNumber > sortedTables.length) { // Handling case where lastTableNumber is greater
                    nextTableNumber = determineNextTableNumber(sortedTables);
                }

                setNextTable({
                    ...defaultNewTable,
                    tableNumber: nextTableNumber // Setting nextTableNumber directly
                });
            }
        };

        updateNextTableNumber(); // Updated to always call this function whenever `tables` changes
    }, [tables]);

    return nextTable;
};

export default useNextTable;
