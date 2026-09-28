import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { calculateTotals } from '../utils/calculateTotals';
import { formatCurrency } from '../utils/formatCurrency';
import { createOrderInDB } from '../services/api';
import { CreditCard, QrCode, Truck, CheckCircle2, Lock, ArrowLeft } from 'lucide-react';

const Checkout = () => {
  const navigate = useNavigate();
  const { cartItems, clearCart } = useCart();
  const { subtotal, tax, shipping, grandTotal } = calculateTotals(cartItems);

  const [paymentMethod, setPaymentMethod] = useState('card');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [couponMessage, setCouponMessage] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    zip: '',
    cardNumber: '',
    expiry: '',
    cvv: '',
    upiId: '',
  });

  const discountAmount = appliedCoupon?.type === 'percent'
    ? Math.min(subtotal * appliedCoupon.value, subtotal)
    : appliedCoupon?.type === 'shipping' ? shipping : 0;
  const payableTotal = Math.max(0, grandTotal - discountAmount);

  if (cartItems.length === 0 && !isSuccess) {
    return (
      <div style={{ textAlign: 'center', padding: '100px 20px' }}>
        <h2>No items in checkout.</h2>
        <button className="btn-red" style={{ marginTop: '16px' }} onClick={() => navigate('/store')}>
          Go to Store
        </button>
      </div>
    );
  }

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const applyCoupon = (e) => {
    e.preventDefault();
    const code = couponCode.trim().toUpperCase();
    const coupon = code === 'SAVE10'
      ? { code, label: '10% off', type: 'percent', value: 0.1 }
      : code === 'TECH20' && subtotal >= 500
        ? { code, label: '20% off', type: 'percent', value: 0.2 }
        : code === 'FREESHIP' ? { code, label: 'Free shipping', type: 'shipping', value: 0 } : null;
    setAppliedCoupon(coupon);
    setCouponMessage(coupon ? `${coupon.label} applied.` : code === 'TECH20' ? 'TECH20 requires a $500 subtotal.' : 'Invalid coupon code.');
  };

  const handlePayment = async (e) => {
    e.preventDefault();
    setIsProcessing(true);

    try {
      await createOrderInDB({
        customerName: formData.name,
        customerEmail: formData.email,
        customerPhone: formData.phone,
        items: cartItems.map((item) => ({
          productId: item.id || item._id || item.productId,
          title: item.title,
          category: item.category,
          price: item.price,
          quantity: item.quantity,
          image: item.image,
        })),
        subtotal,
        tax,
        shipping,
        discountAmount,
        couponCode: appliedCoupon?.code || '',
        totalAmount: payableTotal,
        paymentMethod,
        shippingAddress: {
          street: formData.address,
          city: formData.city,
          zip: formData.zip,
        },
      });
      setIsSuccess(true);
      clearCart();
    } catch (err) {
      window.alert(err.message);
    } finally {
      setIsProcessing(false);
    }
  };

  if (isSuccess) {
    return (
      <div style={styles.successContainer}>
        <div style={styles.successIcon}>
          <CheckCircle2 size={64} color="#2dcc6f" />
        </div>
        <h1 style={{ fontSize: '32px', fontWeight: '800', margin: '16px 0 8px', color: 'var(--text-main)' }}>
          Payment Successful!
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '15px', maxWidth: '450px', margin: '0 auto 24px' }}>
          Thank you <strong>{formData.name || 'Valued Customer'}</strong>. Your order has been placed and is being prepared for dispatch.
        </p>
        <button className="btn-red" onClick={() => navigate('/')}>
          Back to Homepage
        </button>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <button onClick={() => navigate('/cart')} style={styles.backBtn}>
        <ArrowLeft size={16} /> Back to Cart
      </button>

      <h1 style={{ fontSize: '32px', fontWeight: '800', margin: '10px 0 30px', color: 'var(--text-main)' }}>
        Checkout & Payment
      </h1>

      <form onSubmit={handlePayment} style={styles.checkoutGrid}>
        {/* Left Column: Shipping and Payment Options */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* Shipping Address Box */}
          <div style={styles.cardBox}>
            <h3 style={styles.sectionTitle}>1. Shipping Address</h3>
            <div style={styles.formRow}>
              <input
                required
                type="text"
                name="name"
                placeholder="Full Name"
                value={formData.name}
                onChange={handleChange}
                style={styles.input}
              />
              <input
                required
                type="email"
                name="email"
                placeholder="Email Address"
                value={formData.email}
                onChange={handleChange}
                style={styles.input}
              />
            </div>
            <div style={styles.formRow}>
              <input
                required
                type="tel"
                name="phone"
                placeholder="Phone Number"
                value={formData.phone}
                onChange={handleChange}
                style={styles.input}
              />
              <input
                required
                type="text"
                name="address"
                placeholder="Street Address"
                value={formData.address}
                onChange={handleChange}
                style={styles.input}
              />
            </div>
            <div style={styles.formRow}>
              <input
                required
                type="text"
                name="city"
                placeholder="City"
                value={formData.city}
                onChange={handleChange}
                style={styles.input}
              />
              <input
                required
                type="text"
                name="zip"
                placeholder="PIN / Postal Code"
                value={formData.zip}
                onChange={handleChange}
                style={styles.input}
              />
            </div>
          </div>

          {/* Payment Method Selector */}
          <div style={styles.cardBox}>
            <h3 style={styles.sectionTitle}>2. Choose Payment Method</h3>

            {/* Selector Tabs */}
            <div style={styles.tabsGrid}>
              <div
                onClick={() => setPaymentMethod('card')}
                style={{
                  ...styles.tabItem,
                  border: paymentMethod === 'card' ? '2px solid #f42c37' : '1px solid #e5e7eb',
                  backgroundColor: paymentMethod === 'card' ? 'rgba(244, 44, 55, 0.05)' : 'transparent',
                }}
              >
                <CreditCard size={22} color={paymentMethod === 'card' ? '#f42c37' : 'var(--text-muted)'} />
                <span style={{ fontWeight: '600', fontSize: '13px' }}>Card</span>
              </div>

              <div
                onClick={() => setPaymentMethod('upi')}
                style={{
                  ...styles.tabItem,
                  border: paymentMethod === 'upi' ? '2px solid #f42c37' : '1px solid #e5e7eb',
                  backgroundColor: paymentMethod === 'upi' ? 'rgba(244, 44, 55, 0.05)' : 'transparent',
                }}
              >
                <QrCode size={22} color={paymentMethod === 'upi' ? '#f42c37' : 'var(--text-muted)'} />
                <span style={{ fontWeight: '600', fontSize: '13px' }}>UPI / QR</span>
              </div>

              <div
                onClick={() => setPaymentMethod('cod')}
                style={{
                  ...styles.tabItem,
                  border: paymentMethod === 'cod' ? '2px solid #f42c37' : '1px solid #e5e7eb',
                  backgroundColor: paymentMethod === 'cod' ? 'rgba(244, 44, 55, 0.05)' : 'transparent',
                }}
              >
                <Truck size={22} color={paymentMethod === 'cod' ? '#f42c37' : 'var(--text-muted)'} />
                <span style={{ fontWeight: '600', fontSize: '13px' }}>Cash On Delivery</span>
              </div>
            </div>

            {/* Dynamic Payment Details Section */}
            <div style={{ marginTop: '20px' }}>
              {paymentMethod === 'card' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <input
                    required
                    type="text"
                    maxLength="16"
                    name="cardNumber"
                    placeholder="Card Number (e.g. 4532 •••• •••• 8921)"
                    value={formData.cardNumber}
                    onChange={handleChange}
                    style={styles.input}
                  />
                  <div style={styles.formRow}>
                    <input
                      required
                      type="text"
                      maxLength="5"
                      name="expiry"
                      placeholder="MM/YY"
                      value={formData.expiry}
                      onChange={handleChange}
                      style={styles.input}
                    />
                    <input
                      required
                      type="password"
                      maxLength="3"
                      name="cvv"
                      placeholder="CVV"
                      value={formData.cvv}
                      onChange={handleChange}
                      style={styles.input}
                    />
                  </div>
                </div>
              )}

              {paymentMethod === 'upi' && (
                <div>
                  <input
                    required
                    type="text"
                    name="upiId"
                    placeholder="Enter UPI ID (e.g. user@okhdfcbank / paytm)"
                    value={formData.upiId}
                    onChange={handleChange}
                    style={styles.input}
                  />
                  <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '8px' }}>
                    A payment request will be triggered directly to your UPI app.
                  </p>
                </div>
              )}

              {paymentMethod === 'cod' && (
                <div style={{ padding: '12px', backgroundColor: 'rgba(0,0,0,0.03)', borderRadius: '12px', fontSize: '13px', color: 'var(--text-muted)' }}>
                  💵 Pay with cash when the courier partner arrives at your delivery location.
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Order Summary & Place Button */}
        <div style={styles.summaryCard}>
          <h3 style={{ fontSize: '20px', fontWeight: '700', margin: '0 0 16px', color: 'var(--text-main)' }}>
            Summary ({cartItems.length} Items)
          </h3>

          <div style={styles.previewList}>
            {cartItems.map((item) => (
              <div key={item.id || item._id || item.productId} style={styles.previewItem}>
                <img src={item.image} alt={item.title} style={{ width: '40px', height: '40px', objectFit: 'contain' }} />
                <div style={{ flex: 1, overflow: 'hidden' }}>
                  <p style={styles.previewTitle}>{item.title}</p>
                  <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Qty: {item.quantity}</span>
                </div>
                <strong style={{ fontSize: '13px' }}>{formatCurrency(item.price * item.quantity)}</strong>
              </div>
            ))}
          </div>

          <hr style={{ borderColor: 'rgba(0,0,0,0.06)', margin: '16px 0' }} />

          <div style={styles.summaryRow}>
            <span>Subtotal</span>
            <span>{formatCurrency(subtotal)}</span>
          </div>

          <div style={styles.summaryRow}>
            <span>Tax (8%)</span>
            <span>{formatCurrency(tax)}</span>
          </div>

          <div style={styles.summaryRow}>
            <span>Shipping</span>
            <span>{shipping === 0 ? <strong style={{ color: '#2dcc6f' }}>FREE</strong> : formatCurrency(shipping)}</span>
          </div>

          <form onSubmit={applyCoupon} style={styles.couponForm}>
            <input value={couponCode} onChange={(e) => setCouponCode(e.target.value)} placeholder="Coupon code" style={styles.couponInput} />
            <button type="submit" style={styles.couponButton}>Apply</button>
          </form>
          {couponMessage && <p style={styles.couponMessage}>{couponMessage}</p>}
          {discountAmount > 0 && <div style={styles.discountRow}><span>Discount</span><span>-{formatCurrency(discountAmount)}</span></div>}

          <div style={{ ...styles.summaryRow, fontSize: '18px', fontWeight: '800', marginTop: '12px', color: 'var(--text-main)' }}>
            <span>Total Payable</span>
            <span style={{ color: '#f42c37' }}>{formatCurrency(payableTotal)}</span>
          </div>

          <button
            type="submit"
            disabled={isProcessing}
            className="btn-red"
            style={{ width: '100%', padding: '14px', marginTop: '20px', fontSize: '16px' }}
          >
            <Lock size={16} />
            <span>{isProcessing ? 'Processing Securely...' : `Pay ${formatCurrency(payableTotal)}`}</span>
          </button>
        </div>
      </form>
    </div>
  );
};

const styles = {
  container: {
    maxWidth: '1240px',
    margin: '0 auto',
    padding: '30px 20px 80px',
  },
  backBtn: {
    background: 'none',
    border: 'none',
    color: 'var(--text-muted)',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    padding: 0,
  },
  checkoutGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
    gap: '30px',
    alignItems: 'start',
  },
  cardBox: {
    backgroundColor: 'var(--bg-surface)',
    borderRadius: '24px',
    padding: '28px',
    border: '1px solid rgba(0,0,0,0.05)',
  },
  sectionTitle: {
    fontSize: '18px',
    fontWeight: '700',
    margin: '0 0 18px',
    color: 'var(--text-main)',
  },
  formRow: {
    display: 'flex',
    gap: '12px',
    marginBottom: '12px',
    flexWrap: 'wrap',
  },
  input: {
    flex: '1 1 180px',
    padding: '12px 16px',
    borderRadius: '12px',
    border: '1px solid #e5e7eb',
    backgroundColor: 'var(--bg-main)',
    color: 'var(--text-main)',
    fontSize: '14px',
    outline: 'none',
  },
  tabsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '12px',
  },
  tabItem: {
    borderRadius: '14px',
    padding: '14px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '8px',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  },
  summaryCard: {
    backgroundColor: 'var(--bg-surface)',
    borderRadius: '24px',
    padding: '28px',
    border: '1px solid rgba(0,0,0,0.05)',
  },
  previewList: {
    maxHeight: '200px',
    overflowY: 'auto',
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    marginBottom: '12px',
  },
  previewItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  previewTitle: {
    margin: 0,
    fontSize: '13px',
    fontWeight: '600',
    color: 'var(--text-main)',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  summaryRow: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '8px',
    fontSize: '14px',
    color: 'var(--text-muted)',
  },
  couponForm: { display: 'flex', gap: '8px', margin: '16px 0 6px' },
  couponInput: { flex: 1, minWidth: 0, padding: '10px', border: '1px solid #cbd5e1', borderRadius: '8px', background: 'var(--bg-main)', color: 'var(--text-main)' },
  couponButton: { padding: '10px 14px', border: 0, borderRadius: '8px', background: '#2563eb', color: '#fff', cursor: 'pointer', fontWeight: '700' },
  couponMessage: { margin: '4px 0 10px', fontSize: '12px', color: 'var(--text-muted)' },
  discountRow: { display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '14px', color: '#10b981', fontWeight: '700' },
  successContainer: {
    maxWidth: '500px',
    margin: '80px auto',
    textAlign: 'center',
    padding: '0 20px',
  },
  successIcon: {
    width: '90px',
    height: '90px',
    borderRadius: '50%',
    backgroundColor: 'rgba(45, 204, 111, 0.15)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '0 auto',
  },
};

export default Checkout;