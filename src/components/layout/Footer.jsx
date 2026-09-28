import React from 'react';
import { Link } from 'react-router-dom';
import { Phone, Mail, MapPin, Heart } from 'lucide-react';

const Footer = () => {
  return (
    <footer style={styles.footer}>
      {/* Brand Partner Logos Bar */}
      <div style={styles.brandBar}>
        <span style={styles.brandLogo}>GOLDEN</span>
        <span style={styles.brandLogo}>JACK ROLLER</span>
        <span style={styles.brandLogo}>SWEETY</span>
        <span style={styles.brandLogo}>FASTLANE</span>
      </div>

      {/* Main Footer Links & Info */}
      <div style={styles.container}>
        {/* Col 1: About Brand & Founder */}
        <div style={styles.column}>
          <Link to="/" style={styles.logo}>
            ESHOP
          </Link>
          <p style={styles.description}>
            Your premium destination for cutting-edge electronics, flagship smartphones, high-performance laptops, and audio gear.
          </p>
          <div style={styles.founderBadge}>
            <span>Crafted by <strong>Manikanta</strong></span>
            <Heart size={14} color="#f42c37" fill="#f42c37" />
          </div>
        </div>

        {/* Col 2: Quick Links */}
        <div style={styles.column}>
          <h4 style={styles.colTitle}>Quick Links</h4>
          <ul style={styles.linkList}>
            <li><Link to="/" style={styles.link}>Home</Link></li>
            <li><Link to="/store" style={styles.link}>Shop All</Link></li>
            <li><Link to="/about" style={styles.link}>About Us</Link></li>
            <li><Link to="/blogs" style={styles.link}>Latest News</Link></li>
          </ul>
        </div>

        {/* Col 3: Categories */}
        <div style={styles.column}>
          <h4 style={styles.colTitle}>Top Categories</h4>
          <ul style={styles.linkList}>
            <li><Link to="/store?category=mobiles" style={styles.link}>Smartphones</Link></li>
            <li><Link to="/store?category=laptops" style={styles.link}>Laptops & MacBooks</Link></li>
            <li><Link to="/store?category=audio" style={styles.link}>Wireless Audio</Link></li>
            <li><Link to="/store?category=gadgets" style={styles.link}>Smartwatches & VR</Link></li>
          </ul>
        </div>

        {/* Col 4: Contact & Socials */}
        <div style={styles.column}>
          <h4 style={styles.colTitle}>Contact Us</h4>
          <div style={styles.contactItem}>
            <MapPin size={16} color="#f42c37" />
            <span>Vizianagaram/Andhra Pradesh, India</span>
          </div>
          <div style={styles.contactItem}>
            <Phone size={16} color="#f42c37" />
            <a href="tel:7013849476" style={styles.link}>+91 7013849476</a>
          </div>
          <div style={styles.contactItem}>
            <Mail size={16} color="#f42c37" />
            <a href="mailto:manikanta00645@gmail.com" style={styles.link}>manikanta00645@gmail.com</a>
          </div>

          {/* Social Media Links with Inline SVG */}
          <div style={styles.socialIcons}>
            <a href="https://instagram.com" target="_blank" rel="noreferrer" style={styles.socialBtn} aria-label="Instagram">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
              </svg>
            </a>
            <a href="https://linkedin.com" target="_blank" rel="noreferrer" style={styles.socialBtn} aria-label="LinkedIn">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/>
                <rect width="4" height="12" x="2" y="9"/>
                <circle cx="4" cy="4" r="2"/>
              </svg>
            </a>
            <a href="https://twitter.com" target="_blank" rel="noreferrer" style={styles.socialBtn} aria-label="Twitter">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/>
              </svg>
            </a>
            <a href="https://facebook.com" target="_blank" rel="noreferrer" style={styles.socialBtn} aria-label="Facebook">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
              </svg>
            </a>
          </div>
        </div>
      </div>

      {/* Bottom Copyright Strip */}
      <div style={styles.bottomStrip}>
        <p style={{ margin: 0 }}>
          © {new Date().getFullYear()} ESHOP Inc. All rights reserved. Developed by <strong>Manikanta</strong>.
        </p>
        <div style={styles.policyLinks}>
          <span style={styles.policyLink}>Privacy Policy</span>
          <span>•</span>
          <span style={styles.policyLink}>Terms of Service</span>
          <span>•</span>
          <span style={styles.policyLink}>Security</span>
        </div>
      </div>
    </footer>
  );
};

const styles = {
  footer: {
    backgroundColor: 'var(--bg-surface, #111827)',
    color: 'var(--text-muted, #9ca3af)',
    borderTop: '1px solid rgba(0,0,0,0.06)',
    paddingTop: '30px',
    marginTop: '60px',
    fontSize: '14px',
  },
  brandBar: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    gap: '36px',
    flexWrap: 'wrap',
    padding: '0 20px 30px',
    borderBottom: '1px solid rgba(255,255,255,0.06)',
    opacity: 0.5,
  },
  brandLogo: {
    fontSize: '14px',
    fontWeight: '800',
    letterSpacing: '2px',
    color: 'var(--text-main, #ffffff)',
  },
  container: {
    maxWidth: '1240px',
    margin: '0 auto',
    padding: '40px 20px',
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
    gap: '32px',
  },
  column: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  logo: {
    fontSize: '24px',
    fontWeight: '900',
    letterSpacing: '1px',
    color: '#f42c37',
    textDecoration: 'none',
  },
  description: {
    fontSize: '13px',
    lineHeight: '1.6',
    margin: '4px 0 10px',
    color: 'var(--text-muted, #9ca3af)',
  },
  founderBadge: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    backgroundColor: 'rgba(244, 44, 55, 0.1)',
    color: '#f42c37',
    padding: '6px 12px',
    borderRadius: '20px',
    fontSize: '12px',
    width: 'fit-content',
  },
  colTitle: {
    fontSize: '16px',
    fontWeight: '700',
    color: 'var(--text-main, #ffffff)',
    margin: '0 0 8px',
  },
  linkList: {
    listStyle: 'none',
    padding: 0,
    margin: 0,
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
  },
  link: {
    color: 'var(--text-muted, #9ca3af)',
    textDecoration: 'none',
    fontSize: '13px',
    transition: 'color 0.2s ease',
  },
  contactItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    fontSize: '13px',
  },
  socialIcons: {
    display: 'flex',
    gap: '10px',
    marginTop: '12px',
  },
  socialBtn: {
    width: '32px',
    height: '32px',
    borderRadius: '50%',
    backgroundColor: 'var(--bg-main, #1f2937)',
    color: 'var(--text-main, #ffffff)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    textDecoration: 'none',
    transition: 'transform 0.2s, background 0.2s',
  },
  bottomStrip: {
    maxWidth: '1240px',
    margin: '0 auto',
    padding: '20px',
    borderTop: '1px solid rgba(255,255,255,0.06)',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: '12px',
    fontSize: '12px',
  },
  policyLinks: {
    display: 'flex',
    gap: '12px',
    alignItems: 'center',
  },
  policyLink: {
    cursor: 'pointer',
    color: 'var(--text-muted, #9ca3af)',
  },
};

export default Footer;