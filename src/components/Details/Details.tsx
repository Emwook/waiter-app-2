import React from "react";
import { Form, Container, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import useTableByNumber from "../../utils/useTableByNumber";
import StatusInput from "../StatusInput/StatusInput";
import { Table } from "../../types/tableType"; // Import the Table type

interface DetailsProps {
    tableNumber: number;
}

const Details: React.FC<DetailsProps> = ({ tableNumber }) => {    
    const navigate = useNavigate();
    const table = useTableByNumber(tableNumber);
    const errorTable: Table = { id: '0000', tableNumber: 0, status: "busy", maxNumOfPeople: 0, numOfPeople: 0, bill: 0}; // Define a default value for Table

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        navigate('/');
    }
    
    return (
        <Container>
            <h1 className="py-4">Table {table?.tableNumber}</h1>
            <Form onSubmit={handleSubmit}>
                <Form.Group className="w-50">
                    <StatusInput table={table || errorTable}/>
                </Form.Group>
                <Button size="sm" variant="primary" type="submit">
                    Submit
                </Button>
            </Form>
        </Container>
    );
}

export default Details;
