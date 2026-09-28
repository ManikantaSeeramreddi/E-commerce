import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  fetchAdminMetrics,
  fetchAdminUsers,
  fetchAdminOrders,
  fetchProducts,
  addProductToDB,
  updateProductInDB,
  deleteProductFromDB,
  updateOrderStatusInDB,
} from '../services/api';
import Loader from '../components/common/Loader';
import {
  Users,
  DollarSign,
  Package,
  ShoppingBag,
  PlusCircle,
  Edit2,
  Trash2,
  LogOut,
  Search,
  CheckCircle,
  Layers,
  X,
} from 'lucide-react';

const AdminDashboard = () => {
  const { user, logout, isAdmin, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'products' | 'orders' | 'users'
  const [loading, setLoading] = useState(true);

  const [metrics, setMetrics] = useState({
    totalUsers: 0,
    totalProducts: 0,
    totalOrders: 0,
    totalRevenue: 0,
    totalStock: 0,
  });
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [users, setUsers] = useState([]);

  // Search & Filter
  const [prodSearch, setProdSearch] = useState('');
  const [prodCat, setProdCat] = useState('all');

  // Modal / Form state
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    category: 'mobiles',
    price: '',
    stock: '',
    image: '',
    description: '',
    tag: 'Trending',
  });

  // Strict route guard
  useEffect(() => {
    if (!authLoading && (!user || user.role !== 'admin')) {
      navigate('/admin/login', { replace: true });
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (isAdmin) {
      loadAllDashboardData();
    }
  }, [isAdmin]);

  const loadAllDashboardData = async () => {
    setLoading(true);
    try {
      const [mRes, pRes, oRes, uRes] = await Promise.all([
        fetchAdminMetrics(),
        fetchProducts(),
        fetchAdminOrders(),
        fetchAdminUsers(),
      ]);

      setMetrics(mRes.metrics || {});
      setProducts(pRes || []);
      setOrders(oRes || []);
      setUsers(uRes || []);
    } catch (err) {
      console.error('Error loading dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleOpenAdd = () => {
    setIsEditing(false);
    setEditingId(null);
    setFormData({
      title: '',
      category: 'mobiles',
      price: '',
      stock: '20',
      image: '',
      description: '',
      tag: 'Trending',
    });
  };

  const handleOpenEdit = (item) => {
    setIsEditing(true);
    setEditingId(item.id || item._id);
    setFormData({
      title: item.title,
      category: item.category,
      price: item.price,
      stock: item.stock || 20,
      image: item.image,
      description: item.description || '',
      tag: item.tag || 'Trending',
    });
  };

  const handleSaveProduct = async (e) => {
    e.preventDefault();
    try {
      if (isEditing) {
        const updated = await updateProductInDB(editingId, formData);
        setProducts((prev) => prev.map((p) => ((p.id || p._id) === editingId ? updated : p)));
        alert('Product updated successfully in MongoDB!');
      } else {
        const created = await addProductToDB(formData);
        setProducts((prev) => [created, ...prev]);
        alert('New product saved to MongoDB!');
      }
      handleOpenAdd();
      loadAllDashboardData();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleDeleteProduct = async (id) => {
    if (window.confirm('Delete this product permanently from MongoDB?')) {
      try {
        await deleteProductFromDB(id);
        setProducts((prev) => prev.filter((p) => (p.id || p._id) !== id));
        loadAllDashboardData();
      } catch (err) {
        alert(err.message);
      }
    }
  };

  const handleOrderStatusChange = async (orderId, newStatus) => {
    try {
      const updated = await updateOrderStatusInDB(orderId, newStatus);
      setOrders((prev) => prev.map((o) => (o._id === orderId ? updated : o)));
    } catch (err) {
      alert(err.message);
    }
  };

  const filteredProducts = products.filter((p) => {
    const matchCat = prodCat === 'all' || p.category === prodCat;
    const matchSearch = !prodSearch || p.title.toLowerCase().includes(prodSearch.toLowerCase());
    return matchCat && matchSearch;
  });

  if (authLoading || loading) return <Loader />;
  if (!isAdmin) return null;

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <div>
          <h1 style={{ fontSize: '28px', fontWeight: '800', margin: 0, color: 'var(--text-main)' }}>
            Admin Dashboard
          </h1>
          <p style={{ color: 'var(--text-muted)', margin: '4px 0 0', fontSize: '13px' }}>
            Logged in as: <span style={{ color: '#f42c37', fontWeight: '600' }}>{user.email}</span>
          </p>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button onClick={() => navigate('/cart')} className="btn-red" style={{ background: '#2563eb' }}>
            <ShoppingBag size={16} />
            <span>Admin Cart</span>
          </button>
          <button
            onClick={() => {
              logout();
              navigate('/admin/login');
            }}
            className="btn-red"
            style={{ background: '#374151' }}
          >
            <LogOut size={16} />
            <span>Logout</span>
          </button>
        </div>
      </div>

      {/* Analytics KPI Metric Cards */}
      <div style={styles.kpiGrid}>
        <div style={styles.kpiCard}>
          <div style={{ ...styles.kpiIcon, background: 'rgba(244, 44, 55, 0.1)', color: '#f42c37' }}>
            <DollarSign size={26} />
          </div>
          <div>
            <span style={styles.kpiLabel}>Total Revenue</span>
            <h3 style={styles.kpiValue}>${metrics.totalRevenue?.toLocaleString()}</h3>
          </div>
        </div>

        <div style={styles.kpiCard}>
          <div style={{ ...styles.kpiIcon, background: 'rgba(37, 99, 235, 0.1)', color: '#2563eb' }}>
            <ShoppingBag size={26} />
          </div>
          <div>
            <span style={styles.kpiLabel}>Total Orders</span>
            <h3 style={styles.kpiValue}>{metrics.totalOrders}</h3>
          </div>
        </div>

        <div style={styles.kpiCard}>
          <div style={{ ...styles.kpiIcon, background: 'rgba(16, 185, 129, 0.1)', color: '#10b981' }}>
            <Users size={26} />
          </div>
          <div>
            <span style={styles.kpiLabel}>Registered Users</span>
            <h3 style={styles.kpiValue}>{metrics.totalUsers}</h3>
          </div>
        </div>

        <div style={styles.kpiCard}>
          <div style={{ ...styles.kpiIcon, background: 'rgba(245, 158, 11, 0.1)', color: '#f59e0b' }}>
            <Package size={26} />
          </div>
          <div>
            <span style={styles.kpiLabel}>Products / Live Stock</span>
            <h3 style={styles.kpiValue}>
              {metrics.totalProducts} / {metrics.totalStock}
            </h3>
          </div>
        </div>
      </div>

      {/* Nav Tabs */}
      <div style={styles.tabsBar}>
        {['overview', 'products', 'orders', 'users'].map((t) => (
          <button
            key={t}
            onClick={() => setActiveTab(t)}
            style={{
              ...styles.tabButton,
              borderBottom: activeTab === t ? '3px solid #f42c37' : '3px solid transparent',
              color: activeTab === t ? '#f42c37' : 'var(--text-muted)',
              fontWeight: activeTab === t ? '700' : '500',
            }}
          >
            {t.toUpperCase()}
          </button>
        ))}
      </div>

      {/* TAB 1: OVERVIEW */}
      {activeTab === 'overview' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '24px' }}>
          <div style={styles.panelCard}>
            <h3 style={styles.panelTitle}>Recent Orders</h3>
            {orders.slice(0, 5).map((o) => (
              <div key={o._id} style={styles.listRow}>
                <div>
                  <strong style={{ fontSize: '13px' }}>{o.customerName}</strong>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                    ${o.totalAmount} • {o.items?.length} items
                  </div>
                </div>
                <span style={styles.badge(o.orderStatus)}>{o.orderStatus}</span>
              </div>
            ))}
          </div>

          <div style={styles.panelCard}>
            <h3 style={styles.panelTitle}>Recent Registered Users</h3>
            {users.slice(0, 5).map((u) => (
              <div key={u._id} style={styles.listRow}>
                <div>
                  <strong style={{ fontSize: '13px' }}>{u.name}</strong>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{u.email}</div>
                </div>
                <span style={{ fontSize: '11px', color: '#10b981', fontWeight: 'bold' }}>{u.status}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: PRODUCT MANAGEMENT */}
      {activeTab === 'products' && (
        <div style={{ display: 'grid', gridTemplateColumns: '320px 1fr', gap: '24px' }}>
          {/* Add / Edit Form */}
          <div style={styles.panelCard}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
              <h3 style={{ ...styles.panelTitle, margin: 0 }}>
                {isEditing ? 'Edit Product' : 'Add New Product'}
              </h3>
              {isEditing && (
                <button onClick={handleOpenAdd} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                  <X size={18} color="var(--text-muted)" />
                </button>
              )}
            </div>

            <form onSubmit={handleSaveProduct} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <input
                required
                type="text"
                name="title"
                placeholder="Product Title"
                value={formData.title}
                onChange={handleInputChange}
                style={styles.input}
              />
              <div style={{ display: 'flex', gap: '8px' }}>
                <select name="category" value={formData.category} onChange={handleInputChange} style={styles.input}>
                  <option value="mobiles">Mobiles</option>
                  <option value="laptops">Laptops</option>
                  <option value="audio">Audio</option>
                  <option value="gadgets">Gadgets</option>
                  <option value="consoles">Consoles</option>
                  <option value="accessories">Accessories</option>
                </select>
                <input
                  required
                  type="number"
                  name="price"
                  placeholder="Price ($)"
                  value={formData.price}
                  onChange={handleInputChange}
                  style={styles.input}
                />
              </div>
              <input
                required
                type="number"
                name="stock"
                placeholder="Stock Quantity"
                value={formData.stock}
                onChange={handleInputChange}
                style={styles.input}
              />
              <input
                required
                type="url"
                name="image"
                placeholder="Image URL"
                value={formData.image}
                onChange={handleInputChange}
                style={styles.input}
              />
              <input
                type="text"
                name="tag"
                placeholder="Tag (Trending, Best Seller)"
                value={formData.tag}
                onChange={handleInputChange}
                style={styles.input}
              />
              <textarea
                rows="2"
                name="description"
                placeholder="Description"
                value={formData.description}
                onChange={handleInputChange}
                style={{ ...styles.input, resize: 'none' }}
              />
              <button type="submit" className="btn-red" style={{ width: '100%', marginTop: '6px' }}>
                <PlusCircle size={16} />
                <span>{isEditing ? 'Update in MongoDB' : 'Save to MongoDB'}</span>
              </button>
            </form>
          </div>

          {/* Product Table */}
          <div style={styles.panelCard}>
            <div style={{ display: 'flex', gap: '12px', marginBottom: '16px' }}>
              <input
                type="text"
                placeholder="Search products..."
                value={prodSearch}
                onChange={(e) => setProdSearch(e.target.value)}
                style={{ ...styles.input, maxWidth: '240px' }}
              />
              <select value={prodCat} onChange={(e) => setProdCat(e.target.value)} style={styles.input}>
                <option value="all">All Categories</option>
                <option value="mobiles">Mobiles</option>
                <option value="laptops">Laptops</option>
                <option value="audio">Audio</option>
                <option value="gadgets">Gadgets</option>
                <option value="consoles">Consoles</option>
                <option value="accessories">Accessories</option>
              </select>
            </div>

            <div style={{ overflowX: 'auto' }}>
              <table style={styles.table}>
                <thead>
                  <tr style={{ textAlign: 'left', borderBottom: '1px solid #e5e7eb' }}>
                    <th style={styles.th}>Item</th>
                    <th style={styles.th}>Category</th>
                    <th style={styles.th}>Price</th>
                    <th style={styles.th}>Stock</th>
                    <th style={styles.th}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredProducts.map((p) => {
                    const pid = p.id || p._id;
                    return (
                      <tr key={pid} style={{ borderBottom: '1px solid rgba(0,0,0,0.05)' }}>
                        <td style={styles.td}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <img src={p.image} alt={p.title} style={{ width: '34px', height: '34px', objectFit: 'contain' }} />
                            <span style={{ fontWeight: '600', fontSize: '13px' }}>{p.title}</span>
                          </div>
                        </td>
                        <td style={styles.td}>{p.category}</td>
                        <td style={styles.td}>${p.price}</td>
                        <td style={styles.td}>{p.stock || 20}</td>
                        <td style={styles.td}>
                          <div style={{ display: 'flex', gap: '8px' }}>
                            <button onClick={() => handleOpenEdit(p)} style={styles.actionBtn}>
                              <Edit2 size={15} color="#2563eb" />
                            </button>
                            <button onClick={() => handleDeleteProduct(pid)} style={styles.actionBtn}>
                              <Trash2 size={15} color="#ef4444" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: ORDER MANAGEMENT */}
      {activeTab === 'orders' && (
        <div style={styles.panelCard}>
          <h3 style={styles.panelTitle}>Customer Orders ({orders.length})</h3>
          <div style={{ overflowX: 'auto' }}>
            <table style={styles.table}>
              <thead>
                <tr style={{ textAlign: 'left', borderBottom: '1px solid #e5e7eb' }}>
                  <th style={styles.th}>Order ID</th>
                  <th style={styles.th}>Customer</th>
                  <th style={styles.th}>Items</th>
                  <th style={styles.th}>Delivery</th>
                  <th style={styles.th}>Total</th>
                  <th style={styles.th}>Payment</th>
                  <th style={styles.th}>Status</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((o) => (
                  <tr key={o._id} style={{ borderBottom: '1px solid rgba(0,0,0,0.05)' }}>
                    <td style={{ ...styles.td, fontFamily: 'monospace' }}>{o._id.substring(o._id.length - 8)}</td>
                    <td style={styles.td}>
                      <strong>{o.customerName}</strong>
                      <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{o.customerEmail}</div>
                      <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{o.customerPhone}</div>
                    </td>
                    <td style={styles.td}>
                      {o.items?.map((item) => (
                        <div key={`${o._id}-${item.productId || item.title}`} style={{ marginBottom: '4px' }}>
                          {item.title} x {item.quantity} (${item.price})
                        </div>
                      ))}
                    </td>
                    <td style={styles.td}>
                      {o.shippingAddress?.street}, {o.shippingAddress?.city}, {o.shippingAddress?.zip}
                    </td>
                    <td style={styles.td}>
                      <strong>${o.totalAmount}</strong>
                      <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                        Subtotal ${o.subtotal} + Tax ${o.tax} + Shipping ${o.shipping} - Discount ${o.discountAmount || 0}
                      </div>
                    </td>
                    <td style={styles.td}>
                      <span style={{ color: '#10b981', fontWeight: 'bold', fontSize: '12px' }}>{o.paymentStatus}</span>
                      <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{o.paymentMethod?.toUpperCase()}</div>
                    </td>
                    <td style={styles.td}>
                      <select
                        value={o.orderStatus}
                        onChange={(e) => handleOrderStatusChange(o._id, e.target.value)}
                        style={{ ...styles.input, padding: '4px 8px', fontSize: '12px' }}
                      >
                        <option value="Processing">Processing</option>
                        <option value="Shipped">Shipped</option>
                        <option value="Delivered">Delivered</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 4: USER MANAGEMENT */}
      {activeTab === 'users' && (
        <div style={styles.panelCard}>
          <h3 style={styles.panelTitle}>Registered MongoDB Users ({users.length})</h3>
          <div style={{ overflowX: 'auto' }}>
            <table style={styles.table}>
              <thead>
                <tr style={{ textAlign: 'left', borderBottom: '1px solid #e5e7eb' }}>
                  <th style={styles.th}>Name</th>
                  <th style={styles.th}>Email</th>
                  <th style={styles.th}>Phone</th>
                  <th style={styles.th}>Role</th>
                  <th style={styles.th}>Joined Date</th>
                  <th style={styles.th}>Status</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u._id} style={{ borderBottom: '1px solid rgba(0,0,0,0.05)' }}>
                    <td style={styles.td}>
                      <strong>{u.name}</strong>
                    </td>
                    <td style={styles.td}>{u.email}</td>
                    <td style={styles.td}>{u.phone || 'N/A'}</td>
                    <td style={styles.td}>
                      <span style={styles.badge(u.role === 'admin' ? 'Delivered' : 'Processing')}>{u.role}</span>
                    </td>
                    <td style={styles.td}>{new Date(u.createdAt).toLocaleDateString()}</td>
                    <td style={styles.td}>
                      <span style={{ color: '#10b981', fontWeight: 'bold' }}>{u.status || 'Active'}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

const styles = {
  container: { maxWidth: '1240px', margin: '0 auto', padding: '30px 20px 80px' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px', marginBottom: '28px' },
  kpiGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px', marginBottom: '28px' },
  kpiCard: { backgroundColor: 'var(--bg-surface)', borderRadius: '18px', padding: '20px', display: 'flex', alignItems: 'center', gap: '16px', border: '1px solid rgba(0,0,0,0.06)' },
  kpiIcon: { width: '52px', height: '52px', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center' },
  kpiLabel: { fontSize: '12px', color: 'var(--text-muted)', fontWeight: '600' },
  kpiValue: { margin: '2px 0 0', fontSize: '22px', fontWeight: '800', color: 'var(--text-main)' },
  tabsBar: { display: 'flex', gap: '20px', borderBottom: '1px solid #e5e7eb', marginBottom: '24px' },
  tabButton: { background: 'none', border: 'none', padding: '10px 6px', fontSize: '14px', cursor: 'pointer' },
  panelCard: { backgroundColor: 'var(--bg-surface)', borderRadius: '20px', padding: '24px', border: '1px solid rgba(0,0,0,0.06)' },
  panelTitle: { fontSize: '17px', fontWeight: '700', margin: '0 0 16px', color: 'var(--text-main)' },
  input: { width: '100%', padding: '10px 12px', borderRadius: '10px', border: '1px solid #e5e7eb', backgroundColor: 'var(--bg-main)', color: 'var(--text-main)', fontSize: '13px', outline: 'none' },
  table: { width: '100%', borderCollapse: 'collapse', fontSize: '13px' },
  th: { padding: '12px 10px', color: 'var(--text-muted)', fontWeight: '600' },
  td: { padding: '12px 10px', color: 'var(--text-main)' },
  actionBtn: { background: 'none', border: 'none', cursor: 'pointer', padding: '4px' },
  listRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: '1px solid rgba(0,0,0,0.05)' },
  badge: (status) => {
    const map = {
      Delivered: { bg: '#dcfce7', text: '#16a34a' },
      Processing: { bg: '#fef3c7', text: '#d97706' },
      Shipped: { bg: '#e0e7ff', text: '#4338ca' },
      Cancelled: { bg: '#fee2e2', text: '#ef4444' },
    };
    const c = map[status] || { bg: '#f3f4f6', text: '#374151' };
    return {
      backgroundColor: c.bg,
      color: c.text,
      padding: '4px 10px',
      borderRadius: '20px',
      fontSize: '11px',
      fontWeight: 'bold',
    };
  },
};

export default AdminDashboard;