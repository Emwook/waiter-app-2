import { Row, Col, Form } from "react-bootstrap";
import React, { useState } from "react";
import { Table } from "../../types/tableType";
import { updateTable } from "../../utils/UpdateTableStatus";

interface StatusInputProps {
    table: Table;
}

const StatusInput: React.FC<StatusInputProps> = ({ table }) => {
    const [status, setStatus] = useState(table?.status);
    const possibleStatus = ['free', 'busy', 'cleaning', 'reserved'];

    const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const newStatus = event.target.value;
        updateTable(table.id, { status: newStatus });
        setStatus(newStatus);
        console.log(newStatus);
    };
    //bug that displayed status on entering details stays as 'busy', not the actual value
    return (
        <Row className="my-2">
            <Col xs={3} md={3} lg={3}><Form.Label>Select:</Form.Label></Col>
            <Col xs={6} md={5} lg={4}>
                <Form.Select name="status" data-bs-theme="light" size="sm" className="border-dark" value={status} onChange={handleChange}>
                    {possibleStatus.map(possibleStatus => 
                        <option 
                            key={possibleStatus}
                            value={possibleStatus}>
                            {possibleStatus}
                        </option>
                    )}
                </Form.Select>
            </Col>
        </Row>
    );
};

export default StatusInput;