import React from "react";
import { Form, Row, Col } from "react-bootstrap";
import { Table } from "../../types/tableType";

interface BillInputProps {
    table: Table;
    updateDisplayedBill: (event: React.ChangeEvent<HTMLInputElement>) => void;
    displayedBill: number;
}

const BillInput: React.FC<BillInputProps> = ({ table, displayedBill, updateDisplayedBill }) => {

    return (
        <Form.Group className="w-100">
            <Row className="my-2">
                <Col xs={2}><Form.Label>Bill: </Form.Label></Col>
                <Col xs={1}><span className="px-2 fs-5 text-center lead">$</span></Col>
                <Col xs={3} md={2}>
                    <Form.Control 
                        type="number"
                        step="0.01" 
                        size="sm" 
                        name={`bill${table?.tableNumber}`}
                        className="border-dark text-center" 
                        value={displayedBill} 
                        onChange={updateDisplayedBill}
                    />
                </Col>    
            </Row>
        </Form.Group>
    )
}

export default BillInput;
