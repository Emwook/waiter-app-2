import React, { useState, useEffect } from "react";
import { Form, Container, Button, Row, Col, ListGroup } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import StatusInput from "../../FormComponents/StatusInput/StatusInput";
import PeopleInput from "../../FormComponents/PeopleInput/PeopleInput";
import Loading from "../../SharedLayoutComponents/Loading/Loading";
import { mostNumOfPeople, leastNumOfPeople, maxBill, defaultNewTable } from "../../../config/settings";
import BillInput from "../../FormComponents/BillInput/BillInput";
import { Table, TableStatus } from "../../../types/tableTypes";
import { useDispatch, useSelector } from "react-redux";
import { getAllTables, requestChangeTableDetails, requestTableCombined } from "../../../store/reducers/tablesReducer";
import styles from './TableDetails.module.scss';
import MessageBox from "../../SharedLayoutComponents/MessageBox/MessageBox";
import { changeMessage } from "../../../store/reducers/messageReducer";
import combineTables from "../../../utils/combining/combineTables";
import { Reservation } from "../../../types/reservationTypes";
import { getAllReservations, requestReservationAdd } from "../../../store/reducers/reservationsReducer";
import { formatHour, parseFormattedHour } from "../../../utils/reservations/formatHour";
import moment from "moment";
import { generateReservationId } from "../../../utils/reservations/generateReservationId";
import { formatDate } from "../../../utils/reservations/dateUtils";
import ProductsForm from "../ProductsForm/ProductsForm";

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
    const [hour, setHour] = useState<string>('');
    const [hourEnd, setHourEnd] = useState<string>('');
    let temp: number;

    const disabledRes1 = ((selectedStatus === 'reserved')&&((hourEnd ==='')||(hour ==='')||(parseFormattedHour(hourEnd) <= parseFormattedHour(hour))))
    const disabledRes2 = (hourEnd ==='')||(hour ==='')||(parseFormattedHour(hourEnd) <= parseFormattedHour(hour));

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

    const { dateString: today } = formatDate(new Date());
    const resListThisTable: Reservation[] = useSelector(getAllReservations).filter((res: Reservation) => res.tableNumber === table.tableNumber);

    const resList = resListThisTable.filter(res => 
        (res.dateStart === today)
    );


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
       if(((selectedStatus ==='reserved') && (hour !=='') && (hourEnd !== '')) || (selectedStatus !=='reserved')) {
            dispatch(requestChangeTableDetails(tableToUpdate) as any);
            for(let i=0; i<table.combinedWith.length; i++){
                dispatch(requestChangeTableDetails(combinedTablesToUpdate[i]) as any);
            }
            navigate('/');
        }
    };

    const isBefore = (time1: string, time2: string) => {
        const parseAndFloorTime = (time: string) => {
            const [hoursStr, minutesStr] = time.split(':');
            let hours = parseInt(hoursStr, 10);
            let minutes = parseInt(minutesStr, 10);
            minutes = Math.floor(minutes / 15) * 15;
            return hours * 60 + minutes;
        };
        const totalMinutes1 = parseAndFloorTime(time1);
        const totalMinutes2 = parseAndFloorTime(time2);
    
        return totalMinutes1 < totalMinutes2;
    };

    const handleReserved = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault(); 
        const today = new Date();
        const date = moment(today).format("DD/MM/YY");
        const startHour = parseFormattedHour(hour);
        const duration = parseFormattedHour(hourEnd) - startHour;
        const newReservation: Reservation = {
            id: generateReservationId(),
            dateStart: date,
            hour: startHour,
            duration: duration,
            tableNumber: tableNumber,
            repeat: "false",
            name: '',
            details: '',
        };
        dispatch(requestReservationAdd(newReservation) as any);
        const { hour: timeNowNumber } = formatDate(today);
        const timeNowString = formatHour(timeNowNumber);
        if(isBefore(hour, timeNowString)){
            setSelectedStatus('reserved' as TableStatus)
            handleSubmit(e);
        }
    };
 

    const updateSelectedStatus = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const targetValue = (event.target.value);
        setSelectedStatus(targetValue as TableStatus);
        if (targetValue !== 'busy'){
            setDisplayedBill(0);
        }
        if(targetValue === 'reserved'){
            setHour('');
            setHourEnd('');
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

    const handleDecombine = () => {
        const filteredTables = tables.filter(t => t.combinedWith.includes(table.tableNumber));
        filteredTables.push(table);
        if (filteredTables.length > 1) {
            console.log('decombination : ', filteredTables);
            const tablesToCombine: Table[] = combineTables(filteredTables, tables);
            tablesToCombine.forEach(table => {
                dispatch(requestTableCombined(table) as any);
                setDisplayedCombined([]);
            });
        }
    };

    const handleHourChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const hourString = event.target.value;
        console.log('hour: ', hourString);
        setHour(hourString);
      };
    
    const handleHourEndChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const hourString = event.target.value;
        setHourEnd(hourString);
    };    

    // const handleButtonClick1 = () => {
    //     if(disabledRes1){
    //         dispatch(changeMessage(17) as any)
    //     }
    // }
    // const handleButtonClick2 = () => {
    //     if(disabledRes2){
    //         dispatch(changeMessage(17) as any)
    //     }
    // }

    if (loading) {
        return <Loading/>
    }
    
    return (
        <Container className="mt-4">
            <div className={styles.messageBox}>
                <MessageBox/>
            </div>
            <div className={styles.detailsBox}>
                <div className={styles.subBox}>
                    <Row>
                    <Col xs={6}>
                    {displayedCombined.length>0 
                    ? (
                        <h2 className="py-2" >{`combined tables:  ${allCombined}`}</h2> 
                    )
                    : (
                        <h2 className="py-2">Table {table?.tableNumber}</h2>
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
                        <Button variant="primary" type="submit" className="mt-2" disabled={disabledRes1}> {/*onMouseEnter={handleButtonClick1}*/}
                            Submit
                        </Button>
                        {displayedCombined.length>0 
                        && (
                        <Button variant="warning" className="mx-4 mt-2 text-light" onClick={handleDecombine}>
                            split
                        </Button>
                        )
                        }
                    </Form>
                    </Col>
                    {(selectedStatus === 'reserved')&& (
                    <>
                    <Col xs={5} className="mt-3">
                    <Form onSubmit={handleReserved}>
                        <Row className="justify-content-start text-center align-content-center mt-5">
                            <Col xs={4} className="px-1 m-0">
                                <Form.Control
                                type="time"
                                value={hour}
                                onChange={handleHourChange}
                                className="border-dark mt-2"
                                min="12:00"
                                max="24:00"
                                size='sm'
                                />
                            </Col>
                            <Col xs={2} className="d-flex"><p className="m-auto lead">-</p></Col>
                            <Col xs={4} className="px-0 m-0">
                                <Form.Control
                                type="time"
                                value={hourEnd}
                                onChange={handleHourEndChange}
                                className="border-dark mt-2"
                                min="12:00"
                                max="24:00"
                                size='sm'
                                />
                            </Col>
                            <Col xs={2} className="mt-2">
                                <Button variant="success" size='sm' className="text-light" type="submit" disabled={disabledRes2}> {/* onMouseEnter={handleButtonClick2}*/}
                                    <i className="bi bi-check"/>
                                </Button>
                            </Col>
                            </Row>
                            </Form>   
                        </Col>
                        </>)}
                    </Row>
                </div>
                {resList.length>0 &&
                <div className={styles.subBox}>
                    <h5>upcoming reservations</h5>
                    <ListGroup className={styles.scrollable}>
                        {resList.map(res => (
                        <ListGroup.Item key={res.id} className={`px-0 py-3 mx-2 border rounded-1 bg-white mt-2 border-gray`} onClick={() => navigate('/reservations')}>
                            <Row className="mx-1">
                                <Col xs={3} className="text-primary">{res.id}</Col>                       
                                <Col xs={3}>{(res.repeat !=='false')&&'from'} {res?.dateStart} </Col>
                                <Col xs={3}><span className="text-success">{(res.repeat !=='false') && res?.repeat} </span></Col>                       
                                <Col xs={3}>{formatHour(res?.hour)} - {formatHour(Number(res?.hour) + res?.duration)}</Col>
                            </Row>
                        </ListGroup.Item>
                    ))}
                    </ListGroup>
                </div>
                
                }
                <div className={styles.subBox}>
                    <ProductsForm/>
                </div>
            </div>
            
        </Container>
    );
}

export default TableDetails;
