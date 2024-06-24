import React, { useState } from "react";
import { Col, Dropdown } from 'react-bootstrap';
import { GroupingMethod } from "../../types/tableTypes";
import { getGroupingMethod, setGrouping } from "../../store/reducers/methodsReducer";
import { useDispatch, useSelector } from "react-redux";

const GroupingPanel: React.FC = () => {
    const possibleGroupingMethods: (GroupingMethod)[] = ['none', 'status', 'combined'];
    const dispatch = useDispatch();
    const [groupingMethod, setGroupingMethod] = useState<GroupingMethod>(useSelector(getGroupingMethod));
    
    const handleSelect = (eventKey: string | null) => {
        const newGroupingMethod = eventKey as GroupingMethod;
        if(newGroupingMethod){
            setGroupingMethod(newGroupingMethod);
            dispatch(setGrouping(newGroupingMethod) as any);
        };
    }

    return (
            <Col xs={2} className="mt-4 d-flex justify-content-start">
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
