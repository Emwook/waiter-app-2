import React from "react";
import { GroupingMethod, Table } from "../../../types/tableTypes";
import TableBar from "../TableBar/TableBar";

interface TableGroupProps {
    tables: Table[];
    groupingMethod: GroupingMethod;
}

const TableGroup:React.FC<TableGroupProps> = ({groupingMethod, tables}) =>{
  let color: string = 'secondary';
  if(groupingMethod === 'status'){
  switch( tables[0].status){
    case 'busy':
      color = 'danger';
      break;
    case 'free':
      color = 'success';
      break;
    case 'reserved':
      color = 'warning';
      break;
    case 'cleaning':
      color = 'info';
      break;
    default:
        break;
    }
  }
    return(
      <>
      <div className={`p-1 mx-1 mt-2 mb-4 border rounded border-${color}`}> 
        <span className={`position-absolute start-25 translate-middle bg-white px-2 text-${color}`}>{groupingMethod === 'status' && tables[0]?.status}</span>
        {tables.map((table, index) => (
          <TableBar Table={table} index={index} key={index}
          inGroupByStatus={(groupingMethod === 'status')?true:false} />))}
      </div>
      </>
       )
      }

export default TableGroup;