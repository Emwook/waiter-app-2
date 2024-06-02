import React from "react";
import { Table } from "../../types/tableType";
import TableBar from "../TableBar/TableBar";
import useTables from "../../utils/useTables";
import { useState, useEffect } from "react";
import Loading from "../Loading/Loading";
import TableForm from "../TableForm/TableForm";

const Home:React.FC = () => {
    const tables: Table[] = useTables();
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        if (tables) {
            setLoading(false);
        }
    }, [tables]);

    if (loading) {
        return <Loading/>
    }
    return(
       <div>
         <ul className="mt-5 px-3 list-unstyled">
            {tables.map(table => 
            <TableBar
                Table={table}
                key={table.id}
            />)}
            <TableForm/>
        </ul>
       </div>
    );
}

export default Home;