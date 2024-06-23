import React from "react";
import { GroupingMethod, Table } from "../../types/tableTypes";
import TableBar from "../TableBar/TableBar";

interface TableGroupProps {
    tables: Table[];
    groupingMethod: GroupingMethod;
}

const TableGroup:React.FC<TableGroupProps> = ({groupingMethod, tables}) =>{
  let borderStyle: string = 'border-dark';
  if(groupingMethod === 'status'){
  switch( tables[0].status){
    case 'busy':
      borderStyle = 'border-danger';
      break;
    case 'free':
      borderStyle = 'border-success';
      break;
    case 'reserved':
      borderStyle = 'border-warning';
      break;
    case 'cleaning':
      borderStyle = 'border-info';
      break;
    default:
        break;
    }
  }
    return(
      <div className={`p-1 mx-1 my-4 border rounded ${borderStyle}`}> 
        {tables.map((table, index) => (
          <TableBar Table={table} index={index} 
          inGroupByStatus={(groupingMethod === 'status')?true:false} />))}
      </div>
       )
      }

export default TableGroup;