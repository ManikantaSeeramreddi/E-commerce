import React from 'react';
import { Link } from 'react-router-dom';
import ProductCard from './ProductCard';

const ProductList = ({ products = [] }) => {
  if (products.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '40px', color: '#64748b' }}>
        No products found.
      </div>
    );
  }

  return (
    <div style={styles.grid}>
      {products.map((item) => (
        <Link
          key={item.id}
          to={`/product/${item.id}`}
          style={{ textDecoration: 'none', color: 'inherit' }}
        >
          <ProductCard product={item} />
        </Link>
      ))}
    </div>
  );
};

const styles = {
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
    gap: '20px',
  },
};

export default ProductList;