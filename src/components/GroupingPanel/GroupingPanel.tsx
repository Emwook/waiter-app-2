import React from "react";
import { Col, Dropdown } from 'react-bootstrap';
import { GroupingMethod } from "../../types/tableTypes";
import { dispatchGroupingMethodEvent } from "../../utils/events/eventDispatcher";

interface GroupingPanelProps {
    groupingMethod: GroupingMethod;
}

const GroupingPanel: React.FC<GroupingPanelProps> = ({ groupingMethod }) => {
    const possibleGroupingMethods: (GroupingMethod)[] = ['none', 'status', 'combined'];

    const handleSelect = (eventKey: string | null) => {
        if (eventKey) {
            dispatchGroupingMethodEvent(eventKey as GroupingMethod);
        }
    };

    return (
            <Col xs={3} className="mt-4 d-flex justify-content-start">
                <Dropdown className="w-100" onSelect={handleSelect}>
                    <Dropdown.Toggle variant="secondary" className="w-100 text-light text-center ml-auto" id="dropdown-basic">
                        Group by
                    </Dropdown.Toggle>
                    <Dropdown.Menu className="w-100 border-secondary ml-auto text-center">
                        {possibleGroupingMethods.map((possibleMethod: GroupingMethod) => (
                            <Dropdown.Item key={possibleMethod} eventKey={possibleMethod} active={groupingMethod === possibleMethod}>
                                {possibleMethod}
                            </Dropdown.Item>
                        ))}
                    </Dropdown.Menu>
                </Dropdown>
            </Col>
    );
};

export default GroupingPanel;
