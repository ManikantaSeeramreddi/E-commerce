const API_BASE_URL = 'http://localhost:5000/api';

const getAuthHeaders = () => {
  const token = localStorage.getItem('eshop_token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

// 1. Products
export const fetchProducts = async () => {
  const res = await fetch(`${API_BASE_URL}/products`);
  if (!res.ok) throw new Error('Failed to fetch products');
  return await res.json();
};

export const addProductToDB = async (data) => {
  const res = await fetch(`${API_BASE_URL}/products`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message || 'Failed to add product');
  }
  return await res.json();
};

export const updateProductInDB = async (id, data) => {
  const res = await fetch(`${API_BASE_URL}/products/${id}`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message || 'Failed to update product');
  }
  return await res.json();
};

export const createOrderInDB = async (data) => {
  const res = await fetch(`${API_BASE_URL}/orders`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });
  const responseText = await res.text();
  let result = null;
  try {
    result = responseText ? JSON.parse(responseText) : null;
  } catch {
    result = null;
  }
  if (!result) {
    result = { message: `Order service returned an invalid response (${res.status}). Restart the backend server and try again.` };
  }
  if (!res.ok) throw new Error(result.message || 'Failed to create order');
  return result;
};

export const deleteProductFromDB = async (id) => {
  const res = await fetch(`${API_BASE_URL}/products/${id}`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message || 'Failed to delete product');
  }
  return await res.json();
};

// 2. Admin Analytics, Users, & Orders
export const fetchAdminMetrics = async () => {
  const res = await fetch(`${API_BASE_URL}/admin/metrics`, { headers: getAuthHeaders() });
  if (!res.ok) throw new Error('Failed to load metrics');
  return await res.json();
};

export const fetchAdminUsers = async () => {
  const res = await fetch(`${API_BASE_URL}/admin/users`, { headers: getAuthHeaders() });
  if (!res.ok) throw new Error('Failed to load users');
  return await res.json();
};

export const fetchAdminOrders = async () => {
  const res = await fetch(`${API_BASE_URL}/admin/orders`, { headers: getAuthHeaders() });
  if (!res.ok) throw new Error('Failed to load orders');
  return await res.json();
};

export const updateOrderStatusInDB = async (id, orderStatus) => {
  const res = await fetch(`${API_BASE_URL}/admin/orders/${id}/status`, {
    method: 'PATCH',
    headers: getAuthHeaders(),
    body: JSON.stringify({ orderStatus }),
  });
  if (!res.ok) throw new Error('Failed to update status');
  return await res.json();
};

// 3. Cart Sync
export const fetchUserCart = async () => {
  const res = await fetch(`${API_BASE_URL}/cart`, { headers: getAuthHeaders() });
  if (!res.ok) return [];
  return await res.json();
};

export const syncUserCart = async (items) => {
  const res = await fetch(`${API_BASE_URL}/cart/sync`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify({ items }),
  });
  if (!res.ok) return items;
  return await res.json();
};