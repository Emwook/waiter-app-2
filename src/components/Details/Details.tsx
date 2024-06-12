import React, { useState, useEffect } from "react";
import { Form, Container, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import useTables from "../../utils/store/useTables";
import StatusInput from "../StatusInput/StatusInput";
import { updateTable } from "../../utils/store/UpdateTable";
import PeopleInput from "../PeopleInput/PeopleInput";
import Loading from "../Loading/Loading";
import { mostNumOfPeople, leastNumOfPeople, maxBill, defaultNewTable } from "../../config/settings";
import BillInput from "../BillInput/BillInput";
import { Table } from "../../types/tableType";

interface DetailsProps {
    tableNumber: number;
}

const Details: React.FC<DetailsProps> = ({ tableNumber }) => {    
    const navigate = useNavigate();
    const { tables } = useTables();
    const table: Table = tables?.find(table => table.tableNumber === tableNumber) ?? defaultNewTable;
    const [loading, setLoading] = useState<boolean>(true);

    const [selectedStatus, setSelectedStatus] = useState<string>('busy'); 
    const [displayedNumOfPeople, setDisplayedNumOfPeople] = useState<number>(0);
    const [displayedMaxNumOfPeople, setDisplayedMaxNumOfPeople] = useState<number>(1); 
    const [displayedBill, setDisplayedBill] = useState<number>(0); 

    useEffect(() => {
        if (table) {
            setSelectedStatus(table.status || 'busy');
            setDisplayedNumOfPeople(table.numOfPeople || 0);
            setDisplayedMaxNumOfPeople(table.maxNumOfPeople || 0);
            setDisplayedBill(table.bill || 0);
            setLoading(false);
        }
    }, [table]);

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        updateTable(tableNumber, { status: selectedStatus, numOfPeople: displayedNumOfPeople, maxNumOfPeople: displayedMaxNumOfPeople, bill: displayedBill });
        navigate('/');
    };

    const updateSelectedStatus = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedStatus(event.target.value);
    };

    const updateDisplayedNumOfPeople = (event: React.ChangeEvent<HTMLInputElement>) => {
        const targetValue = Number(event.target.value);
        if (targetValue >= leastNumOfPeople && targetValue <= mostNumOfPeople) {
            if (targetValue <= displayedMaxNumOfPeople) {
                setDisplayedNumOfPeople(targetValue)
            }
            else {
                setDisplayedNumOfPeople(displayedMaxNumOfPeople);
            }
        }
    };

    const updateDisplayedMaxNumOfPeople = (event: React.ChangeEvent<HTMLInputElement>) => {
        const targetValue = Number(event.target.value);
        if (targetValue >= leastNumOfPeople && targetValue <= mostNumOfPeople) { 
            if (targetValue <= displayedNumOfPeople) {
                setDisplayedNumOfPeople(targetValue)
            }
            setDisplayedMaxNumOfPeople(targetValue);
        }
    };

    const updateDisplayedBill = (event: React.ChangeEvent<HTMLInputElement>) => {
        const targetValue = Number(event.target.value);
        if (!isNaN(targetValue) && targetValue <= maxBill) {
            setDisplayedBill(targetValue);
        }
    };

    if (loading) {
        return <Loading/>
    }
    
    return (
        <Container>
            <h1 className="py-4">Table {table?.tableNumber}</h1>
            <Form onSubmit={handleSubmit}>
                <StatusInput
                    inDetailsComponent={true}
                    table={table}
                    updateSelectedStatus={updateSelectedStatus}/>
                <PeopleInput
                    table={table}  
                    updateDisplayedNumOfPeople={updateDisplayedNumOfPeople}
                    updateDisplayedMaxNumOfPeople={updateDisplayedMaxNumOfPeople}
                    displayedNumOfPeople={displayedNumOfPeople}
                    displayedMaxNumOfPeople={displayedMaxNumOfPeople}/>
                <BillInput
                    table={table} 
                    displayedBill={displayedBill}
                    updateDisplayedBill={updateDisplayedBill}/>
                <Button size="sm" variant="primary" type="submit">
                    Submit
                </Button>
            </Form>
        </Container>
    );
}

export default Details;
