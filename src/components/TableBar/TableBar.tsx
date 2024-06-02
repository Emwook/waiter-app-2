import React from "react";
import { Row, Col, Button } from 'react-bootstrap';
import { NavLink } from "react-router-dom";
import { Table } from "../../types/tableType";

interface TableBarProps {
    Table: Table;
}

const TableBar: React.FC<TableBarProps> = ({ Table }) => {
    return (
            <Row className="text-dark py-4 px-3 d-flex justify-content-between align-items-center border-bottom border-dark">
                <Col><h2>Table {Table ? Table.tableNumber : ''}</h2></Col>
                <Col><span className="text-muted">Status: {Table ? Table.status : ''}</span></Col>
                <Col xs={8} className="d-flex justify-content-end">
                    <Button variant="primary" className="border-light text-right ml-auto">
                        <NavLink to={Table ? (`/table/${Table.tableNumber}`): '/'} style={{ textDecoration: 'none', color: 'inherit' }}>
                            Show more
                        </NavLink> 
                    </Button>
                </Col>
            </Row>
    );
};

export default TableBar;
