import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Order, OrderItem } from '../../../types/cartItemTypes';
import { getOrder, requestChangeOrder, requestFetchOrderData } from '../../../store/reducers/orderReducer';
import { Button, Col, Row } from 'react-bootstrap';
import { useDispatch } from 'react-redux';

interface TableOrderProps {
  disabled: boolean;
  tableNumber: number;
}

const TableOrder: React.FC<TableOrderProps> = ({disabled, tableNumber}) => {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(requestFetchOrderData(tableNumber) as any)
}, [tableNumber, dispatch]);

  const order: Order = useSelector(getOrder as any);
  let total: number = 0;
    order.items.forEach(item => {
        total += item.priceSingle * item.amount;
    });

    const handleStatusChange = (item: OrderItem) => {
      let newStatus: string;
    
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
        case 'paid':
          newStatus = 'ordered';
          break;
        default:
          newStatus = item.status;
          break;
      }
    
      const updatedItem = { ...item, status: newStatus };
    
      // Update the items array with the updated item
      const updatedOrder = {
        tableNumber: order.tableNumber,
        items: order.items.map((i) => (i.code === item.code ? updatedItem : i)),
      };
    
      // (Optional) Update the state or perform other actions with updatedOrder
      dispatch(requestChangeOrder(updatedOrder) as any);
    };

    const handleColor = (status:string) => {
      let color:string;
      switch (status) {
        case 'ordered':
          color = 'light';
          break;
        case 'cooking':
          color = 'info';
          break;
        case 'to serve':
          color = 'primary';
          break;
        case 'served':
          color = 'warning';
          break;
        case 'paid':
          color = 'success';
          break;
        default:
          color = status;
          break;
      }
      return ('list-group-item-'+color);
    };

    const handleItemDelete = (item: OrderItem) => {
      console.log('item code:', item.code);
    
      // Filter out the item with the matching code
      const newOrderItems: OrderItem[] = order.items.filter(i => i.code !== item.code);
    console.log('newOrderItems',newOrderItems);
      // Create the updated order object
      const updatedOrder: Order = {
        ...order, // Spread the existing order to keep other properties
        items: newOrderItems, // Update the items array
      };
    
      // Dispatch the action to request changing the order
      dispatch(requestChangeOrder(updatedOrder) as any);
    };
    
    
  return (
    <div className="my-2 px-1">
      <h2 className="py-2">order:</h2>
      <ul className='list-group list-group-flush w-100'>
        <li className='list-group-item '>
          <Row className='justify-content-between text-center'>
              <Col xs={3} className='text-start px-2'>name</Col>
              <Col xs={3}>amount</Col> 
              <Col xs={3}>status</Col> 
              <Col xs={2}>price</Col>
              <Col xs={1}> </Col>
          </Row>
        </li>
      {order.items?.map(item => (
        <li className={`list-group-item ${handleColor(item.status)}`} onDoubleClick={() => handleStatusChange(item)}>
          <Row className='justify-content-between text-center'>
            <Col xs={3} className='text-start'>{item.name}</Col>
            <Col xs={3}>{item.amount}</Col> 
            <Col xs={2}>{item.status}</Col> 
            <Col xs={2}>{item?('$' + String(item.priceSingle * item.amount)):''}</Col>
            <Col xs={2}>
              <Button size="sm" className='bg-light border-1 border-dark text-dark' onClick={() => handleItemDelete(item)}>
                <i className='bi bi-trash'/>
              </Button>
            </Col>
          </Row> 
        </li>
      ))}
        <li className='list-group-item '>
          <Row className='text-center'>
            <Col xs={9} className='text-end'>total: </Col>
            <Col xs={1}>${total}</Col>
          </Row>
        </li>
      </ul>
    </div>
  );
};

export default TableOrder;

