import React, { useState } from "react";
import { Col, Button, Form } from 'react-bootstrap';
import { NavLink } from "react-router-dom";
import { Table } from "../../types/tableTypes";
import RemoveTable from "../RemoveTable/RemoveTable";
import { useDispatch } from "react-redux";
import { checkSelectMode, getSelected, toggleSelected } from "../../store/reducers/selectModeReducer";
import { useSelector } from "react-redux";

interface TableBarProps {
    Table: Table;
    index: number;
    inGroupByStatus: boolean;
}

const TableBar: React.FC<TableBarProps> = ({ Table, index, inGroupByStatus }) => {
    const dispatch = useDispatch();
    const selectMode = useSelector(checkSelectMode);
    const selectedTables: Table[] = useSelector(getSelected);
    

    let borderStyle: string = 'border-dark';
    let statusColor: string = 'text-dark';

    switch(Table.status){
        case 'busy':
            borderStyle = 'border-danger';
            statusColor = 'text-danger';
            break;
        case 'free':
            borderStyle = 'border-success';
            statusColor = 'text-success';
            break;
        case 'reserved':
            borderStyle = 'border-warning';
            statusColor = 'text-warning';
            break;
        case 'cleaning':
            borderStyle = 'border-info';
            statusColor = 'text-info';
            break;
        default:
            break;
        }
    /*
    if(!selectMode){
        setSelected(false);
    }
    */
    const handleSelect = () => {
        dispatch(toggleSelected(Table) as any);
        console.log('selected: ',selectedTables);
    };

    return (
        <div className={`mt-1 pb-2 pt-4 px-3 d-flex justify-content-between align-items-center border-bottom
                        border-secondary 'bg-none'`}
        >
            {(selectMode) && (
            <Form className="mx-1">
                <Form.Check type="checkbox" onClick={handleSelect} />
            </Form>
            )}
            <Col xs={2} ><h2>Table {Table ? Table.tableNumber : ''}</h2></Col>
            <Col><span className={statusColor}>{Table ? Table.status : ''}</span></Col>
            <Col><span className="text-muted">${Table ? Table.bill : ''}</span></Col>
            <Col><span className="text-muted">{Table ? Table.numOfPeople : ''}/{Table ? Table.maxNumOfPeople : ''}</span></Col>
            <Col>
                <i className="bi bi-link"/>
                <span className="text-muted px-1">
                    {Table.combinedWith.length > 0 ? (
                        Table.combinedWith.map((tableNumber, index) => (
                            <span key={tableNumber}>
                                {tableNumber}
                                {index < Table.combinedWith.length - 1 && ", "}
                            </span>
                        ))
                    ) : (
                        ""
                    )}
                </span>
            </Col>  
            <Col xs={6} className="d-flex justify-content-end">
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
  
/*<Draggable key={Table.tableNumber} draggableId={String(Table.tableNumber)} index={index}>
            {(provided) => (
                <div 
                    className={`text-dark pb-2 pt-4 px-3 d-flex justify-content-between align-items-center border-bottom border-dark`}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    ref={provided.innerRef}
                >
                    <Col xs={2}><h2>Table {Table ? Table.tableNumber : ''}</h2></Col>
                    <Col><span className="text-muted">{Table ? Table.status : ''}</span></Col>
                    <Col><span className="text-muted">${Table ? Table.bill : ''}</span></Col>
                    <Col><span className="text-muted">{Table ? Table.numOfPeople : ''}/{Table ? Table.maxNumOfPeople : ''}</span></Col>
                    <Col>
                        <i className="bi bi-link"/>
                        <span className="text-muted px-1">
                            {Table.combinedWith.length > 0 ? (
                                Table.combinedWith.map((tableNumber, index) => (
                                    <span key={tableNumber}>
                                        {tableNumber}
                                        {index < Table.combinedWith.length - 1 && ", "}
                                    </span>
                                ))
                            ) : (
                                ""
                            )}
                        </span>
                    </Col>  
                    <Col xs={6} className="d-flex justify-content-end">
                        <RemoveTable table={Table} />
                        <Button variant="primary" className="border-light text-right ml-auto">
                            <NavLink to={Table ? (`/table/${Table.tableNumber}`) : '/'} style={{ textDecoration: 'none', color: 'inherit' }}>
                                <i className="bi bi-pencil"></i>
                            </NavLink> 
                        </Button>
                    </Col>
                </div>
            )}
        </Draggable> */

export default TableBar;
