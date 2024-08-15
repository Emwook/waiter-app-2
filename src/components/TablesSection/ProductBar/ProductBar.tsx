import React, { useState } from 'react';
import { Accordion, Button, Form, Col, Row } from 'react-bootstrap';
import { Product } from '../../../types/productTypes';
import OptionsProductForm from '../OptionsProductForm/OptionsProductForm';
import styles from './ProductBar.module.scss';

interface ProductBarProps {
  product: Product;
  isOpen: boolean;
  eventKey: string;
  onSelect: (key: string | null) => void;
  disabled: boolean;
}

const ProductBar: React.FC<ProductBarProps> = ({ product, isOpen, eventKey, onSelect, disabled }) => {
  const [quantity, setQuantity] = useState(1);

  const handleQuantityChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuantity(Number(event.target.value));
  };

  const handleAddClick = () => {
    // Handle the logic for adding the product with the specified quantity
    console.log(`Added ${quantity} of ${product.name} to cart.`);
  };

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
        <Accordion.Body className={styles.body}>
          <Row>
            <OptionsProductForm product={product} disabled={disabled}/>
          </Row>
          <Row className='mt-3 mx-1'>
            <Col xs={3}>
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
            <Col xs={2}>
              <Button variant="primary" onClick={handleAddClick}  disabled={disabled}>
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
          <Col xs={5} className='mx-3'>{product.name}</Col>
          <Col xs={3}>
              <Form.Group controlId={`quantity-${product.id}`} className="mb-3">
                <Form.Control
                  disabled={disabled}
                  type="number"
                  value={quantity}
                  onChange={handleQuantityChange}
                  min={1}
                  className='mt-3'
                />
              </Form.Group>
            </Col>
            <Col>
              <Button variant="primary" onClick={handleAddClick} disabled={disabled}>
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
