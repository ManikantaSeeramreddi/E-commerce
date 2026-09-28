import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import CartItem from './CartItem';
import { formatCurrency } from '../../utils/formatCurrency';
import { X } from 'lucide-react';

const CartDrawer = ({ isOpen, onClose }) => {
  const { cartItems, updateQuantity, removeFromCart, subtotal } = useCart();
  const navigate = useNavigate();

  if (!isOpen) return null;

  return (
    <div style={styles.overlay}>
      <div style={styles.drawer}>
        <div style={styles.header}>
          <h3>Shopping Cart</h3>
          <button onClick={onClose} style={styles.closeBtn}>
            <X size={20} />
          </button>
        </div>

        <div style={styles.list}>
          {cartItems.length === 0 ? (
            <p style={{ textAlign: 'center', color: '#64748b', marginTop: '40px' }}>
              Your cart is empty.
            </p>
          ) : (
            cartItems.map((item) => (
              <CartItem
                key={item.id || item._id || item.productId}
                item={item}
                updateQuantity={updateQuantity}
                removeFromCart={removeFromCart}
              />
            ))
          )}
        </div>

        {cartItems.length > 0 && (
          <div style={styles.footer}>
            <div style={styles.totalRow}>
              <span>Subtotal:</span>
              <strong>{formatCurrency(subtotal)}</strong>
            </div>
            <button
              style={styles.checkoutBtn}
              onClick={() => {
                onClose();
                navigate('/checkout');
              }}
            >
              Checkout Now
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

const styles = {
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    zIndex: 1000,
    display: 'flex',
    justifyContent: 'flex-end',
  },
  drawer: {
    width: '380px',
    maxWidth: '100%',
    backgroundColor: '#fff',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    boxShadow: '-2px 0 8px rgba(0,0,0,0.1)',
  },
  header: {
    padding: '16px 20px',
    borderBottom: '1px solid #e2e8f0',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  closeBtn: { background: 'none', border: 'none', cursor: 'pointer' },
  list: { flex: 1, overflowY: 'auto', padding: '16px' },
  footer: { padding: '20px', borderTop: '1px solid #e2e8f0' },
  totalRow: { display: 'flex', justifyContent: 'space-between', marginBottom: '16px' },
  checkoutBtn: {
    width: '100%',
    padding: '12px',
    backgroundColor: '#059669',
    color: '#fff',
    border: 'none',
    borderRadius: '6px',
    fontWeight: 'bold',
    cursor: 'pointer',
  },
};

export default CartDrawer;