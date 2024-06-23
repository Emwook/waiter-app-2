import React, { useState } from "react";
import { Col, Dropdown } from 'react-bootstrap';
import { Table } from "../../types/tableTypes";
import { useDispatch } from "react-redux";
import { getSortingMethod, setSorting } from "../../store/reducers/methodsReducer";
import { useSelector } from "react-redux";

const SortingPanel: React.FC= () => {
    const possibleSortingMethods: (keyof Table)[] = ['tableNumber', 'status', 'numOfPeople', 'bill', 'maxNumOfPeople'];
    const dispatch = useDispatch();
    const [sortingMethod, setSortingMethod] = useState<keyof Table>(useSelector(getSortingMethod));
    
    const handleSelect = (eventKey: string | null) => {
        const newSortingMethod = eventKey as keyof Table;
        if(newSortingMethod) {
            setSortingMethod(newSortingMethod);
            dispatch(setSorting(newSortingMethod) as any);
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
