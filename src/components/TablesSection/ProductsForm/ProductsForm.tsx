import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { getAllProducts } from '../../../store/reducers/productReducer';
import { Product } from '../../../types/productTypes';
import ProductBar from '../ProductBar/ProductBar'; // Adjust the import path as necessary
import { Accordion } from 'react-bootstrap';
import { Table } from '../../../types/tableTypes';
import styles from './ProductsForm.module.scss';

interface ProductsFormProps {
  disabled: boolean;
  table: Table;
}

const ProductsForm: React.FC<ProductsFormProps> = ({disabled, table}) => {
  const products: Product[] = useSelector(getAllProducts);
  const [activeKey, setActiveKey] = useState<string | null>(null);

  const handleSelect = (key: string | null) => {
    setActiveKey(key);
  };

  return (
    <div className={styles.accordion}>
      <h2 className="py-2">add to order:</h2>
      <Accordion activeKey={activeKey} onSelect={() => (handleSelect)}>
        {products.map((product: Product) => (
          <ProductBar
            key={product.id}
            product={product}
            isOpen={activeKey === product.id}
            eventKey={product.id}
            onSelect={handleSelect}
            disabled={disabled}
            table={table}
          />
        ))}
      </Accordion>
    </div>
  );
};

export default ProductsForm;

