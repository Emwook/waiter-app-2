import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { getAllProducts } from '../../../store/reducers/productReducer';
import { Product } from '../../../types/productTypes';
import ProductBar from '../ProductBar/ProductBar'; // Adjust the import path as necessary
import { Accordion } from 'react-bootstrap';

const ProductsForm: React.FC = () => {
  const products: Product[] = useSelector(getAllProducts);
  const [activeKey, setActiveKey] = useState<string | null>(null);

  const handleSelect = (key: string | null) => {
    setActiveKey(key);
  };

  return (
    <div className="mt-1 px-3">
      <h2 className="py-2">add to order:</h2>
      <Accordion activeKey={activeKey} onSelect={() => handleSelect}>
        {products.map((product: Product) => (
          <ProductBar
            key={product.id}
            product={product}
            isOpen={activeKey === product.id}
            eventKey={product.id}
            onSelect={handleSelect}
          />
        ))}
      </Accordion>
    </div>
  );
};

export default ProductsForm;

