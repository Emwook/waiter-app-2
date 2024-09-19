import React from "react";
import { Button } from 'react-bootstrap'
import { Table } from "../../../types/tableTypes";
import { useDispatch } from "react-redux";
import { getAllTables, requestTableCombined, requestTableRemove } from "../../../store/reducers/tablesReducer";
import { useSelector } from "react-redux";
import combineTables from "../../../utils/combining/combineTables";

interface RemoveTableButtonProps {
    table: Table;
}

const RemoveTableButton:React.FC<RemoveTableButtonProps> = ({table}) =>{
    const dispatch = useDispatch();
    const tableToRemove: Table = table;
    const tables: Table[] = (useSelector(getAllTables as any) as Table[])

    const handleDecombine = () => {
        const filteredTables = tables.filter(t => t.combinedWith.includes(table.tableNumber));
        filteredTables.push(table);
        if (filteredTables.length > 1) {
            const tablesToCombine: Table[] = combineTables(filteredTables, tables);
            tablesToCombine.forEach(table => {
                dispatch(requestTableCombined(table) as any);
            });
        }
    };

    const handleRemove = (e: React.FormEvent<HTMLButtonElement>) => {
        e.preventDefault();
        handleDecombine();
        dispatch(requestTableRemove(tableToRemove) as any);
    };

    
    return(
    <Button variant="danger" className="border-light text-right mx-2" onClick={handleRemove}>
        <i className="bi bi-trash"/>
    </Button>
    )
}
export default RemoveTableButton;