import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Order, OrderItem } from '../../../types/orderItemTypes';
import { getOrders, requestChangeOrder, requestFetchSingleOrder, requestOrderRemove } from '../../../store/reducers/orderReducer';
import { Button, Col, Row } from 'react-bootstrap';
import { mockOrder } from '../../../config/settings';
import { Table } from '../../../types/tableTypes';
import { requestChangeTableDetails } from '../../../store/reducers/tablesReducer';

interface TableOrderProps {
  disabled: boolean;
  table: Table;
}

const TableOrder: React.FC<TableOrderProps> = ({ disabled, table }) => {
  const dispatch = useDispatch();
  const tableNumber = table.tableNumber;
  const orders: Order[] = useSelector(getOrders as any);  
  
  const [order, setOrder] = useState<Order>(orders.filter(o => o.tableNumber === tableNumber)[0] || mockOrder);

  useEffect(() => {
    const currentOrder = orders.filter(o => o.tableNumber === tableNumber)[0] || mockOrder;
    setOrder(currentOrder);
  }, [orders, tableNumber]);

  let total = 0;
  order?.items?.forEach(item => {
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
  
    dispatch(requestChangeOrder(updatedOrder) as any);
    dispatch(requestFetchSingleOrder(tableNumber) as any);
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
    const orderUpdated: Order = {
      ...order,
      items: order.items.filter(i => i.code !== item.code),
    } 
    if(orderUpdated.items.length>0){
      dispatch(requestChangeOrder(orderUpdated) as any);
    }
    else {
      dispatch(requestOrderRemove(orderUpdated) as any);
    }
    const oldBill = table.bill;
    const newTable:Table = {
      ...table,
      bill: (oldBill - (item.priceSingle * item.amount)),
    }    
    dispatch(requestChangeTableDetails(newTable) as any);
    setOrder(orderUpdated);
  };
  
  
  return (
    <div className="my-2 px-1" style={{ userSelect: 'none' }}>
      <h2 className="py-2">ordered:</h2>
      <ul className='list-group list-group-flush w-100'>
        <li className='list-group-item'>
          <Row className='justify-content-between text-center'>
            <Col xs={3} className='text-start px-2'>Name</Col>
            <Col xs={4}>Amount</Col> 
            <Col xs={3}>Price</Col>
            <Col xs={1}> </Col>
          </Row>
        </li>
        {order.items?.map(item => (
          <li key={item.code} className={`list-group-item list-group-item-${handleColor(item.status)} py-1`} onDoubleClick={() => handleStatusChange(item)}>
            <Row className='justify-content-between text-center'>
              <Col xs={3} className='text-start'>
                <h6>{item.name}</h6>
                <div className='mx-1'>
                  {item.chosenParams?.map((param, index) => {
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
              <Col xs={4}>{item.amount}</Col>
              <Col xs={3}>{item ? ('$' + String(item.priceSingle * item.amount)) : ''}</Col>
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
            <Col xs={9} className='text-end'><b>Total: </b></Col>
            <Col xs={1}><b>${total}</b></Col>
          </Row>
        </li>
      </ul>
    </div>
  );
};

export default TableOrder;
