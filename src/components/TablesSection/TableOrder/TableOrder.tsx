import React from 'react';
import { useSelector } from 'react-redux';
import { Order } from '../../../types/cartItemTypes';
import { fetchOrderData } from '../../../store/reducers/orderReducer';

interface TableOrderProps {
  disabled: boolean;
  tableNumber: number;
}

const TableOrder: React.FC<TableOrderProps> = ({disabled, tableNumber}) => {
  const order: Order = useSelector(fetchOrderData(tableNumber) as any);

  return (
    <div className="mt-1 px-3">
      <h2 className="py-2">order:</h2>
      <h5>{order.tableNumber}</h5>
    </div>
  );
};

export default TableOrder;

