import React from "react";

interface TableListProps {
    children: React.ReactNode;
    ref: any;
}

const TableList:React.FC<TableListProps> = ({children}) => {
return (
      <ul className="mt-1 px-3 list-unstyled">
        {children}
      </ul>
  );
};

export default TableList;
