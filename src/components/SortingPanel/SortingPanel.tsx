import React from "react";
import { Col, Dropdown } from 'react-bootstrap';
import { Table } from "../../types/tableTypes";
import { dispatchSortingMethodEvent } from "../../utils/events/eventDispatcher";

interface SortingPanelProps {
    sortingMethod: keyof Table;
}

const SortingPanel: React.FC<SortingPanelProps> = ({ sortingMethod }) => {
    const possibleSortingMethods: (keyof Table)[] = ['tableNumber', 'status', 'numOfPeople', 'bill', 'maxNumOfPeople'];

    const handleSelect = (eventKey: string | null) => {
        if (eventKey) {
            dispatchSortingMethodEvent(eventKey as keyof Table);
        }
    };

    return (
            <Col xs={3} className="mt-4 d-flex justify-content-start">
                <Dropdown className="w-100" onSelect={handleSelect}>
                    <Dropdown.Toggle variant="light" className="w-100 border-secondary text-center ml-auto" id="dropdown-basic">
                        Sort by
                    </Dropdown.Toggle>
                    <Dropdown.Menu className="w-100 border-secondary ml-auto text-center">
                        {possibleSortingMethods.map((possibleMethod: keyof Table) => (
                            <Dropdown.Item key={possibleMethod} eventKey={possibleMethod} active={sortingMethod === possibleMethod}>
                                {possibleMethod}
                            </Dropdown.Item>
                        ))}
                    </Dropdown.Menu>
                </Dropdown>
            </Col>
    );
};

export default SortingPanel;
