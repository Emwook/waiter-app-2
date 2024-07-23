import React, { useState } from "react";
import { Row, Col, Button, Form } from 'react-bootstrap';
import { Table, TableStatus } from "../../../types/tableTypes";
import useNextTable from "../../../utils/sorting/useNextTable";
import { mostNumOfPeople, leastNumOfPeople, defaultNewTable } from "../../../config/settings";
import { useDispatch } from "react-redux";
import { requestTableAdd } from "../../../store/reducers/tablesReducer";
import { possibleStatusList } from "../../../config/settings";
import clsx from 'clsx';
import { changeMessage } from "../../../store/reducers/messageReducer";


const TableForm: React.FC = () => {
    const dispatch = useDispatch();
    const newTable: Table = defaultNewTable;
    const [selectedStatus, setSelectedStatus] = useState<TableStatus>(newTable.status); 
    const [displayedNumOfPeople, setDisplayedNumOfPeople] = useState<number>(newTable.numOfPeople);
    const [displayedMaxNumOfPeople, setDisplayedMaxNumOfPeople] = useState<number>(newTable.maxNumOfPeople);
    const nextTable: Table = useNextTable();
    const nextTableNumber = nextTable.tableNumber;

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const newTable: Table = {
            bill: 0,
            tableNumber: nextTableNumber,
            status: selectedStatus,
            numOfPeople: displayedNumOfPeople,
            maxNumOfPeople: displayedMaxNumOfPeople,
            combinedWith: []
        };
        dispatch(requestTableAdd(newTable) as any);
    };
    const handleDisabled = (e: any) => {
        if (selectedStatus !== 'busy') {
            dispatch(changeMessage(10) as any);
        }
    };

    const updateSelectedStatus = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedStatus(event.target.value as TableStatus);
    };

    const updateDisplayedNumOfPeople = (event: React.ChangeEvent<HTMLInputElement>) => {
        const targetValue = Number(event.target.value);
        if (targetValue >= leastNumOfPeople && targetValue <= mostNumOfPeople && selectedStatus === 'busy') {
            if (targetValue <= displayedMaxNumOfPeople) {
                setDisplayedNumOfPeople(targetValue);
            } else {
                setDisplayedNumOfPeople(displayedMaxNumOfPeople);
            }
        }
        else {
            setDisplayedNumOfPeople(0);
        }
    };

    const updateDisplayedMaxNumOfPeople = (event: React.ChangeEvent<HTMLInputElement>) => {
        const targetValue = Number(event.target.value);
        if (targetValue >= leastNumOfPeople && targetValue <= mostNumOfPeople) {
            if (targetValue <= displayedNumOfPeople) {
                setDisplayedNumOfPeople(targetValue);
            }
            setDisplayedMaxNumOfPeople(targetValue);
        }
    };
    
    return (
        <div className={`border rounded border-dark`}> 
            <Row className="`mt-1 pb-1 pt-3 px-3 d-flex justify-content-between align-items-center">
                <Col className="border-bottom border-dark">
                    <Form onSubmit={handleSubmit}>
                        <Row>
                            <Col xs={2} className="mt-1"><span className="h2 mt-2">Table {nextTableNumber}</span></Col>
                            <Col>
                                 <Form.Group className="w-100">
                                    <Row className="my-2">
                                    <Col xs={5}><Form.Label className="fw-light fs-4">Status:</Form.Label></Col>
                                        <Col xs={6} className="mr-3">
                                            <Form.Select
                                                onChange={updateSelectedStatus} 
                                                name="status" data-bs-theme="light" 
                                                size="sm" className="border-dark mt-1" value={selectedStatus}>
                                                {possibleStatusList.map(possibleStatus => 
                                                    <option key={possibleStatus}>
                                                        {possibleStatus}
                                                    </option>
                                                )}
                                            </Form.Select>
                                        </Col>
                                    </Row>
                                </Form.Group>
                            </Col>
                            <Col>
                                <Form.Group className="w-100">
                                    <Row className="my-2  ">
                                        <Col xs={4}><Form.Label className="fw-light fs-4 p-0 mr-2">People: </Form.Label></Col>
                                        <Col xs={3} onMouseEnter={handleDisabled}>
                                            <Form.Control 
                                                type="number" 
                                                size="sm" 
                                                name={`numOfPeople${nextTable.tableNumber}`}
                                                className={clsx("border-dark text-center mt-1")}
                                                value = {(selectedStatus === 'busy')?(displayedNumOfPeople):(0)}
                                                onChange={updateDisplayedNumOfPeople}
                                                disabled={selectedStatus !== 'busy'}
                                            />
                                        </Col>    
                                        <Col xs={1} className="mt-1 mr-1 d-flex"><span className="h-100 mx-auto w-100 px-1 text-center lead">/</span></Col>
                                        <Col xs={3} className=" ">
                                            <Form.Control 
                                                type="number" 
                                                size="sm" 
                                                name={`MaxNumOfPeople${nextTable.tableNumber}`}
                                                className={"border-dark text-center mt-1"} 
                                                value = {displayedMaxNumOfPeople}
                                                onChange={updateDisplayedMaxNumOfPeople}
                                            />
                                        </Col>    
                                    </Row>
                                </Form.Group>
                            </Col>
                            <Col className="d-flex justify-content-end align-content-center">
                                <Button size="lg" variant="primary" type="submit" className="py-1 my-auto border-light text-right ml-auto">
                                    <i className="bi bi-plus"/>
                                </Button>
                            </Col>
                        </Row>
                    </Form>
                </Col>
            </Row>
        </div>
    );
};

export default TableForm;
