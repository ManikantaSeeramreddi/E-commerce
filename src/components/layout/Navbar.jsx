import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  ShoppingCart, 
  Heart,
  Search, 
  ChevronDown, 
  Sun, 
  Moon, 
  Menu, 
  X, 
  User, 
  LogOut, 
  Shield 
} from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { useWishlist } from '../../context/WishlistContext';
import WishlistDrawer from '../common/WishlistDrawer';

const Navbar = ({ darkMode, setDarkMode }) => {
  const { totalItems } = useCart();
  const { wishlist, setWishlistOpen } = useWishlist();
  const { user, logout, isAuthenticated, isAdmin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [query, setQuery] = useState('');

  // Close menus automatically on route changes
  useEffect(() => {
    setMobileMenuOpen(false);
    setDropdownOpen(false);
    setSearchOpen(false);
  }, [location]);

  const handleSearchSubmit = (e) => {
    if (e.key === 'Enter' && query.trim()) {
      navigate(`/store?search=${encodeURIComponent(query.trim())}`);
      setSearchOpen(false);
      setMobileMenuOpen(false);
    }
  };

  const handleCategoryNavigate = (categoryName) => {
    setMobileMenuOpen(false);
    setDropdownOpen(false);
    navigate(`/store?category=${categoryName}`);
  };

  const handleNavClick = (path) => {
    setMobileMenuOpen(false);
    setDropdownOpen(false);
    navigate(path);
  };

  const handleCartClick = () => {
    setMobileMenuOpen(false);
    if (!isAuthenticated) {
      navigate('/auth', { state: { from: '/cart' } });
    } else {
      navigate('/cart');
    }
  };

  const isActive = (path) => location.pathname === path;

  return (
    <>
      <WishlistDrawer />
      <header style={styles.header}>
        <div style={styles.container}>
          {/* Brand Logo */}
          <Link to="/" style={styles.logo}>
            ESHOP
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="eshop-desktop-nav" style={styles.desktopNav}>
            <Link
              to="/"
              style={{
                ...styles.navLink,
                color: isActive('/') ? '#f42c37' : 'var(--text-muted)',
                fontWeight: isActive('/') ? '700' : '500',
              }}
            >
              Home
            </Link>
            <Link
              to="/store"
              style={{
                ...styles.navLink,
                color: isActive('/store') ? '#f42c37' : 'var(--text-muted)',
                fontWeight: isActive('/store') ? '700' : '500',
              }}
            >
              Shop
            </Link>
            <Link
              to="/about"
              style={{
                ...styles.navLink,
                color: isActive('/about') ? '#f42c37' : 'var(--text-muted)',
                fontWeight: isActive('/about') ? '700' : '500',
              }}
            >
              About
            </Link>
            <Link
              to="/blogs"
              style={{
                ...styles.navLink,
                color: isActive('/blogs') ? '#f42c37' : 'var(--text-muted)',
                fontWeight: isActive('/blogs') ? '700' : '500',
              }}
            >
              Blogs
            </Link>

            {/* Categories & Collections Dropdown */}
            <div style={{ position: 'relative' }}>
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                style={styles.dropdownToggle}
                type="button"
              >
                <span>Categories</span>
                <ChevronDown
                  size={15}
                  style={{
                    transform: dropdownOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                    transition: 'transform 0.2s ease',
                  }}
                />
              </button>

              {dropdownOpen && (
                <div style={styles.dropdownMenu}>
                 
                 
                  <div style={styles.menuDivider} />

                  <div
                    style={styles.dropItem}
                    onClick={() => handleNavClick('/store?tag=Trending')}
                  >
                    🔥 Trending Products
                  </div>
                  <div
                    style={styles.dropItem}
                    onClick={() => handleNavClick('/store?tag=Best Seller')}
                  >
                    ⭐ Best Selling
                  </div>
                  <div
                    style={styles.dropItem}
                    onClick={() => handleNavClick('/store?tag=Top Rated')}
                  >
                    🏆 Top Rated
                  </div>
                </div>
              )}
            </div>
          </nav>

          {/* Right Action Bar */}
          <div style={styles.actions}>
            {/* Animated Search Bar */}
            <div
              style={{
                ...styles.searchWrapper,
                width: searchOpen ? '170px' : '36px',
              }}
            >
              <input
                type="text"
                placeholder="Search..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={handleSearchSubmit}
                style={{
                  ...styles.searchInput,
                  opacity: searchOpen ? 1 : 0,
                  pointerEvents: searchOpen ? 'auto' : 'none',
                }}
              />
              <button
                onClick={() => setSearchOpen(!searchOpen)}
                style={styles.iconBtn}
                aria-label="Search"
                type="button"
              >
                <Search size={18} />
              </button>
            </div>

            {/* Auth Profile / Sign In Button */}
            <div className="eshop-desktop-auth">
              {isAuthenticated ? (
                <div style={styles.userProfile}>
                  {isAdmin ? (
                    <Link to="/admin/dashboard" style={styles.adminBadge} title="Admin Dashboard">
                      <Shield size={13} />
                      <span>Admin</span>
                    </Link>
                  ) : (
                    <User size={15} color="#f42c37" />
                  )}
                  <span style={styles.userName}>{user?.name?.split(' ')[0]}</span>
                  <button
                    onClick={() => {
                      logout();
                      navigate('/');
                    }}
                    style={styles.logoutBtn}
                    title="Sign Out"
                    type="button"
                  >
                    <LogOut size={15} />
                  </button>
                </div>
              ) : (
                <button
                  className="btn-red"
                  style={styles.authBtn}
                  onClick={() => navigate('/auth', { state: { from: location.pathname } })}
                  type="button"
                >
                  Sign In
                </button>
              )}
            </div>

            {/* Guarded Live Cart Counter */}
            <button
              onClick={handleCartClick}
              style={styles.cartBtn}
              aria-label="Shopping Cart"
              type="button"
            >
              <ShoppingCart size={22} color="var(--text-main)" />
              {totalItems > 0 && <span style={styles.badge}>{totalItems}</span>}
            </button>

            <button
              onClick={() => setWishlistOpen(true)}
              style={styles.cartBtn}
              aria-label="Wishlist"
              title="Wishlist"
              type="button"
            >
              <Heart size={21} color="#f42c37" />
              {wishlist.length > 0 && <span style={styles.badge}>{wishlist.length}</span>}
            </button>

            {/* Light / Dark Mode Switch */}
            <div
              onClick={() => setDarkMode(!darkMode)}
              style={{
                ...styles.themeToggle,
                backgroundColor: darkMode ? '#374151' : '#e5e7eb',
              }}
              role="button"
              tabIndex={0}
              title="Toggle Theme"
            >
              <div
                style={{
                  ...styles.themeThumb,
                  transform: darkMode ? 'translateX(20px)' : 'translateX(0px)',
                  backgroundColor: darkMode ? '#fdc62e' : '#ffffff',
                }}
              >
                {darkMode ? <Sun size={12} color="#111827" /> : <Moon size={12} color="#f42c37" />}
              </div>
            </div>

            {/* Mobile / Tablet Menu Button */}
            <button
              className="eshop-mobile-toggle"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              style={styles.mobileMenuBtn}
              aria-label="Toggle Menu"
              type="button"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile / Tablet Drawer */}
        {mobileMenuOpen && (
          <div style={styles.mobileDrawer}>
            <div onClick={() => handleNavClick('/')} style={styles.mobileItem}>
              Home
            </div>
            <div onClick={() => handleNavClick('/store')} style={styles.mobileItem}>
              Shop Products
            </div>
            <div onClick={() => handleNavClick('/about')} style={styles.mobileItem}>
              About Us
            </div>
            <div onClick={() => handleNavClick('/blogs')} style={styles.mobileItem}>
              Recent Blogs
            </div>

            <div style={styles.mobileDivider} />
            <span style={styles.mobileSubHeader}>Product Categories</span>
         

            <div style={styles.mobileDivider} />
            <span style={styles.mobileSubHeader}>Collections</span>
            <div onClick={() => handleNavClick('/store?tag=Trending')} style={styles.mobileSubItem}>
              🔥 Trending Products
            </div>
            <div onClick={() => handleNavClick('/store?tag=Best Seller')} style={styles.mobileSubItem}>
              ⭐ Best Selling
            </div>
            <div onClick={() => handleNavClick('/store?tag=Top Rated')} style={styles.mobileSubItem}>
              🏆 Top Rated
            </div>

            <div style={styles.mobileDivider} />
            {isAdmin && (
              <div
                onClick={() => handleNavClick('/admin/dashboard')}
                style={{ ...styles.mobileItem, color: '#f42c37', fontWeight: '700' }}
              >
                🛡️ Admin Dashboard
              </div>
            )}

            {!isAuthenticated ? (
              <div
                onClick={() => handleNavClick('/auth')}
                style={{ ...styles.mobileItem, color: '#f42c37', fontWeight: '700' }}
              >
                Sign In / Register
              </div>
            ) : (
              <div
                onClick={() => {
                  logout();
                  setMobileMenuOpen(false);
                }}
                style={{ ...styles.mobileItem, color: '#f42c37', fontWeight: '700' }}
              >
                Sign Out ({user?.name})
              </div>
            )}
          </div>
        )}
      </header>

      <style>{`
        .eshop-desktop-nav {
          display: flex;
        }
        .eshop-desktop-auth {
          display: flex;
        }
        .eshop-mobile-toggle {
          display: none !important;
        }

        /* Tablet & Mobile Breakpoint (<= 900px) */
        @media (max-width: 900px) {
          .eshop-desktop-nav {
            display: none !important;
          }
          .eshop-desktop-auth {
            display: none !important;
          }
          .eshop-mobile-toggle {
            display: flex !important;
          }
        }
      `}</style>
    </>
  );
};

const styles = {
  header: {
    padding: '14px 0',
    backgroundColor: 'var(--bg-main)',
    position: 'sticky',
    top: 0,
    zIndex: 1000,
    borderBottom: '1px solid rgba(0,0,0,0.06)',
    transition: 'background-color 0.3s ease',
  },
  container: {
    maxWidth: '1240px',
    margin: '0 auto',
    padding: '0 20px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '12px',
  },
  logo: {
    fontSize: '24px',
    fontWeight: '900',
    letterSpacing: '1px',
    color: '#f42c37',
    textDecoration: 'none',
    flexShrink: 0,
  },
  desktopNav: {
    alignItems: 'center',
    gap: '26px',
  },
  navLink: {
    textDecoration: 'none',
    fontSize: '15px',
    cursor: 'pointer',
    transition: 'color 0.2s ease',
  },
  dropdownToggle: {
    background: 'none',
    border: 'none',
    color: 'var(--text-muted)',
    fontSize: '15px',
    fontWeight: '500',
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    cursor: 'pointer',
    padding: 0,
  },
  dropdownMenu: {
    position: 'absolute',
    top: '32px',
    left: 0,
    backgroundColor: 'var(--bg-surface)',
    boxShadow: '0 12px 30px rgba(0,0,0,0.15)',
    borderRadius: '14px',
    padding: '8px 0',
    width: '210px',
    display: 'flex',
    flexDirection: 'column',
    zIndex: 100,
    border: '1px solid rgba(0,0,0,0.05)',
  },
  dropItem: {
    padding: '9px 18px',
    color: 'var(--text-main)',
    cursor: 'pointer',
    fontSize: '13px',
    fontWeight: '500',
    transition: 'background 0.2s',
  },
  menuDivider: {
    height: '1px',
    backgroundColor: 'rgba(0,0,0,0.06)',
    margin: '6px 0',
  },
  actions: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  authBtn: {
    padding: '7px 18px',
    fontSize: '12px',
    borderRadius: '20px',
  },
  userProfile: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    backgroundColor: 'var(--bg-surface)',
    padding: '6px 12px',
    borderRadius: '20px',
    border: '1px solid rgba(0,0,0,0.05)',
  },
  adminBadge: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '4px',
    backgroundColor: '#111827',
    color: '#ffffff',
    padding: '2px 8px',
    borderRadius: '10px',
    fontSize: '11px',
    fontWeight: '700',
    textDecoration: 'none',
  },
  userName: {
    fontSize: '13px',
    fontWeight: '600',
    color: 'var(--text-main)',
    maxWidth: '90px',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  logoutBtn: {
    background: 'none',
    border: 'none',
    color: 'var(--text-muted)',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    padding: 0,
  },
  searchWrapper: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    height: '36px',
    borderRadius: '20px',
    backgroundColor: 'var(--bg-surface)',
    transition: 'width 0.3s ease',
    overflow: 'hidden',
  },
  searchInput: {
    border: 'none',
    outline: 'none',
    background: 'transparent',
    padding: '0 10px',
    fontSize: '12px',
    color: 'var(--text-main)',
    width: '100%',
  },
  iconBtn: {
    background: 'none',
    border: 'none',
    color: 'var(--text-main)',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '6px',
    flexShrink: 0,
  },
  cartBtn: {
    position: 'relative',
    background: 'none',
    border: 'none',
    color: 'var(--text-main)',
    display: 'flex',
    alignItems: 'center',
    cursor: 'pointer',
    padding: '4px',
  },
  badge: {
    position: 'absolute',
    top: '-4px',
    right: '-6px',
    backgroundColor: '#f42c37',
    color: '#fff',
    borderRadius: '50%',
    fontSize: '10px',
    fontWeight: 'bold',
    padding: '2px 5px',
  },
  themeToggle: {
    width: '46px',
    height: '26px',
    borderRadius: '13px',
    cursor: 'pointer',
    padding: '3px',
    display: 'flex',
    alignItems: 'center',
    flexShrink: 0,
  },
  themeThumb: {
    width: '20px',
    height: '20px',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'transform 0.25s ease',
  },
  mobileMenuBtn: {
    background: 'none',
    border: 'none',
    color: 'var(--text-main)',
    cursor: 'pointer',
    padding: '4px',
    alignItems: 'center',
    justifyContent: 'center',
  },
  mobileDrawer: {
    position: 'absolute',
    top: '100%',
    left: 0,
    right: 0,
    backgroundColor: 'var(--bg-main)',
    borderBottom: '1px solid rgba(0,0,0,0.08)',
    padding: '20px',
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    boxShadow: '0 15px 30px rgba(0,0,0,0.12)',
  },
  mobileItem: {
    fontSize: '16px',
    fontWeight: '600',
    color: 'var(--text-main)',
    cursor: 'pointer',
    padding: '4px 0',
  },
  mobileDivider: {
    height: '1px',
    backgroundColor: 'rgba(0,0,0,0.06)',
    margin: '6px 0',
  },
  mobileSubHeader: {
    fontSize: '11px',
    fontWeight: '700',
    textTransform: 'uppercase',
    color: 'var(--text-muted)',
    letterSpacing: '0.5px',
  },
  mobileSubItem: {
    fontSize: '14px',
    fontWeight: '500',
    color: 'var(--text-muted)',
    cursor: 'pointer',
    padding: '2px 0 2px 8px',
  },
};

export default Navbar;