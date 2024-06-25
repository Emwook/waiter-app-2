import React from "react";
import { GroupingMethod, Table } from "../../types/tableTypes";
import TableForm from "../TableForm/TableForm";
import SortingPanel from "../SortingPanel/SortingPanel";
import { Row } from "react-bootstrap";
import TableGroup from "../TableGroup/TableGroup";
import GroupingPanel from "../GroupingPanel/GroupingPanel";
import { getCombinedTables } from "../../utils/grouping/getCombinedTables";
import { getStatusTables } from "../../utils/grouping/getStatusTables";
import { useSelector } from "react-redux";
import { getAllTables } from "../../store/reducers/tablesReducer";
import { sortTables } from "../../utils/sorting/sortTables";
import { getGroupingMethod, getSortingMethod } from "../../store/reducers/methodsReducer";
import SelectModeButton from "../SelectModeButton/SelectModeButton";
//import AlertBar from "../AlertBar/AlertBar";

const Home: React.FC = () => {
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
      <Row>
        <SortingPanel/>
        <GroupingPanel/>
        {/*<AlertBar/>*/}
        <SelectModeButton/>
      </Row>
      <div>
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
        {/*<CombineTablesForm />*/}
      </Row>
    </div>
  );
};

export default Home;
