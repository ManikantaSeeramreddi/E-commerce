import React from 'react';
import { Trash2 } from 'lucide-react';
import { formatCurrency } from '../../utils/formatCurrency';

const CartItem = ({ item, updateQuantity, removeFromCart }) => {
  const productId = item.id || item._id || item.productId;

  return (
    <div style={styles.container}>
      <img src={item.image} alt={item.title} style={styles.image} />
      <div style={styles.info}>
        <h4 style={styles.title}>{item.title}</h4>
        <p style={styles.price}>{formatCurrency(item.price)}</p>
      </div>
      <div style={styles.actions}>
        <button
          onClick={() => updateQuantity(productId, item.quantity - 1)}
          style={styles.qtyBtn}
        >
          -
        </button>
        <span style={styles.quantity}>{item.quantity}</span>
        <button
          onClick={() => updateQuantity(productId, item.quantity + 1)}
          style={styles.qtyBtn}
        >
          +
        </button>
        <button
          onClick={() => removeFromCart(productId)}
          style={styles.deleteBtn}
        >
          <Trash2 size={16} />
        </button>
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    alignItems: 'center',
    padding: '12px',
    borderBottom: '1px solid #e2e8f0',
    backgroundColor: '#fff',
    borderRadius: '6px',
    marginBottom: '8px',
  },
  image: {
    width: '60px',
    height: '60px',
    objectFit: 'contain',
    marginRight: '16px',
  },
  info: { flex: 1 },
  title: { margin: '0 0 4px 0', fontSize: '14px', color: '#1e293b' },
  price: { margin: 0, color: '#64748b', fontSize: '14px' },
  actions: { display: 'flex', alignItems: 'center', gap: '8px' },
  qtyBtn: {
    width: '28px',
    height: '28px',
    border: '1px solid #cbd5e1',
    backgroundColor: '#f8fafc',
    cursor: 'pointer',
    borderRadius: '4px',
    fontWeight: 'bold',
  },
  quantity: { minWidth: '20px', textAlign: 'center', fontWeight: 'bold' },
  deleteBtn: {
    border: 'none',
    backgroundColor: '#fee2e2',
    color: '#ef4444',
    padding: '6px',
    borderRadius: '4px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
  },
};

export default CartItem;