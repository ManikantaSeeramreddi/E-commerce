import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { Star, ShoppingCart } from 'lucide-react';

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleCardClick = () => {
    if (!isAuthenticated) {
      navigate('/auth', { state: { from: `/product/${product.id}` } });
    } else {
      navigate(`/product/${product.id}`);
    }
  };

  const handleAddToCart = (e) => {
    e.stopPropagation();
    if (!isAuthenticated) {
      navigate('/auth', { state: { from: `/product/${product.id}` } });
    } else {
      addToCart(product);
    }
  };

  return (
    <div className="product-card" onClick={handleCardClick} style={{ cursor: 'pointer' }}>
      <img
        src={product.image}
        alt={product.title}
        style={{ height: '170px', width: '100%', objectFit: 'contain' }}
      />
      <h4
        style={{
          margin: '12px 0 4px',
          fontSize: '14px',
          fontWeight: '600',
          color: 'var(--text-main)',
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          textAlign: 'center',
          width: '100%',
        }}
      >
        {product.title}
      </h4>
      <p
        style={{
          fontWeight: '800',
          fontSize: '16px',
          color: 'var(--text-main)',
          margin: 0,
          textAlign: 'center',
        }}
      >
        ${product.price.toFixed(2)}
      </p>

      {/* Hover Blur Overlay */}
      <div className="hover-overlay">
        <button
          className="btn-red"
          onClick={handleAddToCart}
          type="button"
        >
          <ShoppingCart size={15} />
          <span>Add To Cart</span>
        </button>
      </div>
    </div>
  );
};

export default ProductCard;