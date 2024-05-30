import React, { useEffect, useState } from "react";
import { Row, Col, Button } from 'react-bootstrap';
import { NavLink } from "react-router-dom";
import { getDoc, doc } from "firebase/firestore";
import { db } from '../../config/firebase';
import { Table } from "../../types/tableType";

interface TableBarProps {
    id: string;
}

const TableBar: React.FC<TableBarProps> = ({ id }) => {
    const [tableData, setTableData] = useState<Table | undefined>(undefined);

    useEffect(() => {
        const fetchTableData = async () => {
            try {
                const tableRef = doc(db, "tables", id);
                const tableDoc = await getDoc(tableRef);

                if (tableDoc.exists()) {
                    const tableData = tableDoc.data() as Table;
                    setTableData(tableData);
                } else {
                    console.log("Document does not exist");
                }
            } catch (error) {
                console.error("Error fetching document:", error);
            }
        };
        fetchTableData();
    }, [id]); // Include id in the dependency array to re-run effect when id changes

    return (
        <li>
        <Row className="text-dark py-4 px-3 d-flex justify-content-between align-items-center border-bottom border-dark">
            <Col><h2>Table {tableData ? tableData.tableNumber : ''}</h2></Col>
            <Col><span className="text-muted">Status {tableData ? tableData.status : ''}</span></Col>
            <Col xs={8} className="d-flex justify-content-end">
                <Button variant="primary" className="border-light text-right ml-auto">
                    <NavLink to={tableData ? (`/table/${tableData.tableNumber}`): '/'} style={{ textDecoration: 'none', color: 'inherit' }}>
                        Show more
                    </NavLink> 
                </Button>
            </Col>
        </Row>
        </li>
    );
};

export default TableBar;
