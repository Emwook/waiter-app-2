import React from 'react';
import { useSelector } from 'react-redux';
import { getAllProducts } from '../../../store/reducers/productReducer';
import { Product } from '../../../types/productTypes';
import ProductBar from '..//ProductBar/ProductBar'; // Adjust the import path as necessary

const ProductsForm: React.FC = () => {
  const products: Product[] = useSelector(getAllProducts);

  return (
    <div className="mt-1 px-3">
      {products.map((product: Product) => (
        <ProductBar key={product.id} product={product} />
      ))}
    </div>
  );
};

export default ProductsForm;
