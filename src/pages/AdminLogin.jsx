import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ShieldAlert, Lock, Mail, ArrowRight } from 'lucide-react';

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { adminLogin } = useAuth();
  const navigate = useNavigate();

  const handleAdminAuth = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const loggedAdmin = await adminLogin(email.trim(), password);
      if (loggedAdmin && loggedAdmin.role === 'admin') {
        navigate('/admin/dashboard', { replace: true });
      } else {
        setError('Access denied: Unauthorized account.');
      }
    } catch (err) {
      setError(err.message || 'Invalid admin credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.iconCircle}>
          <ShieldAlert size={36} color="#f42c37" />
        </div>
        <h2 style={{ fontSize: '26px', fontWeight: '800', margin: '14px 0 6px', color: 'var(--text-main)' }}>
          Admin Portal Login
        </h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '13px', marginBottom: '24px' }}>
          Restricted access for system administrators.
        </p>

        {error && <div style={styles.errorAlert}>{error}</div>}

        <form onSubmit={handleAdminAuth} style={styles.form}>
          <div style={styles.inputGroup}>
            <Mail size={18} color="var(--text-muted)" />
            <input
              required
              type="email"
              placeholder="Admin Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={styles.input}
            />
          </div>

          <div style={styles.inputGroup}>
            <Lock size={18} color="var(--text-muted)" />
            <input
              required
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={styles.input}
            />
          </div>

          <button type="submit" disabled={loading} className="btn-red" style={styles.submitBtn}>
            <span>{loading ? 'Authenticating...' : 'Access Dashboard'}</span>
            <ArrowRight size={18} />
          </button>
        </form>
      </div>
    </div>
  );
};

const styles = {
  container: {
    minHeight: 'calc(100vh - 140px)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '20px',
  },
  card: {
    backgroundColor: 'var(--bg-surface)',
    borderRadius: '24px',
    padding: '40px 32px',
    maxWidth: '440px',
    width: '100%',
    textAlign: 'center',
    boxShadow: 'var(--card-shadow)',
    border: '1px solid rgba(0,0,0,0.06)',
  },
  iconCircle: {
    width: '70px',
    height: '70px',
    borderRadius: '50%',
    backgroundColor: 'rgba(244, 44, 55, 0.1)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '0 auto',
  },
  errorAlert: {
    backgroundColor: '#fee2e2',
    color: '#ef4444',
    padding: '10px 14px',
    borderRadius: '10px',
    fontSize: '12px',
    marginBottom: '16px',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '14px',
  },
  inputGroup: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    backgroundColor: 'var(--bg-main)',
    border: '1px solid #e5e7eb',
    borderRadius: '14px',
    padding: '12px 16px',
  },
  input: {
    border: 'none',
    outline: 'none',
    background: 'transparent',
    width: '100%',
    color: 'var(--text-main)',
    fontSize: '14px',
  },
  submitBtn: {
    width: '100%',
    padding: '12px',
    marginTop: '6px',
  },
};

export default AdminLogin;