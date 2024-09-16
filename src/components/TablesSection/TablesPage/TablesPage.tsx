import React from "react";
import { GroupingMethod, Table } from "../../../types/tableTypes";
import TableForm from "../TableForm/TableForm";
import SortingPanel from "../SortingPanel/SortingPanel";
import { Row } from "react-bootstrap";
import TableGroup from "../TableGroup/TableGroup";
import GroupingPanel from "../GroupingPanel/GroupingPanel";
import { getCombinedTables } from "../../../utils/grouping/getCombinedTables";
import { getStatusTables } from "../../../utils/grouping/getStatusTables";
import { useSelector } from "react-redux";
import { getAllTables, requestChangeTableDetails } from "../../../store/reducers/tablesReducer";
import { sortTables } from "../../../utils/sorting/sortTables";
import { getGroupingMethod, getSortingMethod } from "../../../store/reducers/methodsReducer";
import SelectModeButton from "../SelectModeButton/SelectModeButton";
import { formatDate } from "../../../utils/reservations/dateUtils";
import { Reservation } from "../../../types/reservationTypes";
import { getAllReservations } from "../../../store/reducers/reservationsReducer";
import { useDispatch } from "react-redux";
import MessageBox from "../../SharedLayoutComponents/MessageBox/MessageBox";

const TablesPage: React.FC = () => {
  const tablesData: Table[] = useSelector(getAllTables);
  const sortingMethod: keyof Table = useSelector(getSortingMethod);
  const groupingMethod: GroupingMethod = useSelector(getGroupingMethod);

  const tables = sortTables(tablesData, sortingMethod);
  
  const combinedTableGroups = getCombinedTables(tables);
  const statusTableGroups = getStatusTables(tables);
  const singleTables = combinedTableGroups.filter(group => group.length === 1).flat()
  const groupedTables = (groupingMethod === 'combined')
                        ?combinedTableGroups.filter(group => group.length > 1)
                        :statusTableGroups;
  //setting status to reserved if there is a reservation now for that table 
  const dispatch = useDispatch();                   
  const {dateString: today, hour: currentTime} = formatDate(new Date()); 
  const resListToday: Reservation[] = useSelector(getAllReservations).filter((res:Reservation) => res.dateStart === today);
  const filteredReservations = resListToday.filter(res => 
    (((res.hour + res.duration) > currentTime ) && (res.hour  < currentTime)));
  const tableNumberForResList: number[] = [];
  filteredReservations.forEach((res: Reservation) => {
    if (!tableNumberForResList.includes(res.tableNumber)) {
        tableNumberForResList.push(res.tableNumber);
    }
  });
  for(let i=0; i<tableNumberForResList.length; i++){
    const t: Table[] = (tables.filter(table => table.tableNumber === tableNumberForResList[i]))
    if(t.length>0 && t[0].status!== 'reserved'){ // tableNumber is unique
      const table:Table = {
        ...t[0],
        status: 'reserved',
      }
      dispatch(requestChangeTableDetails(table) as any)
    }
  }

  //setting status to cleaning if table is not asigned a reservation but its status is reserved 
  const tablesWithReservedStatus: Table[] = tables.filter(table => table.status === 'reserved');
  tablesWithReservedStatus.forEach((table: Table) => {
    if (!tableNumberForResList.includes(table.tableNumber)) {
      const newTable:Table = {
        ...table,
        status: 'cleaning',
      }
      dispatch(requestChangeTableDetails(newTable) as any)
    }
  });
  return (
    <div>
      <MessageBox/>
      <Row className="align-content-end">
        <SortingPanel/>
        <GroupingPanel/>
        <SelectModeButton/>
      </Row>
      <div className="my-4">
        {groupingMethod === 'none' ? (      
          <TableGroup tables={tables} groupingMethod='none' />
        ) : ((groupingMethod === 'combined')?(
          <>
            {groupedTables.map((group, index) => (
              <TableGroup key={`group-${index}`} tables={group} groupingMethod='combined' />
            ))}
            {singleTables.length > 0 && (
              <TableGroup key={'single-tables'} tables={singleTables} groupingMethod='none' />
            )}
          </>)
          :(
            <>
            {groupedTables.map((group, index) => (
              <TableGroup key={`group-${index}`} tables={group} groupingMethod='status'/>
            ))}
          </>)
          )
        }
      </div>
      <TableForm />
    </div>
  );
};

export default TablesPage;
