import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div style={{ textAlign: 'center', padding: '60px 20px' }}>
      <h1 style={{ fontSize: '48px', color: '#0f172a', margin: 0 }}>404</h1>
      <p style={{ color: '#64748b', fontSize: '18px' }}>Page not found.</p>
      <Link to="/" style={{ color: '#2563eb', textDecoration: 'none', fontWeight: 'bold' }}>
        Return to Home
      </Link>
    </div>
  );
};

export default NotFound;