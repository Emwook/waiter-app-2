import React from "react";
import { Button } from 'react-bootstrap'
import { Table } from "../../types/tableType";
import { removeSelectedTable } from "../../utils/store/removeSelectedTable";
import { dispatchTableRemovedEvent } from "../../utils/events/eventDispatcher";

interface RemoveTableProps {
    table: Table;
}

const RemoveTable:React.FC<RemoveTableProps> = ({table}) =>{
    const tableToRemove: Table = table;

    const handleRemove = (e: React.FormEvent<HTMLButtonElement>) => {
        e.preventDefault();
        removeSelectedTable(tableToRemove);
        dispatchTableRemovedEvent(tableToRemove);
    };

    
    return(
    <Button variant="danger" className="border-light text-right mx-2" onClick={handleRemove}>
        <i className="bi bi-trash"/>
    </Button>
    )
}
export default RemoveTable;