import React from "react";
import { Form, Row, Col } from "react-bootstrap";
import { Table } from "../../../types/tableTypes";
import { useDispatch } from "react-redux";
import { changeMessage } from "../../../store/reducers/messageReducer";
import useIsTableReserved from "../../../utils/reservations/useIsTableReserved";

interface BillInputProps {
    table: Table;
    updateDisplayedBill: (event: React.ChangeEvent<HTMLInputElement>) => void;
    displayedBill: number;
    selectedStatus: string;
}


const BillInput: React.FC<BillInputProps> = ({ table, displayedBill, updateDisplayedBill, selectedStatus }) => {
    const dispatch = useDispatch();
    const isNowReserved: boolean = useIsTableReserved(table);

    let toBeDisabled: boolean = false;
    if (selectedStatus !== 'busy' && selectedStatus !== 'reserved'){
        toBeDisabled = true;
    }
    else if(selectedStatus === 'reserved' && isNowReserved === false){
        toBeDisabled = true;
    }
    else{
        toBeDisabled = false;
    }
    const handleDisabled = (e: any) => {
        if (toBeDisabled) {
            dispatch(changeMessage(15) as any);
        }
    };  
    return (
        <Form.Group className="w-100">
            <Row className="my-2">
                <Col xs={4}><Form.Label><h3 className="pt-2 lead">Bill: </h3></Form.Label></Col>
                <Col xs={2} className=" d-flex justify-content-end"><h3 className="pt-2 lead">$</h3></Col>
                <Col xs={5}  onMouseEnter={handleDisabled}>
                    <Form.Control 
                        type="number"
                        step="0.01" 
                        size="sm" 
                        name={`bill${table?.tableNumber}`}
                        className="text-center fs-6" 
                        value={displayedBill} 
                        onChange={updateDisplayedBill}
                        disabled={toBeDisabled}
                    />
                </Col>    
            </Row>
        </Form.Group>
    )
}

export default BillInput;
