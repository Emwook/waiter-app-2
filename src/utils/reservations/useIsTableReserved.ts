import { useSelector } from 'react-redux';
import { formatDate } from './dateUtils';
import { Reservation } from '../../types/reservationTypes';
import { Table } from '../../types/tableTypes';
import { getAllReservations } from '../../store/reducers/reservationsReducer';

const useIsTableReserved = (table: Table): boolean => {
    const { dateString: today, hour: currentTime } = formatDate(new Date());
    const resListThisTable: Reservation[] = useSelector(getAllReservations).filter((res: Reservation) => res.tableNumber === table.tableNumber);

    const resListThisTableNow = resListThisTable.filter(res => 
        ((res.hour + res.duration) > currentTime) && (res.hour < currentTime) && (res.dateStart === today)
    );

    return resListThisTableNow.length > 0;
};

export default useIsTableReserved;
