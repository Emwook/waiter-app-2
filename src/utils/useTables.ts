import { useState, useEffect } from "react";
import { getDocs, collection } from "firebase/firestore";
import { db } from '../config/firebase';  
import { Table } from "../types/tableType";
import { sortTables } from "./sortTables";
import { defaultSortingMethod } from "../config/settings";

const useTables = () => {
    const [tables, setTables] = useState<Table[]>([]);
    
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
            } catch (err) {
                console.error(err);
            }
        };
        getTables();
        const handleUpdate = (event: CustomEvent<{ table: Table }>) => {
            getTables();
        };
    
        window.addEventListener('tableRemoved', handleUpdate as EventListener);
        window.addEventListener('tableAdded', handleUpdate as EventListener);
    
        return () => {
            window.removeEventListener('tableRemoved', handleUpdate as EventListener);
            window.removeEventListener('tableAdded', handleUpdate as EventListener);

        };
    }, []); //using tables in dependencies array might cause firebase spam reading
    return tables;
};

export default useTables;
