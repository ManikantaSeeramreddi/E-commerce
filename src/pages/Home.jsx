import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { fetchProducts } from '../services/api';
import { useCart } from '../context/CartContext';
import { useScrollReveal } from '../hooks/useScrollReveal';
import Loader from '../components/common/Loader';
import { Search, ShoppingCart, ArrowUp, Heart } from 'lucide-react';
import { useWishlist } from '../context/WishlistContext';

const categories = [
  { id: 'all', label: 'All Products' },
  { id: 'mobiles', label: 'Mobiles' },
  { id: 'laptops', label: 'Laptops' },
  { id: 'audio', label: 'Audio & Headphones' },
  { id: 'gadgets', label: 'Smartwatches & VR' },
  { id: 'consoles', label: 'Gaming Consoles' },
  { id: 'accessories', label: 'Accessories' },
];

const DEFAULT_PRODUCTS = [
  // Mobiles
  { id: 'm1', title: 'iPhone 15 Pro Max', category: 'mobiles', price: 1199, image: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=800&q=80', description: 'A17 Pro titanium design.', tag: 'Trending' },
  { id: 'm2', title: 'Samsung Galaxy S24 Ultra', category: 'mobiles', price: 1299, image: 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=800&q=80', description: 'Galaxy AI with 200MP camera.', tag: 'Best Seller' },
  { id: 'm3', title: 'Google Pixel 8 Pro', category: 'mobiles', price: 999, image: 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=800&q=80', description: 'Google Tensor G3 chip.', tag: 'Top Rated' },
  { id: 'm4', title: 'OnePlus 12 5G (512GB)', category: 'mobiles', price: 799, image: 'https://images.unsplash.com/photo-1565849904461-04a58ad377e0?w=800&q=80', description: 'Hasselblad camera tuned.', tag: 'Trending' },
  { id: 'm5', title: 'Xiaomi 14 Ultra Ceramic', category: 'mobiles', price: 1099, image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800&q=80', description: 'Leica Quad 50MP sensors.', tag: 'Trending' },
  { id: 'm6', title: 'iPhone 14 (128GB)', category: 'mobiles', price: 699, image: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=800&q=80', description: 'Super Retina XDR display.', tag: 'Best Seller' },
  { id: 'm7', title: 'Sony Xperia 1 V 4K HDR', category: 'mobiles', price: 1299, image: 'https://images.unsplash.com/photo-1580910051074-3eb694886505?w=800&q=80', description: '4K OLED 120Hz display.', tag: 'Top Rated' },
  { id: 'm8', title: 'Nothing Phone (2) Dark Gray', category: 'mobiles', price: 599, image: 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=800&q=80', description: 'Glyph Interface.', tag: 'Trending' },
  { id: 'm9', title: 'ASUS ROG Phone 8 Pro', category: 'mobiles', price: 1199, image: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=800&q=80', description: '165Hz AMOLED gaming phone.', tag: 'Top Rated' },
  { id: 'm10', title: 'Motorola Edge 50 Ultra', category: 'mobiles', price: 849, image: 'https://images.unsplash.com/photo-1585060544812-6b45742d762f?w=800&q=80', description: 'Real wood rear finish.', tag: 'Trending' },

  // Laptops
  { id: 'l1', title: 'MacBook Pro 16 M3 Max', category: 'laptops', price: 2499, image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&q=80', description: 'Liquid Retina XDR display.', tag: 'Top Rated' },
  { id: 'l2', title: 'Dell XPS 15 OLED Touch', category: 'laptops', price: 1899, image: 'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=800&q=80', description: 'Intel Core i9 OLED.', tag: 'Best Seller' },
  { id: 'l3', title: 'MacBook Air 15 M3 Chip', category: 'laptops', price: 1299, image: 'https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=800&q=80', description: 'Silent fanless architecture.', tag: 'Trending' },
  { id: 'l4', title: 'ASUS ROG Zephyrus G14 OLED', category: 'laptops', price: 1599, image: 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=800&q=80', description: 'AMD Ryzen 9, RTX 4070.', tag: 'Top Rated' },
  { id: 'l5', title: 'Lenovo ThinkPad X1 Carbon Gen 12', category: 'laptops', price: 1649, image: 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=800&q=80', description: 'Ultralight carbon chassis.', tag: 'Best Seller' },
  { id: 'l6', title: 'HP Spectre x360 2-in-1 Touch', category: 'laptops', price: 1499, image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=800&q=80', description: '2.8K OLED touchscreen 360.', tag: 'Trending' },
  { id: 'l7', title: 'Razer Blade 16 Gaming Laptop', category: 'laptops', price: 2799, image: 'https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?w=800&q=80', description: 'Intel i9-14900HX, RTX 4090.', tag: 'Top Rated' },
  { id: 'l8', title: 'Microsoft Surface Laptop 6', category: 'laptops', price: 1199, image: 'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=800&q=80', description: 'PixelSense touchscreen.', tag: 'Trending' },

  // Audio
  { id: 'a1', title: 'Sony WH-1000XM5 Wireless', category: 'audio', price: 399, image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80', description: 'Industry-leading noise cancellation.', tag: 'Best Seller' },
  { id: 'a2', title: 'Apple AirPods Pro (2nd Gen)', category: 'audio', price: 249, image: 'https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?w=800&q=80', description: 'Adaptive Audio and ANC.', tag: 'Trending' },
  { id: 'a3', title: 'Bose QuietComfort Ultra', category: 'audio', price: 429, image: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=800&q=80', description: 'Spatial audio immersion.', tag: 'Top Rated' },
  { id: 'a4', title: 'Sennheiser Momentum 4', category: 'audio', price: 349, image: 'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=800&q=80', description: '60-hour battery life.', tag: 'Trending' },
  { id: 'a5', title: 'Marshall Stanmore III Speaker', category: 'audio', price: 379, image: 'https://images.unsplash.com/photo-1545454675-3531b543be5d?w=800&q=80', description: 'Vintage iconic rock soundstage.', tag: 'Best Seller' },
  { id: 'a6', title: 'Samsung Galaxy Buds2 Pro', category: 'audio', price: 189, image: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=800&q=80', description: '24-bit Hi-Fi audio.', tag: 'Trending' },
  { id: 'a7', title: 'Audio-Technica ATH-M50x', category: 'audio', price: 149, image: 'https://images.unsplash.com/photo-1524678606370-a47ad25cb82a?w=800&q=80', description: 'Studio monitoring headphones.', tag: 'Top Rated' },
  { id: 'a8', title: 'JBL Boombox 3 Wi-Fi Speaker', category: 'audio', price: 499, image: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=800&q=80', description: 'Massive deep bass sound.', tag: 'Trending' },

  // Smart Gadgets
  { id: 'g1', title: 'Apple Watch Ultra 2 Titanium', category: 'gadgets', price: 799, image: 'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=800&q=80', description: '3000 nits display, precision GPS.', tag: 'Trending' },
  { id: 'g2', title: 'Meta Quest 3 Mixed Reality', category: 'gadgets', price: 499, image: 'https://images.unsplash.com/photo-1622979135225-d2ba269bc1df?w=800&q=80', description: '4K+ Infinite Display VR headset.', tag: 'Best Seller' },
  { id: 'g3', title: 'Samsung Galaxy Watch 6 Classic', category: 'gadgets', price: 349, image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80', description: 'Rotating bezel and health tracking.', tag: 'Trending' },
  { id: 'g4', title: 'Garmin Fenix 7X Pro Solar', category: 'gadgets', price: 899, image: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=800&q=80', description: 'Solar multisport GPS watch.', tag: 'Top Rated' },
  { id: 'g5', title: 'DJI Mini 4 Pro Drone Combo', category: 'gadgets', price: 1099, image: 'https://images.unsplash.com/photo-1508614589041-895b88991e3e?w=800&q=80', description: '4K/60fps HDR vertical shooting.', tag: 'Trending' },
  { id: 'g6', title: 'GoPro HERO 12 Black Kit', category: 'gadgets', price: 449, image: 'https://images.unsplash.com/photo-1564466809058-bf4114d55352?w=800&q=80', description: '5.3K video stabilization.', tag: 'Best Seller' },
  { id: 'g7', title: 'Amazon Kindle Colorsoft Edition', category: 'gadgets', price: 279, image: 'https://images.unsplash.com/photo-1592496431122-2349e0fbc666?w=800&q=80', description: 'Color display reading.', tag: 'Trending' },
  { id: 'g8', title: 'Oura Ring Gen 3 Stealth', category: 'gadgets', price: 399, image: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=800&q=80', description: 'Sleep & heart rate analysis.', tag: 'Top Rated' },

  // Gaming Consoles
  { id: 'c1', title: 'PlayStation 5 Slim Digital', category: 'consoles', price: 449, image: 'https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=800&q=80', description: '1TB SSD, 4K ray tracing.', tag: 'Best Seller' },
  { id: 'c2', title: 'Xbox Series X (1TB Black)', category: 'consoles', price: 499, image: 'https://images.unsplash.com/photo-1621259182978-fbf93132d53d?w=800&q=80', description: '12 teraflops raw graphic power.', tag: 'Top Rated' },
  { id: 'c3', title: 'Nintendo Switch OLED Neon', category: 'consoles', price: 349, image: 'https://images.unsplash.com/photo-1578303512597-8be935310f63?w=800&q=80', description: 'Vibrant 7-inch OLED display.', tag: 'Best Seller' },
  { id: 'c4', title: 'Steam Deck OLED 512GB', category: 'consoles', price: 549, image: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=800&q=80', description: '90Hz HDR OLED handheld gaming.', tag: 'Trending' },
  { id: 'c5', title: 'ASUS ROG Ally X Handheld', category: 'consoles', price: 799, image: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=800&q=80', description: 'AMD Ryzen Z1 Extreme, 24GB RAM.', tag: 'Trending' },
  { id: 'c6', title: 'Xbox Series S 1TB Carbon Black', category: 'consoles', price: 349, image: 'https://images.unsplash.com/photo-1605901309584-818e25960a8f?w=800&q=80', description: 'All-digital next-gen speed.', tag: 'Best Seller' },
  { id: 'c7', title: 'PlayStation Portal Remote', category: 'consoles', price: 199, image: 'https://images.unsplash.com/photo-1592840496694-26d035b52b48?w=800&q=80', description: '8-inch 1080p remote player.', tag: 'Trending' },
  { id: 'c8', title: 'Nintendo Switch Lite Turquoise', category: 'consoles', price: 199, image: 'https://images.unsplash.com/photo-1578303512597-8be935310f63?w=800&q=80', description: 'Compact handheld Nintendo gaming.', tag: 'Top Rated' },

  // Accessories
  { id: 'ac1', title: 'Keychron Q1 Pro Mechanical Keyboard', category: 'accessories', price: 199, image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=800&q=80', description: 'CNC aluminum body, QMK/VIA.', tag: 'Best Seller' },
  { id: 'ac2', title: 'Logitech MX Master 3S Mouse', category: 'accessories', price: 99, image: 'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=800&q=80', description: '8K DPI quiet click sensor.', tag: 'Trending' },
  { id: 'ac3', title: 'Samsung T7 Shield 2TB Portable SSD', category: 'accessories', price: 169, image: 'https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?w=800&q=80', description: '1050 MB/s speed, IP65 rated.', tag: 'Best Seller' },
  { id: 'ac4', title: 'Anker Prime 20,000mAh Power Bank', category: 'accessories', price: 129, image: 'https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=800&q=80', description: '200W high-speed charging.', tag: 'Top Rated' },
  { id: 'ac5', title: 'Elgato Stream Deck MK.2 Controller', category: 'accessories', price: 149, image: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&q=80', description: '15 customizable LCD keys.', tag: 'Trending' },
  { id: 'ac6', title: 'Belkin 3-in-1 MagSafe Stand', category: 'accessories', price: 149, image: 'https://images.unsplash.com/photo-1586105251261-72a756497a11?w=800&q=80', description: '15W fast charging for iPhone & Watch.', tag: 'Best Seller' },
  { id: 'ac7', title: 'Razer Blade 16 Screen Protector', category: 'accessories', price: 49, image: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=800&q=80', description: '9H hardness tempered glass.', tag: 'Top Rated' },
  { id: 'ac8', title: 'Apple Magic Keyboard Touch ID', category: 'accessories', price: 199, image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=800&q=80', description: 'Wireless with Touch ID login.', tag: 'Trending' }
];

const normalizeCategory = (cat) => {
  if (!cat) return '';
  const str = String(cat).toLowerCase().trim();
  if (['mobile', 'mobiles', 'phones', 'smartphones'].includes(str)) return 'mobiles';
  if (['laptop', 'laptops', 'computers', 'macbooks'].includes(str)) return 'laptops';
  if (['audio', 'sound', 'headphones', 'earphones'].includes(str)) return 'audio';
  if (['gadget', 'gadgets', 'smartwatch', 'smartwatches & vr'].includes(str)) return 'gadgets';
  if (['console', 'consoles', 'gaming', 'gaming consoles'].includes(str)) return 'consoles';
  if (['accessory', 'accessories'].includes(str)) return 'accessories';
  return str;
};

const Home = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState(DEFAULT_PRODUCTS);
  const [loading, setLoading] = useState(true);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const { addToCart } = useCart();
  const { isWishlisted, toggleWishlist } = useWishlist();

  const rawCat = searchParams.get('category');
  const activeCategory = normalizeCategory(rawCat || 'all');
  const searchTerm = (searchParams.get('search') || '').toLowerCase().trim();
  const tagParam = searchParams.get('tag');

  useEffect(() => {
    fetchProducts()
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setProducts(data);
        } else {
          setProducts(DEFAULT_PRODUCTS);
        }
      })
      .catch(() => {
        setProducts(DEFAULT_PRODUCTS);
      })
      .finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => {
    return products.filter((item) => {
      if (!item) return false;
      const itemCat = normalizeCategory(item.category);
      const matchesCategory =
        activeCategory === 'all' || activeCategory === '' || itemCat === activeCategory;
      const matchesSearch =
        !searchTerm || String(item.title || '').toLowerCase().includes(searchTerm);
      const matchesTag = !tagParam || item.tag === tagParam;
      return matchesCategory && matchesSearch && matchesTag;
    });
  }, [products, activeCategory, searchTerm, tagParam]);

  // Slow-motion scroll observer
  useScrollReveal([filtered, loading]);

  useEffect(() => {
    const handleScroll = () => setShowScrollTop(window.scrollY > 300);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCategorySelect = (catId) => {
    const newParams = new URLSearchParams(searchParams);
    if (catId === 'all') {
      newParams.delete('category');
    } else {
      newParams.set('category', catId);
    }
    setSearchParams(newParams);
  };

  const handleSearchChange = (e) => {
    const val = e.target.value;
    const newParams = new URLSearchParams(searchParams);
    if (val.trim()) {
      newParams.set('search', val);
    } else {
      newParams.delete('search');
    }
    setSearchParams(newParams);
  };

  if (loading) return <Loader />;

  return (
    <div style={{ maxWidth: '1240px', margin: '0 auto', padding: '24px 20px 80px' }}>
      {tagParam && (
        <div style={{ marginBottom: '16px' }}>
          <span style={{ fontSize: '18px', fontWeight: 'bold', color: '#f42c37' }}>
            Showing: {tagParam} Products
          </span>
        </div>
      )}

      {/* Modern Filter & Search Bar */}
      <div className="shop-filter-wrapper reveal-item">
        <div className="category-scroll-track">
          {categories.map((cat) => {
            const isSelected = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => handleCategorySelect(cat.id)}
                className={`cat-pill-btn ${isSelected ? 'active' : ''}`}
              >
                {cat.label}
              </button>
            );
          })}
        </div>

        <div className="shop-search-box">
          <Search size={16} className="shop-search-icon" />
          <input
            type="text"
            placeholder="Filter products..."
            value={searchParams.get('search') || ''}
            onChange={handleSearchChange}
            className="shop-search-input"
          />
        </div>
      </div>

      {activeCategory !== 'all' && (
        <div style={{ marginBottom: '20px' }}>
          <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '14px' }}>
            Showing results for:{' '}
            <strong style={{ color: 'var(--text-main)', textTransform: 'capitalize' }}>
              {activeCategory}
            </strong>{' '}
            ({filtered.length} items)
          </p>
        </div>
      )}

      {/* Product Cards Grid with Slow-Motion Stagger */}
      {filtered.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '80px 20px', color: 'var(--text-muted)' }}>
          <h3>No products match your selection.</h3>
          <button
            type="button"
            className="btn-red"
            style={{ marginTop: '16px' }}
            onClick={() => handleCategorySelect('all')}
          >
            Show All Products
          </button>
        </div>
      ) : (
        <div style={styles.grid}>
          {filtered.map((item) => {
            const itemId = item.id || item._id;
            return (
              <div key={itemId} className="product-card reveal-item reveal-stagger" style={styles.card}>
                <button
                  type="button"
                  onClick={() => toggleWishlist(item)}
                  aria-label={isWishlisted(itemId) ? 'Remove from wishlist' : 'Add to wishlist'}
                  style={styles.wishlistButton}
                >
                  <Heart size={18} fill={isWishlisted(itemId) ? '#f42c37' : 'none'} color="#f42c37" />
                </button>
                <Link
                  to={`/product/${itemId}`}
                  style={{
                    width: '100%',
                    textDecoration: 'none',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                  }}
                >
                  <img src={item.image} alt={item.title} style={styles.productImg} />
                  <h4 style={styles.cardTitle}>{item.title}</h4>
                  <p style={styles.cardPrice}>
                    ${typeof item.price === 'number' ? item.price.toFixed(2) : item.price}
                  </p>
                </Link>

                <div className="hover-overlay">
                  <button
                    type="button"
                    className="btn-red"
                    onClick={() => addToCart(item)}
                  >
                    <ShoppingCart size={15} />
                    <span>Add To Cart</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <button
        className={`scroll-top-btn ${showScrollTop ? 'visible' : ''}`}
        onClick={scrollToTop}
        aria-label="Scroll to top"
        type="button"
      >
        <ArrowUp size={22} />
      </button>
    </div>
  );
};

const styles = {
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
    gap: '24px',
  },
  card: {
    backgroundColor: 'var(--bg-surface)',
    borderRadius: '16px',
    padding: '16px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    position: 'relative',
    overflow: 'hidden',
    boxShadow: '0 4px 14px rgba(0,0,0,0.06)',
  },
  productImg: {
    height: '180px',
    width: '100%',
    objectFit: 'contain',
    borderRadius: '10px',
    marginBottom: '10px',
  },
  cardTitle: {
    margin: '10px 0 4px',
    fontSize: '14px',
    fontWeight: '600',
    color: 'var(--text-main)',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    width: '100%',
    textAlign: 'center',
  },
  cardPrice: {
    fontWeight: '800',
    fontSize: '16px',
    color: 'var(--text-main)',
    margin: 0,
    textAlign: 'center',
  },
  wishlistButton: {
    position: 'absolute',
    top: '12px',
    right: '12px',
    zIndex: 2,
    border: 0,
    background: 'var(--bg-surface)',
    borderRadius: '50%',
    width: '34px',
    height: '34px',
    display: 'grid',
    placeItems: 'center',
    cursor: 'pointer',
  },
};

export default Home;