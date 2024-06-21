import React from "react";
import { Button } from 'react-bootstrap'
import { Table } from "../../types/tableTypes";
import { useDispatch } from "react-redux";
import { requestTableRemove } from "../../store/reducers/tablesReducer";

interface RemoveTableProps {
    table: Table;
}

const RemoveTable:React.FC<RemoveTableProps> = ({table}) =>{
    const dispatch = useDispatch();
    const tableToRemove: Table = table;

    const handleRemove = (e: React.FormEvent<HTMLButtonElement>) => {
        e.preventDefault();
        dispatch(requestTableRemove(tableToRemove) as any);
    };

    
    return(
    <Button variant="danger" className="border-light text-right mx-2" onClick={handleRemove}>
        <i className="bi bi-trash"/>
    </Button>
    )
}
export default RemoveTable;