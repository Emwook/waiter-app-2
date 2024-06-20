import { useState, useEffect } from "react";
import { getDocs, collection } from "firebase/firestore";
import { db } from '../../store/store';  
import { Table } from "../../types/tableTypes";
import { sortTables } from "../sorting/sortTables";
import { defaultNewTable } from "../../config/settings";
import {  defaultSortingMethod } from "../../config/settings";
import { dispatchRefetchTablesEvent } from "../events/eventDispatcher";
import { useSelector } from "react-redux";
import { getAllTables } from "../../store/reducers/tablesReducer";

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
        //
        // const handleUpdateFromTablesList = (event: CustomEvent<{ tables: Table[] }>) => {
        //     getTables();
        //     dispatchRefetchTablesEvent(table);
        // };
        //  /|\
    
        window.addEventListener('tableRemoved', handleUpdate as EventListener);
        window.addEventListener('tableAdded', handleUpdate as EventListener);
        window.addEventListener('combinedTables', handleUpdate as EventListener);

        return () => {
            window.removeEventListener('tableRemoved', handleUpdate as EventListener);
            window.removeEventListener('tableAdded', handleUpdate as EventListener);
            window.addEventListener('combinedTables', handleUpdate as EventListener);
        };
    }, [table]);

    return { tables, loadingTables };
};

/*
const useTables = () => {
    const tables = useSelector(getAllTables);
    const [loadingTables, setLoadingTables] = useState<boolean>(true);

    if(tables){
        setLoadingTables(false)
    }

    return {tables, loadingTables}
}
*/
export default useTables;
