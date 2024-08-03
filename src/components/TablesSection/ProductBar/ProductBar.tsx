import React, { useState } from 'react';
import { Accordion, Card, Button, Form, Col, Row } from 'react-bootstrap';
import { Product } from '../../../types/productTypes';

interface ProductBarProps {
  product: Product;
}

const ProductBar: React.FC<ProductBarProps> = ({ product }) => {
  const [quantity, setQuantity] = useState(1);

  const handleQuantityChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuantity(Number(event.target.value));
  };

  const handleAddClick = () => {
    // Handle the logic for adding the product with the specified quantity
    console.log(`Added ${quantity} of ${product.name} to cart.`);
  };

  return (
    <Accordion className="mb-3 rounded-1">
      <Card>
        <Accordion.Item eventKey="0">
          <Accordion.Header>
            <div className="d-flex justify-content-between w-100">
              <span>{product.name}</span>
              <span>${product.price}</span>
            </div>
          </Accordion.Header>
          <Accordion.Body>
          <Row>
            <Col xs={8}>radios and such</Col>
            <Col xs={2}>
                <Form.Group controlId={`quantity-${product.id}`} className="mb-3">    
                <Form.Control
                    type="number"
                    value={quantity}
                    onChange={handleQuantityChange}
                    min={1}
                />
                </Form.Group>
            </Col>
            <Col xs={2}>
                <Button variant="primary" onClick={handleAddClick}>
                <i className='bi bi-plus'/>
                </Button>
            </Col>
            </Row>
          </Accordion.Body>
        </Accordion.Item>
      </Card>
    </Accordion>
  );
};

export default ProductBar;
