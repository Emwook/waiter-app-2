import { Row, Col, Form } from "react-bootstrap";
import React from "react";
import { possibleStatusList } from "../../../config/settings";
import { Table } from "../../../types/tableTypes";

interface StatusInputProps {
    inDetailsComponent: boolean;
    table: Table;
    updateSelectedStatus: (event: React.ChangeEvent<HTMLSelectElement>) => void;
    selectedStatus:string;
}

const StatusInput: React.FC<StatusInputProps> = ({ 
    table, updateSelectedStatus, 
    inDetailsComponent, selectedStatus }) => {

    return (
        <Form.Group className="w-100">
            <Row className="my-2">
                <Col xs={4}><Form.Label><h3 className="pt-2 lead">Status:</h3></Form.Label></Col>
                <Col xs={7}>
                    <Form.Select
                        onChange={updateSelectedStatus} 
                        name="status" data-bs-theme="light" 
                        size="sm" className="mt-2 fs-6" value={selectedStatus}>
                        {possibleStatusList.map(possibleStatus => 
                            <option key={possibleStatus}>
                                {possibleStatus}
                            </option>
                        )}
                    </Form.Select>
                </Col>
            </Row>
        </Form.Group>
    );
};

export default StatusInput;