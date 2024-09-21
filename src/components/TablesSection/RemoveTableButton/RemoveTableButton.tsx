import React from "react";
import { Button } from 'react-bootstrap'
import { Table } from "../../../types/tableTypes";
import { useDispatch } from "react-redux";
import { getAllTables, requestTableCombined, requestTableRemove } from "../../../store/reducers/tablesReducer";
import { useSelector } from "react-redux";
import combineTables from "../../../utils/combining/combineTables";
import { getOrders, requestOrderRemove } from "../../../store/reducers/orderReducer";
import { Order, Orders } from "../../../types/orderItemTypes";
import { changeMessage } from "../../../store/reducers/messageReducer";

interface RemoveTableButtonProps {
    table: Table;
}

const RemoveTableButton:React.FC<RemoveTableButtonProps> = ({table}) =>{
    const dispatch = useDispatch();
    const tableToRemove: Table = table;
    const tables: Table[] = (useSelector(getAllTables as any) as Table[])
    const order: Order = (useSelector(getOrders as any) as Orders).filter(o => o.tableNumber === table.tableNumber)[0];
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
        if(tableToRemove.status !=='busy' && tableToRemove.bill === 0){
            dispatch(requestTableRemove(tableToRemove) as any);
            if(order){
                dispatch(requestOrderRemove(order) as any);
            }
        }
        else {
            dispatch(changeMessage(19) as any);
        }
    };

    
    return(
    <Button variant="danger" className="border-light text-right mx-2" onClick={handleRemove}>
        <i className="bi bi-trash"/>
    </Button>
    )
}
export default RemoveTableButton;