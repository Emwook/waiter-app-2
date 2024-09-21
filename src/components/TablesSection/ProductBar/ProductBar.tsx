import React, { useEffect, useState } from 'react';
import { Accordion, Button, Form, Col, Row } from 'react-bootstrap';
import { Product } from '../../../types/productTypes';
import OptionsProductForm from '../OptionsProductForm/OptionsProductForm';
import styles from './ProductBar.module.scss';
import { useDispatch } from 'react-redux';
import { getOrders, requestChangeOrder } from '../../../store/reducers/orderReducer';
import { ChosenParams, Order } from '../../../types/orderItemTypes';
import { generateReservationId } from '../../../utils/reservations/generateReservationId';
import { useSelector } from 'react-redux';
import { Table } from '../../../types/tableTypes';
import { requestChangeTableDetails } from '../../../store/reducers/tablesReducer';
import { changeMessage } from '../../../store/reducers/messageReducer';

interface ProductBarProps {
  product: Product;
  isOpen: boolean;
  eventKey: string;
  onSelect: (key: string | null) => void;
  disabled: boolean;
  table: Table;
}

const ProductBar: React.FC<ProductBarProps> = ({ product, isOpen, eventKey, onSelect, disabled, table }) => {
  const tableNumber = table.tableNumber;
  const [quantity, setQuantity] = useState(1);
  const dispatch = useDispatch();
  const orders:Order[] = useSelector(getOrders as any);
  const order = orders.find(o => o.tableNumber === tableNumber) || {tableNumber: tableNumber, items:[]}
  const [chosenParams, setChosenParams] = useState<ChosenParams>([]);
  const [productTotal, setProductTotal] = useState<number>(product.price)
  const handleQuantityChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuantity(Number(event.target.value));
  };
  useEffect(() => {
    if (product.params) {
      const newParams: ChosenParams = [];

      // Iterate over each section in params
      for (const section in product.params) {
        const paramSection = product.params[section];
        const defaultOptions = Object.values(paramSection.options)
          .filter(option => option.default)
          .map(option => option.label);

        if (defaultOptions.length > 0) {
          newParams.push({ [section]: defaultOptions });
        }
      }

      // Update chosenParams with newParams
      setChosenParams(newParams);
    }
  }, [product.params, setChosenParams]);

  useEffect(() => {
    let optionsTotal = 0;

    chosenParams.forEach(param => {
      const section = Object.keys(param)[0];
      const selectedOptions = param[section];
      if (product.params && product.params[section]) {
        selectedOptions.forEach(optionLabel => {
          const option = Object.values(product.params![section].options).find(opt => opt.label === optionLabel);
          if (option) {
            optionsTotal += option.price;
          }
        });
      }
    });

    setProductTotal(product.price + optionsTotal);
  }, [chosenParams, product.params, product.price]);


  const handleAddClick = () => {
    const newOrderItem:Order = {
      tableNumber: tableNumber,
      items: [
        ...order.items,
        {
          id: product.id,
          name: product.name,
          priceSingle: productTotal,
          amount: quantity,
          status: 'ordered',
          code: generateReservationId(),
          chosenParams: chosenParams,
        }
      ]
    }
    dispatch(requestChangeOrder(newOrderItem) as any);
    const oldBill: number = table.bill;
    const newTable:Table = {
      ...table,
      bill: oldBill + productTotal,
    }    
    if(oldBill + productTotal > 0){
      dispatch(requestChangeTableDetails(newTable) as any);
    }
  };

  const handleMessage = () => {
    if(disabled){
      dispatch(changeMessage(18) as any);
    }
  }

  return (
    <>
    {product.params ?(
    <div className={"mb-3 rounded-1"}>
      <Accordion.Item eventKey={eventKey}>
        <Accordion.Header onClick={() => onSelect((!isOpen) ? eventKey : null)}>
          <div className={`d-flex justify-content-between w-100`}>
            <span>{product.name}</span>
          </div>
        </Accordion.Header>
        <Accordion.Body className={styles.body} onMouseEnter={handleMessage}>
          <Row>
            <OptionsProductForm product={product} disabled={disabled} chosenParams={chosenParams} setChosenParams={setChosenParams}/>
          </Row>
          <Row className='mt-3 mx-1'>
            <Col xs={4}>
              <Form.Group controlId={`quantity-${product.id}`} className="mb-3">
                <Form.Control
                  disabled={disabled}
                  type="number"
                  value={quantity}
                  onChange={handleQuantityChange}
                  min={1}
                />
              </Form.Group>
            </Col>
            <Col className='mt-2' xs={3} style={{ userSelect: 'none' }}>
            <span className='bg-light py-2 px-3 mt-2 border-secondary border rounded-1'>
              ${productTotal}
            </span>
            </Col>
            <Col xs={2}>
              <Button variant="primary" onClick={handleAddClick}  disabled={disabled} >
                <i className='bi bi-plus'/>
              </Button>
            </Col>
          </Row>
        </Accordion.Body>
      </Accordion.Item>
    </div>
    ):(
      <div className='border border-gray rounded-1 p-0 mb-3 bg-body-none'>
        <Row className='align-items-center justify-content-between'>
          <Col xs={11} md={11} lg={3} className='mx-3'>            
            <span>{product.name}</span>
          </Col>
          <Col onMouseEnter={handleMessage}>
              <Form.Group controlId={`quantity-${product.id}`} className="mb-3 mx-1">
                <Form.Control
                  disabled={disabled}
                  type="number"
                  value={quantity}
                  onChange={handleQuantityChange}
                  min={1}
                  className='mt-3'
                />
              </Form.Group>
            </Col >
            <Col xs={7} md={4} lg={3} onMouseEnter={handleMessage} >
              <Button variant="primary" size={"sm"} onClick={handleAddClick} disabled={disabled}>
                <i className='bi bi-plus'/>
              </Button>
            </Col>
        </Row>
        </div>
      )}
    </>
  );
};

export default ProductBar;
