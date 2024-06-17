import React, { useState } from "react";
import { Col, Button, Form } from 'react-bootstrap';
import { NavLink } from "react-router-dom";
import { Table } from "../../types/tableTypes";
import RemoveTable from "../RemoveTable/RemoveTable";
//import { Draggable } from "react-beautiful-dnd";
import { dispatchSelectedTableEvent } from "../../utils/events/eventDispatcher";

interface TableBarProps {
    Table: Table;
    index: number;
    inGroupByStatus: boolean;
    selectMode: boolean;
}

const TableBar: React.FC<TableBarProps> = ({ Table, index, inGroupByStatus, selectMode }) => {
    const [selected, setSelected] = useState<boolean>(false);
    let borderStyle: string = 'border-dark';
    let textColor: string = 'text-dark';

    if(inGroupByStatus){
    switch( Table.status ){
        case 'busy':
            borderStyle = 'border-danger';
            textColor = 'text-danger';
            break;
        case 'free':
            borderStyle = 'border-success';
            textColor = 'text-success';
            break;
        case 'reserved':
            borderStyle = 'border-warning';
            textColor = 'text-warning';
            break;
        case 'cleaning':
            borderStyle = 'border-info';
            textColor = 'text-info';
            break;
        default:
            break;
        }
    }
    const handleSelect = () => {
        setSelected(!selected)
        dispatchSelectedTableEvent(Table);
    };

    return (
        <div className={`mt-1 pb-2 pt-4 px-3 d-flex justify-content-between align-items-center border-bottom
                        ${borderStyle} ${selected?'bg-light':'bg-none'}`}

        >
            {(selectMode) && (
            <Form className="mx-1">
                <Form.Check type="checkbox" onClick={handleSelect} />
            </Form>
            )}
            <Col xs={2} className={textColor}><h2>Table {Table ? Table.tableNumber : ''}</h2></Col>
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
