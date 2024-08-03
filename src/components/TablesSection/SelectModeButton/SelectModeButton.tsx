import React from "react";
import { Col } from 'react-bootstrap';
import { Button } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { checkSelectMode, enterSelect, getSelected } from "../../../store/reducers/selectModeReducer";
import { Table } from "../../../types/tableTypes";
import { requestTableCombined, getAllTables, requestTableRemove } from "../../../store/reducers/tablesReducer";
import combineTables from "../../../utils/combining/combineTables";
import { getAllReservations, requestReservationAdd } from "../../../store/reducers/reservationsReducer";
import { formatDate } from "../../../utils/reservations/dateUtils";
import { Reservation } from "../../../types/reservationTypes";
import { generateReservationId } from "../../../utils/reservations/generateReservationId";

const SelectModeButton: React.FC = () => {
    const dispatch = useDispatch();
    const selectMode = useSelector(checkSelectMode);
    const selectedTables: Table[] = useSelector(getSelected);
    const tableList = useSelector(getAllTables);
    const {dateString: today, hour: currentTime} = formatDate(new Date()); 
    const resListToday: Reservation[] = useSelector(getAllReservations).filter((res:Reservation) => res.dateStart === today);

    const toggleSelect = () => {
        dispatch(enterSelect() as any);
    }

    const handleCombine = () => {
        let amountOfReservations:number = 0;
        let tableWithReservation: Table;
        if (selectedTables.length > 1) {
            const tablesToCombine: Table[] = combineTables(selectedTables, tableList);
            tablesToCombine.forEach(table => {
                dispatch(requestTableCombined(table) as any);
                if(table.status === 'reserved'){
                    amountOfReservations++;
                    tableWithReservation = table;
                }
            });
            if(amountOfReservations === 1){
                const filteredReservations = resListToday.filter(res => 
                    (res.tableNumber === tableWithReservation.tableNumber) &&
                    ((res.hour + res.duration) > currentTime)
                );
                // Find the reservation with the smallest (res.hour - currentTime)
                const mainReservation = filteredReservations.reduce<{ reservation: Reservation, diff: number } | null>((closest, res) => {
                    const diff = res.hour - currentTime;
                    if (!closest || diff < closest.diff) {
                        return { reservation: res, diff: diff };
                    }
                    return closest;
                }, null)?.reservation || null;
                if(mainReservation){ 
                    tablesToCombine.forEach(table => {
                        if(table.tableNumber !== tableWithReservation.tableNumber){
                            const newReservation: Reservation = {
                                id: generateReservationId(),
                                dateStart: mainReservation.dateStart,
                                hour: mainReservation.hour,
                                duration: mainReservation.duration,
                                tableNumber: table.tableNumber,
                                repeat: mainReservation.repeat,
                                name: mainReservation.name,
                                details:`a copy of reservation ${mainReservation.id}, made by joining with table ${mainReservation.tableNumber}`,
                            };
                            dispatch(requestReservationAdd(newReservation) as any);
                        }
                    });
                }
            }
        }
        
        dispatch(enterSelect() as any);
    };    

    const handleRemove = () => {
        selectedTables.forEach(table => {
            dispatch(requestTableRemove(table) as any);
        });
        dispatch(enterSelect() as any);
    };

    return (
        <Col className="mt-4 d-flex justify-content-end">
            {selectMode && (
                <>
                    <Button variant='success' className={`border mx-1 ${selectMode ? 'border-light' : 'border-primary'}`} onClick={handleCombine} >
                        <i className="bi bi-link"></i>
                    </Button>
                    <Button variant='danger' className={`border mx-1 ${selectMode ? 'border-light' : 'border-primary'}`} onClick={handleRemove}>
                        <i className="bi bi-trash"></i>
                    </Button>
                </>
            )}
            <Button className={`ml-3 border ${selectMode ? 'border-light' : 'border-primary'}`} variant={selectMode ? 'primary' : 'light'} onClick={toggleSelect}>
                Select
            </Button>
            
        </Col>
    );
};

export default SelectModeButton;
