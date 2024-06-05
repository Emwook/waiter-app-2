import React from "react";
import { Row, Col, Dropdown } from 'react-bootstrap';
import { Table } from "../../types/tableType";
import { dispatchSortingMethodEvent } from "../../utils/eventDispatcher";

interface SortingPanelProps {
    sortingMethod: keyof Table;
}

const SortingPanel: React.FC<SortingPanelProps> = ({ sortingMethod }) => {
    const possibleMethods: (keyof Table)[] = ['tableNumber', 'status', 'numOfPeople', 'bill', 'maxNumOfPeople'];

    const handleSelect = (eventKey: string | null) => {
        if (eventKey) {
            dispatchSortingMethodEvent(eventKey as keyof Table);
        }
    };

    return (
        <Row className="p-0 mt-4 d-flex align-items-center">
            <Col xs={12} className="d-flex justify-content-start">
                <Dropdown className="w-25" onSelect={handleSelect}>
                    <Dropdown.Toggle variant="primary" className="w-100 border-light text-center ml-auto" id="dropdown-basic">
                        Sort by
                    </Dropdown.Toggle>
                    <Dropdown.Menu className="w-100 border-secondary ml-auto text-center">
                        {possibleMethods.map((possibleMethod: keyof Table) => (
                            <Dropdown.Item key={possibleMethod} eventKey={possibleMethod} active={sortingMethod === possibleMethod}>
                                {possibleMethod}
                            </Dropdown.Item>
                        ))}
                    </Dropdown.Menu>
                </Dropdown>
            </Col>
        </Row>
    );
};

export default SortingPanel;
