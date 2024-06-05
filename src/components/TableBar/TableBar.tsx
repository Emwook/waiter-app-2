import React from "react";
import { Row, Col, Button } from 'react-bootstrap';
import { NavLink } from "react-router-dom";
import { Table } from "../../types/tableType";
import RemoveTable from "../RemoveTable/RemoveTable";

interface TableBarProps {
    Table: Table;
}

const TableBar: React.FC<TableBarProps> = ({ Table }) => {
    return (
            <Row className="text-dark pb-2 pt-5 px-3 d-flex justify-content-between align-items-center border-bottom border-dark">
                <Col xs={2}><h2>Table {Table ? Table.tableNumber : ''}</h2></Col>
                <Col><span className="text-muted">{Table ? Table.status : ''}</span></Col>
                <Col><span className="text-muted">${Table ? Table.bill : ''}</span></Col>
                <Col><span className="text-muted">{Table ? Table.numOfPeople : ''}/{Table ? Table.maxNumOfPeople : ''}</span></Col>
                <Col xs={6} className="d-flex justify-content-end">
                    <RemoveTable table= {Table}/>
                    <Button variant="primary" className="border-light text-right ml-auto">
                        <NavLink to={Table ? (`/table/${Table.tableNumber}`): '/'} style={{ textDecoration: 'none', color: 'inherit' }}>
                            <i className="bi bi-pencil"></i>
                        </NavLink> 
                    </Button>
                </Col>
            </Row>
    );
};

export default TableBar;
