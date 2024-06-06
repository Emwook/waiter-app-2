import { Form, Col, Row } from "react-bootstrap";
import React from "react";

interface PeopleInputProps {
    tableNumber: number;
    updateDisplayedNumOfPeople: (event: React.ChangeEvent<HTMLInputElement>) => void;
    updateDisplayedMaxNumOfPeople: (event: React.ChangeEvent<HTMLInputElement>) => void;
    displayedNumOfPeople: number;
    displayedMaxNumOfPeople: number;
    
}

const PeopleInput: React.FC<PeopleInputProps> = (
    { tableNumber, updateDisplayedNumOfPeople, 
        updateDisplayedMaxNumOfPeople,
        displayedNumOfPeople, displayedMaxNumOfPeople, 
        }) => {

    return (
        <Form.Group className="w-100">
            <Row className="my-2">
                <Col xs={3}><Form.Label>People: </Form.Label></Col>
                <Col xs={3} md={2}>
                    <Form.Control 
                        type="number" 
                        size="sm" 
                        name={`numOfPeople${tableNumber}`}
                        className="border-dark text-center" 
                        value = {displayedNumOfPeople}
                        onChange={updateDisplayedNumOfPeople}
                    />
                </Col>    
                <Col xs={1}><span className="px-2 fs-5 text-center lead">/</span></Col>
                <Col xs={3} md={2}>
                    <Form.Control 
                        type="number" 
                        size="sm" 
                        name={`MaxNumOfPeople${tableNumber}`}
                        className="border-dark text-center" 
                        value = {displayedMaxNumOfPeople}
                        onChange={updateDisplayedMaxNumOfPeople}
                    />
                </Col>    
            </Row>
        </Form.Group>
    );
}
export default PeopleInput;