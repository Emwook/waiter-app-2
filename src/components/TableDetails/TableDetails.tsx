import React, { useState, useEffect } from "react";
import { Form, Container, Button, Col, Row } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import StatusInput from "../StatusInput/StatusInput";
import PeopleInput from "../PeopleInput/PeopleInput";
import Loading from "../Loading/Loading";
import { mostNumOfPeople, leastNumOfPeople, maxBill, defaultNewTable } from "../../config/settings";
import BillInput from "../BillInput/BillInput";
import { Table, TableStatus } from "../../types/tableTypes";
import { useDispatch, useSelector } from "react-redux";
import { getAllTables, requestChangeTableDetails } from "../../store/reducers/tablesReducer";
import styles from './TableDetails.module.scss';
import MessageBox from "../MessageBox/MessageBox";
import { changeMessage } from "../../store/reducers/messageReducer";
import clsx from "clsx";

interface TableDetailsProps {
    tableNumber: number;
}

const TableDetails: React.FC<TableDetailsProps> = ({ tableNumber }) => {    
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const tables: Table[]  = useSelector(getAllTables);
    const table: Table = tables?.find(table => table.tableNumber === tableNumber) ?? defaultNewTable;
    const [loading, setLoading] = useState<boolean>(true);

    const [selectedStatus, setSelectedStatus] = useState<TableStatus>(defaultNewTable.status); 
    const [displayedNumOfPeople, setDisplayedNumOfPeople] = useState<number>(defaultNewTable.numOfPeople);
    const [displayedMaxNumOfPeople, setDisplayedMaxNumOfPeople] = useState<number>(defaultNewTable.maxNumOfPeople); 
    const [displayedBill, setDisplayedBill] = useState<number>(defaultNewTable.bill);
    const [displayedCombined, setDisplayedCombined] = useState<number[]>(defaultNewTable.combinedWith);
    const allCombined: number[] = [tableNumber, ...displayedCombined];
    let temp: number;
    for (let i = 0; i < allCombined.length; i++) {
        for (let j = 0; j < allCombined.length - 1 - i; j++) {
        if (allCombined[j] > allCombined[j + 1]) {
            temp = allCombined[j];
            allCombined[j] = allCombined[j + 1];
            allCombined[j + 1] = temp;
        }
        }
    }
    useEffect(() => {
        if (table) {
            setSelectedStatus(table.status);
            setDisplayedNumOfPeople(table.numOfPeople);
            setDisplayedMaxNumOfPeople(table.maxNumOfPeople);
            setDisplayedBill(table.bill);
            setDisplayedCombined(table.combinedWith);
            setLoading(false);
        }
    }, [table]);

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const tableToUpdate: Table = {
            tableNumber: table.tableNumber,
            status: selectedStatus,
            numOfPeople: displayedNumOfPeople,
            maxNumOfPeople: displayedMaxNumOfPeople,
            bill: displayedBill,
            combinedWith: displayedCombined,
        }
        const combinedTablesToUpdate: Table[] =[]
        for(let i=0; i<table.combinedWith.length; i++){
            const tableNumber = table.combinedWith[i];
            const combinedWith: number[] = tables?.find(table => table.tableNumber === tableNumber)?.combinedWith ?? defaultNewTable.combinedWith ;
            combinedTablesToUpdate.push({...tableToUpdate, tableNumber: tableNumber, combinedWith: combinedWith});
        }
        dispatch(requestChangeTableDetails(tableToUpdate) as any);
        for(let i=0; i<table.combinedWith.length; i++){
            dispatch(requestChangeTableDetails(combinedTablesToUpdate[i]) as any);
        }
        navigate('/');
    };

    const updateSelectedStatus = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const targetValue = (event.target.value);
        setSelectedStatus(targetValue as TableStatus);
        if (targetValue !== 'busy'){
            setDisplayedBill(0);
        }
    };

    const updateDisplayedNumOfPeople = (event: React.ChangeEvent<HTMLInputElement>) => {
        const targetValue = Number(event.target.value);
        if (targetValue >= leastNumOfPeople && targetValue <= mostNumOfPeople) {
            if (targetValue <= displayedMaxNumOfPeople) {
                setDisplayedNumOfPeople(targetValue)
            }
            else {
                setDisplayedNumOfPeople(displayedMaxNumOfPeople);
                dispatch(changeMessage(11) as any);
            }
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
        else {
            dispatch(changeMessage(12) as any);
        }
    };

    const updateDisplayedBill = (event: React.ChangeEvent<HTMLInputElement>) => {
        const targetValue = Number(event.target.value);
        if (!isNaN(targetValue) && targetValue <= maxBill) {
            setDisplayedBill(targetValue);
        }
        else if (isNaN(targetValue)){ 
            dispatch(changeMessage(13) as any);
        }
        else {
            dispatch(changeMessage(14) as any);
        }
    };

    if (loading) {
        return <Loading/>
    }
    
    return (
        <Container className="mt-4">
            <Row className={styles.messageBox}>
                <MessageBox/>
            </Row>
            <Row className="w-50">
                <Col xs={12} className={clsx(styles.detailsBox)}>
                {displayedCombined.length>0 
                ? (
                    <h2 className="fw-light fs-1 py-4" >{`combined tables:  ${allCombined}`}</h2> 
                )
                : (
                    <h2 className="py-4">Table {table?.tableNumber}</h2>
                )
                }
                <Form onSubmit={handleSubmit}>
                    <StatusInput
                        selectedStatus={selectedStatus}
                        inDetailsComponent={true}
                        table={table}
                        updateSelectedStatus={updateSelectedStatus}/>
                    <PeopleInput
                        selectedStatus={selectedStatus}
                        table={table}  
                        updateDisplayedNumOfPeople={updateDisplayedNumOfPeople}
                        updateDisplayedMaxNumOfPeople={updateDisplayedMaxNumOfPeople}
                        displayedNumOfPeople={displayedNumOfPeople}
                        displayedMaxNumOfPeople={displayedMaxNumOfPeople}/>
                    <BillInput
                        selectedStatus={selectedStatus}
                        table={table} 
                        displayedBill={displayedBill}
                        updateDisplayedBill={updateDisplayedBill}/>
                    <Button size="sm" variant="primary" type="submit">
                        Submit
                    </Button>
                </Form>
                </Col>
            </Row>
        </Container>
    );
}

export default TableDetails;
