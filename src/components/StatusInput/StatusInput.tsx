import { Row, Col, Form } from "react-bootstrap";
import React from "react";
import useTableByNumber from "../../utils/useTableByNumber";
import { possibleStatusList } from "../../config/settings";

interface StatusInputProps {
    tableNumber: number;
    updateSelectedStatus: (event: React.ChangeEvent<HTMLSelectElement>) => void;
}

const StatusInput: React.FC<StatusInputProps> = ({ tableNumber, updateSelectedStatus }) => {
    const table = useTableByNumber(tableNumber);

    return (
        <Form.Group className="w-50" onChange={updateSelectedStatus}>
        <Row className="my-2">
            <Col xs={3} md={3} lg={3}><Form.Label>Status:</Form.Label></Col>
            <Col xs={6} md={5} lg={4}>
                <Form.Select name="status" data-bs-theme="light" size="sm" className="border-dark">
                    {possibleStatusList.map(possibleStatus => 
                        <option 
                            selected = {possibleStatus === table?.status}
                            key={possibleStatus}
                            value={possibleStatus}>
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