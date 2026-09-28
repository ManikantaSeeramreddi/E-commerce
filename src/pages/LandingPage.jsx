import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchProducts } from '../services/api';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { Truck, CheckCircle, Headphones, CreditCard, ArrowUp, Shield } from 'lucide-react';

const heroSlides = [
  {
    subtitle: 'Beats Solo',
    title: 'Wireless',
    watermark: 'HEADPHONE',
    image: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=700&q=80',
    category: 'audio',
  },
  {
    subtitle: 'Apple M3',
    title: 'Branded',
    watermark: 'LAPTOPS',
    image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=700&q=80',
    category: 'laptops',
  },
  {
    subtitle: 'Next-Gen',
    title: 'Smart',
    watermark: 'MOBILES',
    image: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=700&q=80',
    category: 'mobiles',
  },
];

const LandingPage = () => {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { isAuthenticated } = useAuth();
  const [productsList, setProductsList] = useState([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [showScrollTop, setShowScrollTop] = useState(false);

  const productSectionRef = useRef(null);

  useEffect(() => {
    const saved = localStorage.getItem('custom_products');
    if (saved) {
      setProductsList(JSON.parse(saved).slice(0, 8));
    } else {
      fetchProducts().then((data) => setProductsList(data.slice(0, 8)));
    }
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 4500);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setShowScrollTop(true);
      } else {
        setShowScrollTop(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleProductClick = (productId) => {
    if (!isAuthenticated) {
      navigate('/auth', { state: { from: `/product/${productId}` } });
    } else {
      navigate(`/product/${productId}`);
    }
  };

  const activeHero = heroSlides[currentSlide];

  return (
    <div className="landing-container">
      {/* 1. HERO SLIDER */}
      <section className="hero-card">
        <div className="hero-watermark">{activeHero.watermark}</div>
        <div className="hero-content">
          <span className="hero-small">{activeHero.subtitle}</span>
          <h1 className="hero-title">{activeHero.title}</h1>
          <button
            className="btn-red"
            onClick={() => navigate(`/store?category=${activeHero.category}`)}
          >
            Shop By Category
          </button>
        </div>
        <div className="hero-img-box">
          <img
            src={activeHero.image}
            alt={activeHero.title}
            className="hero-image"
          />
        </div>
      </section>

      {/* 2. BENTO CARDS GRID */}
      <section className="bento-grid">
        {/* Mobiles */}
        <div
          className="bento-card bento-span-1"
          style={{ background: '#222222' }}
          onClick={() => navigate('/store?category=mobiles')}
        >
          <div className="bento-info">
            <p style={{ color: '#9ca3af', margin: 0, fontSize: '13px' }}>Enjoy With</p>
            <h2 style={{ color: '#ffffff', fontSize: '24px', fontWeight: '800', margin: '2px 0 12px' }}>Mobiles</h2>
            <button className="btn-red" style={{ padding: '6px 18px', fontSize: '12px' }}>Browse</button>
          </div>
          <img
            src="https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=400&q=80"
            alt="Mobiles"
            className="bento-img"
          />
        </div>

        {/* Gadgets */}
        <div
          className="bento-card bento-span-1"
          style={{ background: '#fdc62e' }}
          onClick={() => navigate('/store?category=gadgets')}
        >
          <div className="bento-info">
            <p style={{ color: 'rgba(255,255,255,0.85)', margin: 0, fontSize: '13px' }}>Enjoy With</p>
            <h2 style={{ color: '#ffffff', fontSize: '24px', fontWeight: '800', margin: '2px 0 12px' }}>Gadget</h2>
            <button className="btn-red" style={{ background: '#fff', color: '#fdc62e', padding: '6px 18px', fontSize: '12px' }}>
              Browse
            </button>
          </div>
          <img
            src="https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&q=80"
            alt="Gadgets"
            className="bento-img"
          />
        </div>

        {/* Laptops */}
        <div
          className="bento-card bento-span-2"
          style={{ background: '#f42c37' }}
          onClick={() => navigate('/store?category=laptops')}
        >
          <div className="bento-info">
            <p style={{ color: 'rgba(255,255,255,0.85)', margin: 0, fontSize: '13px' }}>Enjoy With</p>
            <h2 style={{ color: '#ffffff', fontSize: '30px', fontWeight: '800', margin: '2px 0 12px' }}>Laptop</h2>
            <button className="btn-red" style={{ background: '#fff', color: '#f42c37', padding: '6px 20px', fontSize: '12px' }}>
              Browse
            </button>
          </div>
          <img
            src="https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600&q=80"
            alt="Laptop"
            className="bento-img"
          />
        </div>

        {/* Consoles */}
        <div
          className="bento-card bento-span-2"
          style={{ background: '#e5e7eb' }}
          onClick={() => navigate('/store?category=consoles')}
        >
          <div className="bento-info">
            <p style={{ color: '#6b7280', margin: 0, fontSize: '13px' }}>Enjoy With</p>
            <h2 style={{ color: '#111827', fontSize: '30px', fontWeight: '800', margin: '2px 0 12px' }}>Console</h2>
            <button className="btn-red" style={{ padding: '6px 20px', fontSize: '12px' }}>Browse</button>
          </div>
          <img
            src="https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=500&q=80"
            alt="Console"
            className="bento-img"
          />
        </div>

        {/* Audio */}
        <div
          className="bento-card bento-span-2"
          style={{ background: '#1376f4' }}
          onClick={() => navigate('/store?category=audio')}
        >
          <div className="bento-info">
            <p style={{ color: 'rgba(255,255,255,0.85)', margin: 0, fontSize: '13px' }}>Enjoy With</p>
            <h2 style={{ color: '#ffffff', fontSize: '28px', fontWeight: '800', margin: '2px 0 12px' }}>Audio & Sound</h2>
            <button className="btn-red" style={{ background: '#fff', color: '#1376f4', padding: '6px 20px', fontSize: '12px' }}>
              Browse
            </button>
          </div>
          <img
            src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&q=80"
            alt="Audio"
            className="bento-img"
          />
        </div>
      </section>

      {/* 3. VALUE PROPOSITION BAR */}
      <section className="features-row">
        <div className="feature-item">
          <Truck size={32} color="#f42c37" />
          <div>
            <h4 style={{ margin: 0, fontSize: '14px', fontWeight: '700', color: 'var(--text-main)' }}>Free Shipping</h4>
            <p style={{ margin: 0, fontSize: '12px', color: 'var(--text-muted)' }}>On All Orders</p>
          </div>
        </div>
        <div className="feature-item">
          <CheckCircle size={32} color="#f42c37" />
          <div>
            <h4 style={{ margin: 0, fontSize: '14px', fontWeight: '700', color: 'var(--text-main)' }}>Safe Guarantee</h4>
            <p style={{ margin: 0, fontSize: '12px', color: 'var(--text-muted)' }}>30 Days Return</p>
          </div>
        </div>
        <div className="feature-item">
          <Headphones size={32} color="#f42c37" />
          <div>
            <h4 style={{ margin: 0, fontSize: '14px', fontWeight: '700', color: 'var(--text-main)' }}>Support 24/7</h4>
            <p style={{ margin: 0, fontSize: '12px', color: 'var(--text-muted)' }}>Online Technical Help</p>
          </div>
        </div>
        <div className="feature-item">
          <CreditCard size={32} color="#f42c37" />
          <div>
            <h4 style={{ margin: 0, fontSize: '14px', fontWeight: '700', color: 'var(--text-main)' }}>Secure Checkout</h4>
            <p style={{ margin: 0, fontSize: '12px', color: 'var(--text-muted)' }}>Protected SSL Payment</p>
          </div>
        </div>
      </section>

      {/* 4. RED WINTER SALE BANNER */}
      <section className="red-banner">
        <div>
          <span style={{ fontSize: '13px', textTransform: 'uppercase', opacity: 0.9 }}>30% OFF</span>
          <h1 style={{ fontSize: '38px', fontWeight: '900', margin: '4px 0 10px', lineHeight: 1.1 }}>FINE SMILE</h1>
          <p style={{ margin: 0, opacity: 0.9, fontSize: '13px' }}>10 Jan to 28 Jan</p>
        </div>
        <img
          src="https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=600&q=80"
          alt="Winter Sale"
          className="banner-center-img"
        />
        <div style={{ textAlign: 'right' }}>
          <span style={{ fontSize: '13px', opacity: 0.9 }}>Air Solo Bass</span>
          <h2 style={{ fontSize: '28px', fontWeight: '800', margin: '4px 0 14px' }}>Winter Sale</h2>
          <button
            className="btn-red"
            style={{ background: '#ffffff', color: '#f42c37' }}
            onClick={() => navigate('/store?category=audio')}
          >
            Shop Now
          </button>
        </div>
      </section>

      {/* 5. BEST SELLER PRODUCTS GRID */}
      <section ref={productSectionRef} style={{ marginTop: '50px', textAlign: 'center' }}>
        <h2 style={{ fontSize: '26px', fontWeight: '800', color: 'var(--text-main)' }}>
          Best Seller Products
        </h2>
        <p style={{ color: 'var(--text-muted)', marginBottom: '24px', fontSize: '13px' }}>
          Explore our top customer favorites
        </p>

        <div className="landing-product-grid">
          {productsList.map((item) => (
            <div
              key={item.id}
              className="product-card"
              onClick={() => handleProductClick(item.id)}
              style={{ cursor: 'pointer' }}
            >
              <img
                src={item.image}
                alt={item.title}
                style={{ height: '160px', width: '100%', objectFit: 'contain' }}
              />
              <h4
                style={{
                  margin: '12px 0 4px',
                  fontSize: '13px',
                  fontWeight: '600',
                  color: 'var(--text-main)',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  width: '100%',
                }}
              >
                {item.title}
              </h4>
              <p
                style={{
                  fontWeight: '800',
                  fontSize: '15px',
                  color: 'var(--text-main)',
                  margin: 0,
                }}
              >
                ${item.price.toFixed(2)}
              </p>

              <div className="hover-overlay">
                <button
                  className="btn-red"
                  onClick={(e) => {
                    e.stopPropagation();
                    if (!isAuthenticated) {
                      navigate('/auth', { state: { from: `/product/${item.id}` } });
                    } else {
                      addToCart(item);
                    }
                  }}
                >
                  Add To Cart
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 6. SMALL ADMIN BUTTON ON BOTTOM RIGHT CORNER (ABOVE FOOTER) */}
      <div style={styles.adminBarContainer}>
        <button
          type="button"
          onClick={() => navigate('/admin/login')}
          style={styles.adminBtn}
          title="Admin Portal Login"
        >
          <Shield size={14} color="#f42c37" />
          <span>Admin</span>
        </button>
      </div>

      {/* 7. FLOATING SCROLL TO TOP */}
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
  adminBarContainer: {
    display: 'flex',
    justifyContent: 'flex-end',
    width: '100%',
    marginTop: '48px',
    marginBottom: '12px',
    paddingRight: '12px',
  },
  adminBtn: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    padding: '7px 16px',
    borderRadius: '20px',
    border: '1px solid rgba(255, 255, 255, 0.12)',
    backgroundColor: 'var(--bg-surface)',
    color: 'var(--text-main)',
    fontSize: '13px',
    fontWeight: '600',
    cursor: 'pointer',
    boxShadow: '0 4px 12px rgba(0,0,0,0.06)',
    transition: 'all 0.2s ease',
  },
};

export default LandingPage;