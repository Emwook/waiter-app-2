import React, { useEffect, useState } from "react";
import { db } from '../../config/firebase';
import { getDocs, collection } from "firebase/firestore";
import { Table } from "../../types/tableType";
import TableBar from "../TableBar/TableBar";
import { Sort } from "../../utils/Sort";

const Home:React.FC = () => {
    const [tables, setTables] = useState<Table[]>([]);
    
    const tablesCollectionRef = collection(db, "tables");

    useEffect(()=> {
        const getTables = async () => {
            try {
                const data = await getDocs(tablesCollectionRef);
                const filteredData: Table[] = data.docs.map((doc) => ({
                    ...doc.data(), 
                    id: doc.id,
                  } as Table));
                  Sort(filteredData);
                  setTables(filteredData);
                
            } 
            catch(err){
                console.error(err);
            }
        }
        getTables();
    }, []);
    
    return(
       <div>
         <ul className="mt-5 px-3 list-unstyled">
            {tables.map(table => 
            <TableBar
                Table={table}
                key={table.id}
            />)}
        </ul>
       </div>
    );
}

export default Home;