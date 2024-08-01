import { Form, Col, Row } from "react-bootstrap";
import React from "react";
import { Table } from "../../../types/tableTypes";
import { useDispatch } from "react-redux";
import { changeMessage } from "../../../store/reducers/messageReducer";

interface PeopleInputProps {
    table: Table;
    updateDisplayedNumOfPeople: (event: React.ChangeEvent<HTMLInputElement>) => void;
    updateDisplayedMaxNumOfPeople: (event: React.ChangeEvent<HTMLInputElement>) => void;
    displayedNumOfPeople: number;
    displayedMaxNumOfPeople: number;
    selectedStatus: string;
}

const PeopleInput: React.FC<PeopleInputProps> = (
    { table, updateDisplayedNumOfPeople, 
        updateDisplayedMaxNumOfPeople,
        displayedNumOfPeople, displayedMaxNumOfPeople, selectedStatus 
        }) => {
    const dispatch = useDispatch();
    const handleDisabled = (e: any) => {
        if (selectedStatus !== 'busy') {
            dispatch(changeMessage(10) as any);
        }
    };  

    return (
        <Form.Group className="w-100">
            <Row className="my-2  ">
                <Col xs={5}><Form.Label className="fw-light fs-3 p-0">People: </Form.Label></Col>
                <Col xs={3} onMouseEnter={handleDisabled}>
                    <Form.Control 
                        type="number" 
                        size="sm" 
                        name={`numOfPeople${table.tableNumber}`}
                        className="border-dark text-center mt-2 fs-6" 
                        value = {(selectedStatus === 'busy')?(displayedNumOfPeople):(0)}
                        onChange={updateDisplayedNumOfPeople}
                        disabled={selectedStatus !== 'busy'}
                    />
                </Col>    
                <Col xs={1} className="mt-2 d-flex"><h2 className=" mt-0 mx-auto text-center lead">/</h2></Col>
                <Col xs={3}>
                    <Form.Control 
                        type="number" 
                        size="sm" 
                        name={`MaxNumOfPeople${table.tableNumber}`}
                        className={"border-dark text-center mt-2 fs-6"} 
                        value = {displayedMaxNumOfPeople}
                        onChange={updateDisplayedMaxNumOfPeople}
                    />
                </Col>    
            </Row>
        </Form.Group>
    );
}
export default PeopleInput;