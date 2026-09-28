import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { calculateTotals } from '../utils/calculateTotals';
import { formatCurrency } from '../utils/formatCurrency';
import { Trash2, ShoppingBag, ArrowRight, ShieldCheck, ArrowLeft } from 'lucide-react';

const CartPage = () => {
  const navigate = useNavigate();
  const { cartItems, removeFromCart, updateQuantity, clearCart } = useCart();
  const { subtotal, tax, shipping, grandTotal } = calculateTotals(cartItems);

  const handleClearAll = (e) => {
    e.preventDefault();
    if (window.confirm('Are you sure you want to remove all items from your cart?')) {
      clearCart();
    }
  };

  if (cartItems.length === 0) {
    return (
      <div style={styles.emptyContainer}>
        <div style={styles.emptyIconCircle}>
          <ShoppingBag size={48} color="#f42c37" />
        </div>
        <h2 style={{ fontSize: '28px', fontWeight: '800', margin: '16px 0 8px', color: 'var(--text-main)' }}>
          Your Cart is Empty
        </h2>
        <p style={{ color: 'var(--text-muted)', marginBottom: '24px', fontSize: '15px' }}>
          Looks like you haven't added anything to your cart yet.
        </p>
        <button className="btn-red" onClick={() => navigate('/store')}>
          Start Shopping
        </button>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.headerRow}>
        <div>
          <h1 style={{ fontSize: '32px', fontWeight: '800', margin: '0 0 4px', color: 'var(--text-main)' }}>
            Shopping Cart
          </h1>
          <p style={{ color: 'var(--text-muted)', margin: 0, fontSize: '14px' }}>
            You have <strong style={{ color: '#f42c37' }}>{cartItems.length}</strong> items in your cart
          </p>
        </div>
        <button
          type="button"
          onClick={handleClearAll}
          style={styles.clearBtn}
        >
          Clear All
        </button>
      </div>

      <div style={styles.layoutGrid}>
        {/* Left Column: Cart Items List */}
        <div style={styles.itemsList}>
          {cartItems.map((item) => {
            const productId = item.id || item._id || item.productId;
            return (
            <div key={productId} style={styles.itemCard}>
              <img src={item.image} alt={item.title} style={styles.itemImage} />

              <div style={styles.itemDetails}>
                <span style={styles.itemCategory}>{item.category}</span>
                <h3 style={styles.itemTitle}>{item.title}</h3>
                <p style={styles.itemPrice}>{formatCurrency(item.price)}</p>
              </div>

              {/* Quantity Selector & Remove */}
              <div style={styles.itemActions}>
                <div style={styles.qtyBox}>
                  <button
                    type="button"
                    onClick={() => updateQuantity(productId, item.quantity - 1)}
                    style={styles.qtyBtn}
                  >
                    -
                  </button>
                  <span style={styles.qtyValue}>{item.quantity}</span>
                  <button
                    type="button"
                    onClick={() => updateQuantity(productId, item.quantity + 1)}
                    style={styles.qtyBtn}
                  >
                    +
                  </button>
                </div>

                <button
                  type="button"
                  onClick={() => removeFromCart(productId)}
                  style={styles.removeBtn}
                  title="Remove item"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
            );
          })}

          <Link to="/store" style={styles.continueLink}>
            <ArrowLeft size={16} /> Continue Shopping
          </Link>
        </div>

        {/* Right Column: Order Summary Card */}
        <div style={styles.summaryCard}>
          <h3 style={{ fontSize: '20px', fontWeight: '700', margin: '0 0 20px', color: 'var(--text-main)' }}>
            Order Summary
          </h3>

          <div style={styles.summaryRow}>
            <span>Subtotal</span>
            <span>{formatCurrency(subtotal)}</span>
          </div>

          <div style={styles.summaryRow}>
            <span>Estimated Tax (8%)</span>
            <span>{formatCurrency(tax)}</span>
          </div>

          <div style={styles.summaryRow}>
            <span>Shipping</span>
            <span>{shipping === 0 ? <strong style={{ color: '#2dcc6f' }}>FREE</strong> : formatCurrency(shipping)}</span>
          </div>

          {shipping === 0 && (
            <div style={styles.freeShippingBadge}>
              🎉 You unlocked Free Express Shipping!
            </div>
          )}

          <hr style={{ borderColor: 'rgba(0,0,0,0.06)', margin: '16px 0' }} />

          <div style={{ ...styles.summaryRow, fontSize: '18px', fontWeight: '800', color: 'var(--text-main)' }}>
            <span>Total</span>
            <span style={{ color: '#f42c37' }}>{formatCurrency(grandTotal)}</span>
          </div>

          <button
            type="button"
            className="btn-red"
            style={{ width: '100%', padding: '14px', marginTop: '20px', fontSize: '16px' }}
            onClick={() => navigate('/checkout')}
          >
            <span>Proceed to Checkout</span>
            <ArrowRight size={18} />
          </button>

          <div style={styles.guarantee}>
            <ShieldCheck size={18} color="#2dcc6f" />
            <span>Guaranteed Safe & Secure Checkout</span>
          </div>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    maxWidth: '1240px',
    margin: '0 auto',
    padding: '30px 20px 80px',
  },
  headerRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginBottom: '28px',
  },
  clearBtn: {
    background: 'rgba(244, 44, 55, 0.1)',
    border: 'none',
    color: '#f42c37',
    fontWeight: '700',
    fontSize: '13px',
    padding: '8px 16px',
    borderRadius: '20px',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  },
  layoutGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
    gap: '30px',
    alignItems: 'start',
  },
  itemsList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
    gridColumn: 'span 2',
  },
  itemCard: {
    backgroundColor: 'var(--bg-surface)',
    borderRadius: '20px',
    padding: '20px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '20px',
    flexWrap: 'wrap',
  },
  itemImage: {
    width: '80px',
    height: '80px',
    objectFit: 'contain',
  },
  itemDetails: {
    flex: '1 1 200px',
  },
  itemCategory: {
    fontSize: '11px',
    fontWeight: '700',
    textTransform: 'uppercase',
    color: 'var(--text-muted)',
  },
  itemTitle: {
    fontSize: '16px',
    fontWeight: '700',
    color: 'var(--text-main)',
    margin: '2px 0 6px',
  },
  itemPrice: {
    fontSize: '16px',
    fontWeight: '800',
    color: '#f42c37',
    margin: 0,
  },
  itemActions: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
  },
  qtyBox: {
    display: 'flex',
    alignItems: 'center',
    backgroundColor: 'var(--bg-main)',
    borderRadius: '20px',
    padding: '4px 8px',
  },
  qtyBtn: {
    background: 'none',
    border: 'none',
    color: 'var(--text-main)',
    fontSize: '18px',
    fontWeight: 'bold',
    cursor: 'pointer',
    width: '24px',
    height: '24px',
  },
  qtyValue: {
    fontWeight: '700',
    fontSize: '14px',
    margin: '0 10px',
    color: 'var(--text-main)',
  },
  removeBtn: {
    backgroundColor: 'rgba(244, 44, 55, 0.1)',
    color: '#f42c37',
    border: 'none',
    padding: '8px',
    borderRadius: '50%',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  continueLink: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px',
    color: 'var(--text-muted)',
    textDecoration: 'none',
    fontWeight: '600',
    fontSize: '14px',
    marginTop: '10px',
  },
  summaryCard: {
    backgroundColor: 'var(--bg-surface)',
    borderRadius: '24px',
    padding: '28px',
    border: '1px solid rgba(0,0,0,0.05)',
  },
  summaryRow: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '12px',
    fontSize: '14px',
    color: 'var(--text-muted)',
  },
  freeShippingBadge: {
    backgroundColor: 'rgba(45, 204, 111, 0.1)',
    color: '#2dcc6f',
    padding: '8px 12px',
    borderRadius: '8px',
    fontSize: '12px',
    fontWeight: 'bold',
    margin: '12px 0',
    textAlign: 'center',
  },
  guarantee: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    marginTop: '16px',
    fontSize: '12px',
    color: 'var(--text-muted)',
    fontWeight: '500',
  },
  emptyContainer: {
    maxWidth: '500px',
    margin: '80px auto',
    textAlign: 'center',
    padding: '0 20px',
  },
  emptyIconCircle: {
    width: '90px',
    height: '90px',
    borderRadius: '50%',
    backgroundColor: 'rgba(244, 44, 55, 0.1)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '0 auto',
  },
};

export default CartPage;