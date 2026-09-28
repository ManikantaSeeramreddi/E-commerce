import React from 'react';
import { ShieldCheck, Truck, Headphones, Award } from 'lucide-react';

const AboutPage = () => {
  return (
    <div style={styles.container}>
      <div style={styles.heroSection}>
        <span style={styles.badge}>About ESHOP</span>
        <h1 style={styles.title}>Redefining Online Tech Shopping</h1>
        <p style={styles.subtitle}>
          Founded to bring next-generation gadgets, crystal-clear audio, flagship smartphones, and high-performance laptops directly to you with speed and authentic guarantees.
        </p>
      </div>

      <div style={styles.grid}>
        <div style={styles.card}>
          <Truck size={36} color="#f42c37" />
          <h3 style={styles.cardTitle}>Global Express Delivery</h3>
          <p style={styles.cardText}>Fast, reliable shipping network delivering orders directly to your doorstep in pristine condition.</p>
        </div>

        <div style={styles.card}>
          <ShieldCheck size={36} color="#2dcc6f" />
          <h3 style={styles.cardTitle}>100% Authentic Products</h3>
          <p style={styles.cardText}>Every item is sourced directly from certified brand manufacturers with official warranties.</p>
        </div>

        <div style={styles.card}>
          <Headphones size={36} color="#1376f4" />
          <h3 style={styles.cardTitle}>24/7 Priority Support</h3>
          <p style={styles.cardText}>Our technical experts and support agents are available around the clock to assist you.</p>
        </div>

        <div style={styles.card}>
          <Award size={36} color="#fdc62e" />
          <h3 style={styles.cardTitle}>Guaranteed Best Prices</h3>
          <p style={styles.cardText}>We match the latest tech deals, exclusive discounts, and seasonal offers daily.</p>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    maxWidth: '1240px',
    margin: '0 auto',
    padding: '40px 24px 80px',
  },
  heroSection: {
    textAlign: 'center',
    maxWidth: '750px',
    margin: '0 auto 60px',
  },
  badge: {
    backgroundColor: '#fef2f2',
    color: '#f42c37',
    fontWeight: 'bold',
    fontSize: '13px',
    padding: '6px 16px',
    borderRadius: '20px',
  },
  title: {
    fontSize: '42px',
    fontWeight: '800',
    color: 'var(--text-main)',
    margin: '16px 0',
  },
  subtitle: {
    fontSize: '16px',
    color: 'var(--text-muted)',
    lineHeight: '1.7',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
    gap: '24px',
  },
  card: {
    backgroundColor: 'var(--bg-surface)',
    padding: '32px 24px',
    borderRadius: '20px',
    border: '1px solid #e5e7eb',
    textAlign: 'center',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  cardTitle: {
    fontSize: '18px',
    fontWeight: '700',
    color: 'var(--text-main)',
    margin: '16px 0 8px',
  },
  cardText: {
    fontSize: '14px',
    color: 'var(--text-muted)',
    lineHeight: '1.6',
    margin: 0,
  },
};

export default AboutPage;