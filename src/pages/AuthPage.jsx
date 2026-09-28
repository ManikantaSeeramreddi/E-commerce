import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Mail, Lock, User, Phone, ArrowRight, ShieldCheck, CheckCircle2 } from 'lucide-react';

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const { login, signup } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // If user was trying to access /cart, remember destination
  const targetDestination = location.state?.from || '/cart';

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');
    setLoading(true);

    try {
      if (isLogin) {
        // --- LOGIN FLOW ---
        await login(formData.email.trim(), formData.password);
        // Redirect directly to the Cart page after successful login
        navigate(targetDestination, { replace: true });
      } else {
        // --- REGISTRATION FLOW ---
        if (formData.password !== formData.confirmPassword) {
          setError('Passwords do not match.');
          setLoading(false);
          return;
        }
        if (formData.password.length < 6) {
          setError('Password must be at least 6 characters.');
          setLoading(false);
          return;
        }

        await signup(
          formData.email.trim(),
          formData.password,
          formData.name.trim(),
          formData.phone.trim()
        );

        // 1. Switch automatically to Login form
        setIsLogin(true);
        // 2. Display success feedback
        setSuccessMsg('Account created successfully in MongoDB! Please enter your password to log in.');
        // 3. Clear passwords but retain email for easy login
        setFormData((prev) => ({ ...prev, password: '', confirmPassword: '' }));
      }
    } catch (err) {
      setError(err.message || 'Could not connect to authentication server.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.banner}>
          <div>
            <span style={styles.brandTag}>ESHOP AUTHENTICATION</span>
            <h2 style={styles.bannerTitle}>
              {isLogin ? 'Sign In to Access Cart' : 'Create Account'}
            </h2>
            <p style={styles.bannerSub}>
              {isLogin
                ? 'Sign in to access your cart, place orders, and manage account details.'
                : 'Create an account to securely save your cart and sync orders across devices.'}
            </p>
          </div>

          <div style={styles.perksList}>
            <div style={styles.perkItem}>
              <ShieldCheck size={18} color="#fdc62e" />
              <span>Cart Protected & Locked</span>
            </div>
            <div style={styles.perkItem}>
              <ShieldCheck size={18} color="#fdc62e" />
              <span>MongoDB Enterprise Security</span>
            </div>
          </div>
        </div>

        <div style={styles.formContainer}>
          <div style={styles.tabsWrapper}>
            <button
              type="button"
              onClick={() => {
                setIsLogin(true);
                setError('');
                setSuccessMsg('');
              }}
              style={{
                ...styles.tabBtn,
                borderBottom: isLogin ? '3px solid #f42c37' : '3px solid transparent',
                color: isLogin ? '#f42c37' : 'var(--text-muted)',
                fontWeight: isLogin ? '700' : '500',
              }}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => {
                setIsLogin(false);
                setError('');
                setSuccessMsg('');
              }}
              style={{
                ...styles.tabBtn,
                borderBottom: !isLogin ? '3px solid #f42c37' : '3px solid transparent',
                color: !isLogin ? '#f42c37' : 'var(--text-muted)',
                fontWeight: !isLogin ? '700' : '500',
              }}
            >
              Create Account
            </button>
          </div>

          {error && <div style={styles.errorAlert}>{error}</div>}

          {successMsg && (
            <div style={styles.successAlert}>
              <CheckCircle2 size={16} />
              <span>{successMsg}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} style={styles.form}>
            {!isLogin && (
              <>
                <div style={styles.inputGroup}>
                  <User size={18} color="var(--text-muted)" />
                  <input
                    required
                    type="text"
                    name="name"
                    placeholder="Full Name"
                    value={formData.name}
                    onChange={handleChange}
                    style={styles.input}
                  />
                </div>
                <div style={styles.inputGroup}>
                  <Phone size={18} color="var(--text-muted)" />
                  <input
                    type="tel"
                    name="phone"
                    placeholder="Phone Number (Optional)"
                    value={formData.phone}
                    onChange={handleChange}
                    style={styles.input}
                  />
                </div>
              </>
            )}

            <div style={styles.inputGroup}>
              <Mail size={18} color="var(--text-muted)" />
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

            <div style={styles.inputGroup}>
              <Lock size={18} color="var(--text-muted)" />
              <input
                required
                type="password"
                name="password"
                placeholder="Password (min 6 characters)"
                value={formData.password}
                onChange={handleChange}
                style={styles.input}
              />
            </div>

            {!isLogin && (
              <div style={styles.inputGroup}>
                <Lock size={18} color="var(--text-muted)" />
                <input
                  required
                  type="password"
                  name="confirmPassword"
                  placeholder="Confirm Password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  style={styles.input}
                />
              </div>
            )}

            <button type="submit" disabled={loading} className="btn-red" style={styles.submitBtn}>
              <span>
                {loading
                  ? 'Processing...'
                  : isLogin
                  ? 'Sign In & Open Cart'
                  : 'Register Account'}
              </span>
              <ArrowRight size={18} />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    minHeight: 'calc(100vh - 120px)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '40px 20px',
  },
  card: {
    backgroundColor: 'var(--bg-surface)',
    borderRadius: '28px',
    overflow: 'hidden',
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
    maxWidth: '880px',
    width: '100%',
    boxShadow: 'var(--card-shadow)',
    border: '1px solid rgba(0,0,0,0.06)',
  },
  banner: {
    background: 'linear-gradient(135deg, #f42c37 0%, #111827 100%)',
    color: '#ffffff',
    padding: '48px 36px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    gap: '30px',
  },
  brandTag: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    padding: '4px 12px',
    borderRadius: '20px',
    fontSize: '11px',
    fontWeight: 'bold',
    letterSpacing: '1px',
  },
  bannerTitle: {
    fontSize: '32px',
    fontWeight: '800',
    margin: '16px 0 10px',
    lineHeight: 1.2,
  },
  bannerSub: {
    fontSize: '14px',
    opacity: 0.9,
    lineHeight: '1.6',
    margin: 0,
  },
  perksList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  perkItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    fontSize: '13px',
    fontWeight: '500',
  },
  formContainer: {
    padding: '40px 36px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
  },
  tabsWrapper: {
    display: 'flex',
    gap: '24px',
    borderBottom: '1px solid #e5e7eb',
    marginBottom: '24px',
  },
  tabBtn: {
    background: 'none',
    border: 'none',
    padding: '10px 4px',
    fontSize: '16px',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  },
  errorAlert: {
    backgroundColor: '#fee2e2',
    color: '#ef4444',
    padding: '10px 14px',
    borderRadius: '10px',
    fontSize: '13px',
    marginBottom: '16px',
  },
  successAlert: {
    backgroundColor: '#dcfce7',
    color: '#16a34a',
    padding: '10px 14px',
    borderRadius: '10px',
    fontSize: '13px',
    marginBottom: '16px',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
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
    padding: '14px',
    marginTop: '10px',
    fontSize: '15px',
  },
};

export default AuthPage;