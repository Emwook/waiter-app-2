import React from "react";
import { Form, Row, Col } from "react-bootstrap";
import { Table, TableStatus } from "../../types/tableTypes";
import { useDispatch } from "react-redux";
import { changeMessage } from "../../store/reducers/messageReducer";

interface BillInputProps {
    table: Table;
    updateDisplayedBill: (event: React.ChangeEvent<HTMLInputElement>) => void;
    displayedBill: number;
    selectedStatus: string;
}


const BillInput: React.FC<BillInputProps> = ({ table, displayedBill, updateDisplayedBill, selectedStatus }) => {
    const dispatch = useDispatch();
    const handleDisabled = (e: any) => {
        if (selectedStatus !== 'busy') {
            dispatch(changeMessage(15) as any);
        }
    };  
    return (
        <Form.Group className="w-100">
            <Row className="my-2">
                <Col xs={2}><Form.Label className="fw-light fs-3">Bill: </Form.Label></Col>
                <Col xs={1} className="mt-2 d-flex justify-content-end"><span className="fw-light fs-4">$</span></Col>
                <Col xs={5}  onMouseEnter={handleDisabled}>
                    <Form.Control 
                        type="number"
                        step="0.01" 
                        size="sm" 
                        name={`bill${table?.tableNumber}`}
                        className="border-dark text-center mt-2 fs-6" 
                        value={displayedBill} 
                        onChange={updateDisplayedBill}
                        disabled={selectedStatus !== 'busy'}
                    />
                </Col>    
            </Row>
        </Form.Group>
    )
}

export default BillInput;
