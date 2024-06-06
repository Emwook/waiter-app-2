import { Row, Col, Form } from "react-bootstrap";
import React from "react";
import useTableByNumber from "../../utils/store/useTableByNumber";
import { possibleStatusList } from "../../config/settings";

interface StatusInputProps {
    inDetailsComponent: boolean;
    tableNumber: number;
    updateSelectedStatus: (event: React.ChangeEvent<HTMLSelectElement>) => void;
}

const StatusInput: React.FC<StatusInputProps> = ({ 
    tableNumber, updateSelectedStatus, 
    inDetailsComponent }) => {
    const table = useTableByNumber(tableNumber);

    return (
        <Form.Group className="w-100" onChange={updateSelectedStatus}>
        <Row className="my-2">
            <Col xs={3} md={3} lg={3}><Form.Label>Status:</Form.Label></Col>
            <Col xs={6} md={5} lg={4}>
                <Form.Select 
                    name="status" data-bs-theme="light" 
                    size="sm" className="border-dark">
                    {possibleStatusList.map(possibleStatus => 
                        <option
                            defaultValue = {((inDetailsComponent === true) && (possibleStatus === table?.status))?possibleStatus:('free')}
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