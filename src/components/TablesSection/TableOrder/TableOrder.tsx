import React from 'react';
import { useSelector } from 'react-redux';
import { Order, OrderItem } from '../../../types/cartItemTypes';
import { getOrder, requestChangeOrder } from '../../../store/reducers/orderReducer';
import { Col, Row } from 'react-bootstrap';
import { useDispatch } from 'react-redux';

interface TableOrderProps {
  disabled: boolean;
  tableNumber: number;
}

const TableOrder: React.FC<TableOrderProps> = ({disabled, tableNumber}) => {
  const order: Order = useSelector(getOrder as any);
  const dispatch = useDispatch();
  let total: number = 0;
    order.items.forEach(item => {
        total += item.priceSingle * item.amount;
    });
    console.log(order, 'order');

    const handleStatusChange = (item: OrderItem) => {
      let newStatus: string;
    
      // Determine the new status based on the current status
      switch (item.status) {
        case 'ordered':
          newStatus = 'cooking';
          break;
        case 'cooking':
          newStatus = 'to serve';
          break;
        case 'to serve':
          newStatus = 'served';
          break;
        case 'served':
          newStatus = 'paid';
          break;
        default:
          newStatus = item.status;
          break;
      }
    
      // Create the updated item with the new status
      const updatedItem = { ...item, status: newStatus };
    
      // Update the items array with the updated item
      const updatedOrder = {
        tableNumber: order.tableNumber,
        items: order.items.map((i) => (i.code === item.code ? updatedItem : i)), //fix needed here 
      };
    
      // (Optional) Update the state or perform other actions with updatedOrder
      dispatch(requestChangeOrder(updatedOrder) as any);
    };
    
  return (
    <div className="my-2 px-3">
      
      <h2 className="py-2">order:</h2>
      <ul className='list-group w-100'>
        <li className='list-group-item '>
          <Row className='justify-content-between text-center'>
              <Col xs={7} className='text-start px-2'>name</Col>
              <Col xs={3}>amount</Col> 
              <Col>price</Col>
          </Row>
        </li>
      {order.items.map(item => (
        <li className='list-group-item' onClick={() => handleStatusChange(item)}>
          <Row className='justify-content-between text-center'>
            <Col xs={7} className='text-start'>{item.name}</Col>
            <Col xs={3}>{item.amount}</Col> 
            <Col>${item.priceSingle * item.amount}</Col>
          </Row> 
        </li>
      ))}
        <li className='list-group-item '>
          <Row className='text-center'>
            <Col xs={10} className='text-end'>total: </Col>
            <Col>${total}</Col>
          </Row>
        </li>
      </ul>
    </div>
  );
};

export default TableOrder;

