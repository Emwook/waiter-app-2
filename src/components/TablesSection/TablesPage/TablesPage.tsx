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
import { getAllTables } from "../../../store/reducers/tablesReducer";
import { sortTables } from "../../../utils/sorting/sortTables";
import { getGroupingMethod, getSortingMethod } from "../../../store/reducers/methodsReducer";
import SelectModeButton from "../SelectModeButton/SelectModeButton";
import AlertBar from "../../SharedLayoutComponents/MessageBox/MessageBox";
//import AlertBar from "../AlertBar/AlertBar";

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


  return (
    <div>
      <Row className="align-content-end">
        <SortingPanel/>
        <GroupingPanel/>
        <AlertBar/>
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
      <Row>
      <ul className="mt-4 border-top border-dark">
                    <li>form checking in table form <i className="bi bi-check"></i></li>
                    <li>combination and decombination of tables  <i className="bi bi-check"></i></li>
                    <li>messages for wrong data insertion <i className="bi bi-check"></i></li>
                    <li>user authentication <i className="bi bi-dash"></i></li>
                    <li>log page of all changes done by a user<i className="bi bi-dash"></i></li>
                    <li>advanced details for a table page with logs of changes and list of products ordered<i className="bi bi-dash"></i></li>
                </ul>
      </Row>
    </div>
  );
};

export default TablesPage;
