import { useEffect, useState, useMemo } from "react";
import { Table } from "../../types/tableType";
import { sortTables } from "./sortTables";
import useTables from "../store/useTables";

const useNextTable = () => {
    const { tables, loadingTables } = useTables();
    const [loadingNextTable, setLoadingNextTable] = useState(true);

    const [nextTable, setNextTable] = useState<Table>({
        tableNumber: 0,
        status: 'free',
        numOfPeople: 0,
        maxNumOfPeople: 1,
        bill: 0
    });

    const memoizedTables = useMemo(() => tables,  [tables]);
    console.log('memoized tables: ', memoizedTables);

    useEffect(() => {
        console.log("Entering useEffect in useNextTable");

        const updateNextTableNumber = async () => {
            console.log("Updating new table number...");

            try {
                if (!loadingTables) { // Wait for loading to be false
                    console.log('loading state is: ',loadingTables);
                    if (memoizedTables.length === 0) {
                        console.log("Tables list is empty. Setting tableNumber to 1.");
                        setNextTable(prevTable => ({
                            ...prevTable,
                            tableNumber: 9999
                        }));
                    } else {
                        const sortedTables = [...memoizedTables];
                        sortTables(sortedTables, 'tableNumber');

                        const lastTableNumber = sortedTables[sortedTables.length - 1].tableNumber;
                        console.log("lastTableNumber", lastTableNumber)
                        const nextTableNumber = lastTableNumber + 1;
                        console.log("nextTableNumber", nextTableNumber);

                        const table: Table = {
                            tableNumber: nextTableNumber,
                            status: 'free',
                            numOfPeople: 0,
                            maxNumOfPeople: 1,
                            bill: 0
                        };

                        console.log("New table:", table);
                        setNextTable(table);
                        setLoadingNextTable(false);
                    }
                }
            } catch (error) {
                console.error('Error updating new table number:', error);
                // Handle error appropriately, such as logging or displaying an error message
            }
        };
        updateNextTableNumber();
        const handleUpdate = (event: CustomEvent<{ table: Table }>) => {
            updateNextTableNumber();
        };
        window.addEventListener('tableRefetched', handleUpdate as EventListener);
    
        return () => {
            window.removeEventListener('tableRefetched', handleUpdate as EventListener);
            console.log("Exiting useEffect in useNextTable");
        };
    }, [memoizedTables, loadingTables]); // Use memoized tables and loading in dependency array
    console.log("New table state:", nextTable);

    return { nextTable, loadingNextTable };
};

export default useNextTable;
