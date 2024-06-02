import { useState, useEffect } from "react";
import { getDocs, collection } from "firebase/firestore";
import { db } from '../config/firebase';  
import { Table } from "../types/tableType";
import { sort } from "./Sort";

const useTables = () => {
    const [tables, setTables] = useState<Table[]>([]);
    
    useEffect(() => {
        const getTables = async () => {
            try {
                const tablesCollectionRef = collection(db, "tables");
                const data = await getDocs(tablesCollectionRef);
                const filteredData: Table[] = data.docs.map((doc) => ({
                    ...doc.data(), 
                    id: doc.id,
                } as Table));
                sort(filteredData);
                setTables(filteredData);
            } catch (err) {
                console.error(err);
            }
        };
        getTables();
    }, []); //using tables in dependencies array might cause firebase spam reading
    
    return tables;
};

export default useTables;
