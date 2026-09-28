const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/eshop';
const JWT_SECRET = process.env.JWT_SECRET || 'super_secret_jwt_key_998877_production';

app.use(cors({ origin: 'http://localhost:3000', credentials: true }));
app.use(express.json());

// ==================== DATABASE CONNECTION & INITIAL SEED ====================
mongoose
  .connect(MONGO_URI)
  .then(async () => {
    console.log('✅ Connected to MongoDB Database');
    await seedDedicatedAdmin();
    await seedInitialData();
  })
  .catch((err) => console.error('❌ MongoDB Connection Error:', err));

// ==================== SCHEMAS & MODELS ====================

// 1. Regular User Schema
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true },
  phone: { type: String, default: '' },
  role: { type: String, default: 'user' },
  status: { type: String, enum: ['Active', 'Suspended'], default: 'Active' },
  createdAt: { type: Date, default: Date.now },
  lastLogin: { type: Date, default: Date.now }
});

// 2. Admin Schema
const adminSchema = new mongoose.Schema({
  name: { type: String, default: 'Super Admin Manikanta' },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true },
  role: { type: String, default: 'admin' },
  status: { type: String, default: 'Active' },
  createdAt: { type: Date, default: Date.now },
  lastLogin: { type: Date, default: Date.now }
});

// 3. Product Schema
const productSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  category: { type: String, required: true, lowercase: true, trim: true },
  price: { type: Number, required: true, min: 0 },
  stock: { type: Number, required: true, default: 25, min: 0 },
  image: { type: String, required: true },
  description: { type: String, default: '' },
  tag: { type: String, default: 'Trending' },
  rating: {
    rate: { type: Number, default: 4.8 },
    count: { type: Number, default: 120 }
  },
  createdAt: { type: Date, default: Date.now }
});

// 4. Order Schema
const orderSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  customerName: { type: String, required: true },
  customerEmail: { type: String, required: true },
  customerPhone: { type: String, default: '' },
  items: [
    {
      productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
      title: String,
      category: String,
      price: Number,
      quantity: Number,
      image: String
    }
  ],
  subtotal: { type: Number, required: true },
  tax: { type: Number, required: true },
  shipping: { type: Number, required: true },
  discountAmount: { type: Number, default: 0 },
  couponCode: { type: String, default: '' },
  totalAmount: { type: Number, required: true },
  paymentMethod: { type: String, enum: ['card', 'upi', 'cod'], required: true },
  paymentStatus: { type: String, enum: ['Paid', 'Pending', 'Failed'], default: 'Paid' },
  orderStatus: { type: String, enum: ['Processing', 'Shipped', 'Delivered', 'Cancelled'], default: 'Processing' },
  shippingAddress: {
    street: { type: String, required: true },
    city: { type: String, required: true },
    zip: { type: String, required: true }
  },
  createdAt: { type: Date, default: Date.now }
});

// 5. Cart Schema (Persistent Cart in MongoDB)
const cartSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, required: true, unique: true },
  role: { type: String, default: 'user' },
  items: [
    {
      productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
      title: String,
      price: Number,
      quantity: { type: Number, default: 1 },
      image: String,
      category: String
    }
  ],
  updatedAt: { type: Date, default: Date.now }
});

const User = mongoose.model('User', userSchema);
const Admin = mongoose.model('Admin', adminSchema);
const Product = mongoose.model('Product', productSchema);
const Order = mongoose.model('Order', orderSchema);
const Cart = mongoose.model('Cart', cartSchema);

// ==================== AUTO-SEED LOGIC ====================
async function seedDedicatedAdmin() {
  try {
    const adminEmail = 'manikanta00645@gmail.com';
    const existing = await Admin.findOne({ email: adminEmail });
    const hashedPassword = await bcrypt.hash('manikanta', 10);

    if (!existing) {
      await Admin.create({
        name: 'Super Admin Manikanta',
        email: adminEmail,
        password: hashedPassword,
        role: 'admin'
      });
      console.log('👑 Dedicated Admin Seeded: manikanta00645@gmail.com / manikanta');
    } else {
      existing.password = hashedPassword;
      await existing.save();
    }
  } catch (err) {
    console.error('Error seeding admin:', err);
  }
}

async function seedInitialData() {
  try {
    const prodCount = await Product.countDocuments();
    if (prodCount === 0) {
      const sampleProducts = [
        { title: 'iPhone 15 Pro Max', category: 'mobiles', price: 1199, stock: 45, image: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=800&q=80', description: 'A17 Pro Titanium smartphone.', tag: 'Trending' },
        { title: 'Samsung Galaxy S24 Ultra', category: 'mobiles', price: 1299, stock: 30, image: 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=800&q=80', description: 'Galaxy AI with 200MP camera.', tag: 'Best Seller' },
        { title: 'MacBook Pro 16 M3 Max', category: 'laptops', price: 2499, stock: 20, image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&q=80', description: 'Liquid Retina XDR display.', tag: 'Top Rated' },
        { title: 'Sony WH-1000XM5 Wireless', category: 'audio', price: 399, stock: 65, image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80', description: 'Industry-leading noise cancellation.', tag: 'Best Seller' },
        { title: 'Apple Watch Ultra 2 Titanium', category: 'gadgets', price: 799, stock: 28, image: 'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=800&q=80', description: 'Precision dual-frequency GPS.', tag: 'Trending' },
        { title: 'PlayStation 5 Slim Digital', category: 'consoles', price: 449, stock: 50, image: 'https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=800&q=80', description: '1TB SSD, 4K ray-tracing.', tag: 'Best Seller' },
        { title: 'Logitech MX Master 3S Mouse', category: 'accessories', price: 99, stock: 110, image: 'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=800&q=80', description: '8K DPI quiet clicks sensor.', tag: 'Trending' }
      ];
      await Product.insertMany(sampleProducts);
      console.log('📦 Sample products populated.');
    }

    const orderCount = await Order.countDocuments();
    if (orderCount === 0) {
      await Order.create({
        customerName: 'Kiran Kumar',
        customerEmail: 'kiran@gmail.com',
        customerPhone: '9999999999',
        items: [{ title: 'iPhone 15 Pro Max', price: 1199, quantity: 1, image: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=800&q=80' }],
        subtotal: 1199,
        tax: 95.92,
        shipping: 0,
        totalAmount: 1199,
        paymentMethod: 'card',
        paymentStatus: 'Paid',
        orderStatus: 'Delivered',
        shippingAddress: { street: '1 Main Street', city: 'Bengaluru', zip: '560001' }
      });
      console.log('🛒 Initial sample order seeded.');
    }
  } catch (err) {
    console.error('Error seeding store data:', err);
  }
}

// ==================== AUTH MIDDLEWARE ====================
const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Unauthorized. Token missing.' });
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid or expired token.' });
  }
};

const verifyAdmin = (req, res, next) => {
  verifyToken(req, res, () => {
    if (req.user && req.user.role === 'admin') {
      next();
    } else {
      return res.status(403).json({ message: 'Access Denied: Administrator privilege required.' });
    }
  });
};

// ==================== AUTHENTICATION ROUTES ====================

// 1. User Registration
app.post('/api/auth/register', async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email, and password are required.' });
    }

    const cleanEmail = email.toLowerCase().trim();
    const existing = await User.findOne({ email: cleanEmail });
    if (existing) {
      return res.status(400).json({ message: 'An account with this email already exists.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({
      name: name.trim(),
      email: cleanEmail,
      phone: (phone || '').trim(),
      password: hashedPassword,
      role: 'user'
    });

    res.status(201).json({ message: 'Account registered successfully in MongoDB!', userId: newUser._id });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// 2. User Login (Authenticates against User collection)
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const cleanEmail = (email || '').toLowerCase().trim();

    const user = await User.findOne({ email: cleanEmail });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials. User not found.' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Incorrect password.' });
    }

    user.lastLogin = new Date();
    await user.save();

    const token = jwt.sign(
      { uid: user._id, email: user.email, name: user.name, role: 'user' },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      token,
      user: { uid: user._id, name: user.name, email: user.email, phone: user.phone, role: 'user' }
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// 3. Dedicated Admin Login (Authenticates strictly against Admin collection)
app.post('/api/auth/admin/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const cleanEmail = (email || '').toLowerCase().trim();

    const admin = await Admin.findOne({ email: cleanEmail });
    if (!admin) {
      return res.status(403).json({ message: 'Access Denied: Admin record not found.' });
    }

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid admin credentials.' });
    }

    admin.lastLogin = new Date();
    await admin.save();

    const token = jwt.sign(
      { uid: admin._id, email: admin.email, name: admin.name, role: 'admin' },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      token,
      user: { uid: admin._id, name: admin.name, email: admin.email, role: 'admin' }
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// 4. Token Check Endpoint
app.get('/api/auth/me', verifyToken, async (req, res) => {
  try {
    let account = null;
    if (req.user.role === 'admin') {
      account = await Admin.findById(req.user.uid).select('-password');
    } else {
      account = await User.findById(req.user.uid).select('-password');
    }

    if (!account) return res.status(404).json({ message: 'Account not found.' });

    res.json({
      user: { uid: account._id, name: account.name, email: account.email, role: account.role }
    });
  } catch (err) {
    res.status(401).json({ message: 'Invalid session' });
  }
});

// ==================== PRODUCT CRUD APIS ====================

// Public Fetch
app.get('/api/products', async (req, res) => {
  try {
    const products = await Product.find({}).sort({ _id: -1 });
    res.json(products.map((p) => ({ ...p._doc, id: p._id.toString() })));
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Admin Add Product
app.post('/api/products', verifyAdmin, async (req, res) => {
  try {
    const { title, category, price, stock, image, description, tag } = req.body;
    const newProduct = await Product.create({
      title,
      category: (category || 'mobiles').toLowerCase().trim(),
      price: parseFloat(price),
      stock: parseInt(stock) || 20,
      image,
      description: description || '',
      tag: tag || 'Trending'
    });
    res.status(201).json({ ...newProduct._doc, id: newProduct._id.toString() });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Admin Update Product
app.put('/api/products/:id', verifyAdmin, async (req, res) => {
  try {
    const { title, category, price, stock, image, description, tag } = req.body;
    const updated = await Product.findByIdAndUpdate(
      req.params.id,
      {
        title,
        category: category?.toLowerCase().trim(),
        price: parseFloat(price),
        stock: parseInt(stock),
        image,
        description,
        tag
      },
      { new: true }
    );
    if (!updated) return res.status(404).json({ message: 'Product not found.' });
    res.json({ ...updated._doc, id: updated._id.toString() });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Admin Delete Product
app.delete('/api/products/:id', verifyAdmin, async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: 'Product deleted successfully from MongoDB.' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ==================== ADMIN DASHBOARD METRICS & MANAGEMENT ====================

// Customer order creation
app.post('/api/orders', verifyToken, async (req, res) => {
  try {
    const {
      customerName,
      customerEmail,
      customerPhone,
      items,
      subtotal,
      tax,
      shipping,
      discountAmount,
      couponCode,
      totalAmount,
      paymentMethod,
      shippingAddress,
    } = req.body;

    if (!customerName || !customerEmail || !customerPhone || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: 'Customer details and at least one item are required.' });
    }
    if (!shippingAddress?.street || !shippingAddress?.city || !shippingAddress?.zip) {
      return res.status(400).json({ message: 'Complete shipping address is required.' });
    }
    if (!['card', 'upi', 'cod'].includes(paymentMethod)) {
      return res.status(400).json({ message: 'A valid payment method is required.' });
    }

    const normalizedCoupon = (couponCode || '').trim().toUpperCase();
    const orderSubtotal = Number(subtotal);
    const orderTax = Number(tax);
    const orderShipping = Number(shipping);
    let expectedDiscount = 0;
    if (normalizedCoupon === 'SAVE10') expectedDiscount = orderSubtotal * 0.1;
    if (normalizedCoupon === 'TECH20' && orderSubtotal >= 500) expectedDiscount = orderSubtotal * 0.2;
    if (normalizedCoupon === 'FREESHIP') expectedDiscount = orderShipping;
    if (normalizedCoupon && !['SAVE10', 'TECH20', 'FREESHIP'].includes(normalizedCoupon)) {
      return res.status(400).json({ message: 'Invalid coupon code.' });
    }
    if (normalizedCoupon === 'TECH20' && orderSubtotal < 500) {
      return res.status(400).json({ message: 'TECH20 requires a $500 subtotal.' });
    }
    const expectedTotal = Math.max(0, orderSubtotal + orderTax + orderShipping - expectedDiscount);
    if (Math.abs(Number(totalAmount) - expectedTotal) > 0.01) {
      return res.status(400).json({ message: 'Order total does not match the applied discount.' });
    }

    const order = await Order.create({
      userId: req.user.uid,
      customerName: customerName.trim(),
      customerEmail: customerEmail.trim().toLowerCase(),
      customerPhone: customerPhone.trim(),
      items: items.map((item) => ({
        ...(item.productId && mongoose.Types.ObjectId.isValid(item.productId)
          ? { productId: item.productId }
          : {}),
        title: item.title,
        category: item.category || '',
        price: Number(item.price),
        quantity: Number(item.quantity),
        image: item.image || '',
      })),
      subtotal: orderSubtotal,
      tax: orderTax,
      shipping: orderShipping,
      discountAmount: expectedDiscount,
      couponCode: normalizedCoupon,
      totalAmount: expectedTotal,
      paymentMethod,
      paymentStatus: paymentMethod === 'cod' ? 'Pending' : 'Paid',
      shippingAddress: {
        street: shippingAddress.street.trim(),
        city: shippingAddress.city.trim(),
        zip: shippingAddress.zip.trim(),
      },
    });

    res.status(201).json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Dashboard Aggregated Analytics API
app.get('/api/admin/metrics', verifyAdmin, async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalProducts = await Product.countDocuments();
    const totalOrders = await Order.countDocuments();

    const orders = await Order.find({});
    const totalRevenue = orders.reduce((sum, ord) => sum + (ord.totalAmount || 0), 0);

    const products = await Product.find({});
    const totalStock = products.reduce((sum, prod) => sum + (prod.stock || 0), 0);

    const recentOrders = await Order.find({}).sort({ createdAt: -1 }).limit(5);
    const recentUsers = await User.find({}).select('-password').sort({ createdAt: -1 }).limit(5);

    res.json({
      metrics: {
        totalUsers,
        totalProducts,
        totalOrders,
        totalRevenue,
        totalStock
      },
      recentOrders,
      recentUsers
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Admin Get All Users
app.get('/api/admin/users', verifyAdmin, async (req, res) => {
  try {
    const users = await User.find({}).select('-password').sort({ createdAt: -1 });
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Admin Get All Orders
app.get('/api/admin/orders', verifyAdmin, async (req, res) => {
  try {
    const orders = await Order.find({}).sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Admin Update Order Status
app.patch('/api/admin/orders/:id/status', verifyAdmin, async (req, res) => {
  try {
    const { orderStatus } = req.body;
    const order = await Order.findByIdAndUpdate(req.params.id, { orderStatus }, { new: true });
    res.json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ==================== CART PERSISTENCE APIS ====================

// Fetch Cart (Accessible by both Users and Admins)
app.get('/api/cart', verifyToken, async (req, res) => {
  try {
    let cart = await Cart.findOne({ userId: req.user.uid });
    if (!cart) {
      cart = await Cart.create({ userId: req.user.uid, role: req.user.role, items: [] });
    }
    res.json(cart.items);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Sync Cart
app.post('/api/cart/sync', verifyToken, async (req, res) => {
  try {
    const { items } = req.body;
    const cart = await Cart.findOneAndUpdate(
      { userId: req.user.uid },
      { items, updatedAt: new Date() },
      { new: true, upsert: true }
    );
    res.json(cart.items);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.listen(PORT, () => console.log(`🚀 Store Server running on http://localhost:${PORT}`));