import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Order, OrderItem } from '../../../types/orderItemTypes';
import { getOrder, requestChangeOrder, requestFetchOrderData } from '../../../store/reducers/orderReducer';
import { Button, Col, Row } from 'react-bootstrap';

interface TableOrderProps {
  disabled: boolean;
  tableNumber: number;
}

const TableOrder: React.FC<TableOrderProps> = ({ disabled, tableNumber }) => {
  const dispatch = useDispatch();
  
  useEffect(() => {
    dispatch(requestFetchOrderData(tableNumber) as any);
  }, [tableNumber, dispatch]);

  const order:Order = useSelector(getOrder as any);
  let total = 0;
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
      items: order.items.map(i => (i.code === item.code ? updatedItem : i)),
    };
  
    // Dispatch the action to request changing the order
    dispatch(requestChangeOrder(updatedOrder) as any);
  };

  const handleColor = (status: string) => {
    switch (status) {
      case 'ordered':
        return 'light';
      case 'cooking':
        return 'info';
      case 'to serve':
        return 'primary';
      case 'served':
        return 'warning';
      case 'paid':
        return 'success';
      default:
        return status;
    }
  };

  const handleItemDelete = (item: OrderItem) => {
    console.log('item code:', item.code);
  
    // Filter out the item with the matching code
    const newOrderItems = order.items.filter(i => i.code !== item.code);
    console.log('newOrderItems', newOrderItems);
    // Create the updated order object
    const updatedOrder = {
      ...order, // Spread the existing order to keep other properties
      items: newOrderItems, // Update the items array
    };
  
    // Dispatch the action to request changing the order
    dispatch(requestChangeOrder(updatedOrder) as any);
  };
  
  return (
    <div className="my-2 px-1" style={{ userSelect: 'none' }}>
      <h2 className="py-2">Order:</h2>
      <ul className='list-group list-group-flush w-100'>
        <li className='list-group-item'>
          <Row className='justify-content-between text-center'>
            <Col xs={6} className='text-start px-2'>Name</Col>
            <Col xs={2}>Amount</Col> 
            {/* <Col xs={2}>Status</Col> */}
            <Col xs={2}>Price</Col>
            <Col xs={2}> </Col>
          </Row>
        </li>
        {order.items?.map(item => (
          <li key={item.code} className={`list-group-item list-group-item-${handleColor(item.status)} py-1`} onDoubleClick={() => handleStatusChange(item)}>
            <Row className='justify-content-between text-center'>
              <Col xs={6} className='text-start'>
                <h6>{item.name}</h6>
                <div className='mx-1'>
                  {item.chosenParams?.map((param, index) => {
                    // Extract the parameter name and values
                    const [paramName, values] = Object.entries(param)[0];
                    const valuesString = Array.isArray(values) ? values.join(', ') : '';
                    return (
                      <div key={index}>
                        <b style={{fontSize: '14px'}}>{paramName}:</b><br/>
                        <p className='mx-1 my-0 p-0' style={{fontSize: '12px'}}>{valuesString}</p>
                      </div>
                    );
                  })}
                </div>
              </Col>
              <Col xs={2}>{item.amount}</Col> 
              {/* <Col xs={2}>{item.status}</Col> */}
              <Col xs={2}>{item ? ('$' + String(item.priceSingle * item.amount)) : ''}</Col>
              <Col xs={2}>
                <Button size="sm" className={`bg-${handleColor(item.status)} border-1 border-dark text-dark`} onClick={() => handleItemDelete(item)}>
                  <i className='bi bi-trash'/>
                </Button>
              </Col>
            </Row> 
          </li>
        ))}
        <li className='list-group-item'>
          <Row className='text-center'>
            <Col xs={8} className='text-end'><b>Total: </b></Col>
            <Col xs={1}><b>${total}</b></Col>
          </Row>
        </li>
      </ul>
    </div>
  );
};

export default TableOrder;
