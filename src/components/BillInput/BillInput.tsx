import React from "react";
import { Form, Row, Col } from "react-bootstrap";
import { Table } from "../../types/tableTypes";

interface BillInputProps {
    table: Table;
    updateDisplayedBill: (event: React.ChangeEvent<HTMLInputElement>) => void;
    displayedBill: number;
}

const BillInput: React.FC<BillInputProps> = ({ table, displayedBill, updateDisplayedBill }) => {

    return (
        <Form.Group className="w-100">
            <Row className="my-2">
                <Col xs={1}><Form.Label className="fw-light fs-3">Bill: </Form.Label></Col>
                <Col xs={1} className="mt-2 d-flex justify-content-end"><span className="fw-light fs-4">$</span></Col>
                <Col xs={3} >
                    <Form.Control 
                        type="number"
                        step="0.01" 
                        size="sm" 
                        name={`bill${table?.tableNumber}`}
                        className="border-dark text-center mt-2 fs-6" 
                        value={displayedBill} 
                        onChange={updateDisplayedBill}
                    />
                </Col>    
            </Row>
        </Form.Group>
    )
}

export default BillInput;
