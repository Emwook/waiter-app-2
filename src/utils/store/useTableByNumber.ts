import { useState, useEffect } from "react";
import { getDocs, collection, query, where } from "firebase/firestore";
import { db } from '../../config/firebaseConfig';  
import { Table } from "../../types/tableTypes";
import { defaultNewTable } from "../../config/settings";

const useTableByNumber = (tableNumber: number) => {
    const [table, setTable] = useState<Table>(defaultNewTable);
    
    useEffect(() => {
        const getTable = async () => {
            try {
                const tablesCollectionRef = collection(db, "tables");
                const q = query(tablesCollectionRef, where("tableNumber", "==", tableNumber));
                const querySnapshot = await getDocs(q);
                const tableData = querySnapshot.docs.map(doc => ({
                    ...doc.data()
                }))[0] as Table | undefined;
                if (tableData) {
                    setTable(tableData);
                } else {
                    console.error(`Table with number ${tableNumber} not found`);
                }
            } catch (err) {
                console.error(err);
            }
        };
        getTable();
    }, [tableNumber]);
    
    return table;
};

export default useTableByNumber;
