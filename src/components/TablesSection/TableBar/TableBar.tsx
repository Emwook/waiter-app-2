import React from "react";
import { Col, Button, Form } from 'react-bootstrap';
import { NavLink } from "react-router-dom";
import { Table } from "../../../types/tableTypes";
import RemoveTable from "../RemoveTableButton/RemoveTableButton";
import { useDispatch } from "react-redux";
import { checkSelectMode, toggleSelected } from "../../../store/reducers/selectModeReducer";
import { useSelector } from "react-redux";

interface TableBarProps {
    Table: Table;
    index: number;
    inGroupByStatus: boolean;
}

const TableBar: React.FC<TableBarProps> = ({ Table, index, inGroupByStatus }) => {
    const dispatch = useDispatch();
    const selectMode = useSelector(checkSelectMode);
   
    let statusColor: string = 'text-dark';

    switch(Table.status){
        case 'busy':
            statusColor = 'text-danger';
            break;
        case 'free':
            statusColor = 'text-success';
            break;
        case 'reserved':
            statusColor = 'text-warning';
            break;
        case 'cleaning':
            statusColor = 'text-info';
            break;
        default:
            break;
        }
    
    const handleSelect = () => {
        dispatch(toggleSelected(Table) as any);
    };

    return (
        <div className={`mt-1 pb-2 pt-4 px-1 d-flex justify-content-between align-items-center border-bottom
            border-gray 'bg-none flex-wrap flex-md-nowrap'`}>
            {(selectMode) && (
            <Col xs={1}>
            <Form className="mx-1">
                <Form.Check type="checkbox" onClick={handleSelect} />
            </Form>
            </Col>
            )}
            <Col xs={12} md={3} ><span className="h2">Table {Table ? Table.tableNumber : ''}</span></Col>
            <Col xs={1} md={1}><span className="text-muted">${Table ? Table.bill : ''}</span></Col>
            <Col xs={1} md={1}><span className="text-muted">{Table ? Table.numOfPeople : ''}/{Table ? Table.maxNumOfPeople : ''}</span></Col>
            <Col xs={3} md={1}><span className={statusColor}>{Table ? Table.status : ''}</span></Col>  
            <Col xs={3} md={2}>
            {Table.combinedWith.length > 0 && 
            <>
                <i className="bi bi-link"/>
                <span className="text-muted px-1">
                    {
                        Table.combinedWith.map((tableNumber, index) => (
                            <span key={tableNumber}>
                                {tableNumber}
                                {index < Table.combinedWith.length - 1 && ", "}
                            </span>
                        ))
                    }
                </span>
                </>
            }
            </Col>  
            
            <Col xs={1} md={4} className="d-flex justify-content-end">
                <RemoveTable table={Table} />
                <Button variant="primary" className="border-light text-right ml-auto">
                    <NavLink to={Table ? (`/table/${Table.tableNumber}`) : '/'} style={{ textDecoration: 'none', color: 'inherit' }}>
                        <i className="bi bi-pencil"></i>
                    </NavLink> 
                </Button>
            </Col>
        </div>
    )
}

export default TableBar;
