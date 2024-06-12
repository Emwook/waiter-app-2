import { useState, useEffect } from "react";
import { getDocs, collection } from "firebase/firestore";
import { db } from '../../config/firebase';  
import { Table } from "../../types/tableType";
import { sortTables } from "../sorting/sortTables";
import { defaultNewTable } from "../../config/settings";
import {  defaultSortingMethod } from "../../config/settings";
import { dispatchRefetchTablesEvent } from "../events/eventDispatcher";

const useTables = () => {
    const [tables, setTables] = useState<Table[]>([]);
    const [loadingTables, setLoadingTables] = useState(true);
    const table: Table = defaultNewTable;
    
    useEffect(() => {
        const getTables = async () => {
            try {
                const tablesCollectionRef = collection(db, "tables");
                const data = await getDocs(tablesCollectionRef);
                const filteredData: Table[] = data.docs.map((doc) => ({
                    ...doc.data(), 
                } as Table));
                sortTables(filteredData, defaultSortingMethod);
                setTables(filteredData);
                setLoadingTables(false);
            } catch (err) {
                console.error(err);
            }
        };
        getTables();
        const handleUpdate = (event: CustomEvent<{ table: Table }>) => {
            getTables();
            dispatchRefetchTablesEvent(table);
        };
    
        window.addEventListener('tableRemoved', handleUpdate as EventListener);
        window.addEventListener('tableAdded', handleUpdate as EventListener);
        window.addEventListener('combinedTables', handleUpdate as EventListener);

        return () => {
            window.addEventListener('combinedTables', handleUpdate as EventListener);
            window.removeEventListener('tableRemoved', handleUpdate as EventListener);
            window.removeEventListener('tableAdded', handleUpdate as EventListener);
        };
    }, [table]);

    return { tables, loadingTables };
};

export default useTables;
