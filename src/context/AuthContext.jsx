import React, { createContext, useContext, useState, useEffect } from 'react';

export const AuthContext = createContext(null);
const AUTH_API = 'http://localhost:5000/api/auth';

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const verifySavedSession = async () => {
      const token = localStorage.getItem('eshop_token');
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`${AUTH_API}/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (response.ok) {
          const data = await response.json();
          setUser(data.user);
        } else {
          localStorage.removeItem('eshop_token');
          localStorage.removeItem('eshop_user');
          setUser(null);
        }
      } catch (err) {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    verifySavedSession();
  }, []);

  const signup = async (email, password, name, phone = '') => {
    const response = await fetch(`${AUTH_API}/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, name, phone }),
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Registration failed');
    return data;
  };

  const login = async (email, password) => {
    const response = await fetch(`${AUTH_API}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Invalid email or password');

    localStorage.setItem('eshop_token', data.token);
    localStorage.setItem('eshop_user', JSON.stringify(data.user));
    setUser(data.user);
    return data.user;
  };

  const adminLogin = async (email, password) => {
    const response = await fetch(`${AUTH_API}/admin/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    const isJson = response.headers.get('content-type')?.includes('application/json');
    const data = isJson ? await response.json() : null;

    if (!response.ok) {
      throw new Error(data?.message || 'Admin authentication failed');
    }

    localStorage.setItem('eshop_token', data.token);
    localStorage.setItem('eshop_user', JSON.stringify(data.user));
    setUser(data.user);
    return data.user;
  };

  const logout = () => {
    localStorage.removeItem('eshop_token');
    localStorage.removeItem('eshop_user');
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        signup,
        login,
        adminLogin,
        logout,
        isAuthenticated: !!user,
        isAdmin: user?.role === 'admin',
        loading,
      }}
    >
      {!loading && children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
export default AuthProvider;