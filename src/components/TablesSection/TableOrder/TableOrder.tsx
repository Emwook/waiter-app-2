import React from 'react';
import { useSelector } from 'react-redux';
import { Order } from '../../../types/cartItemTypes';
import { getOrder } from '../../../store/reducers/orderReducer';
import { Col, Row } from 'react-bootstrap';

interface TableOrderProps {
  disabled: boolean;
  tableNumber: number;
}

const TableOrder: React.FC<TableOrderProps> = ({disabled, tableNumber}) => {
  const order: Order = useSelector(getOrder as any);

  return (
    <div className="mt-1 px-3">
      <h2 className="py-2">order:</h2>
      <Row className='justify-content-between text-center mb-3 border-bottom'>
          <Col xs={7}>name</Col>
          <Col xs={3}>amount</Col> 
          <Col>price</Col>
      </Row>
      {order.items.map(item => (
        <Row className='justify-content-between text-center'>
          <Col xs={7}>{item.name}</Col>
          <Col xs={3}>{item.amount}</Col> 
          <Col>{item.priceSingle * item.amount}$</Col>
        </Row>
      ))}
    </div>
  );
};

export default TableOrder;

