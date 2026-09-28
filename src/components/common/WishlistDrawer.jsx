import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, X, Trash2 } from 'lucide-react';
import { useWishlist } from '../../context/WishlistContext';

const WishlistDrawer = () => {
  const { wishlist, wishlistOpen, setWishlistOpen, toggleWishlist } = useWishlist();
  if (!wishlistOpen) return null;

  return (
    <div style={styles.overlay} onClick={() => setWishlistOpen(false)}>
      <aside style={styles.drawer} onClick={(event) => event.stopPropagation()}>
        <header style={styles.header}>
          <h2 style={styles.title}><Heart size={20} color="#f42c37" /> Wishlist</h2>
          <button type="button" onClick={() => setWishlistOpen(false)} style={styles.iconButton} aria-label="Close wishlist"><X size={20} /></button>
        </header>
        <div style={styles.list}>
          {wishlist.length === 0 ? <p style={styles.empty}>Your wishlist is empty.</p> : wishlist.map((item) => {
            const id = item.id || item._id;
            return (
              <div key={id} style={styles.item}>
                <img src={item.image} alt={item.title} style={styles.image} />
                <div style={styles.info}>
                  <Link to={`/product/${id}`} onClick={() => setWishlistOpen(false)} style={styles.itemTitle}>{item.title}</Link>
                  <strong>${Number(item.price).toFixed(2)}</strong>
                </div>
                <button type="button" onClick={() => toggleWishlist(item)} style={styles.iconButton} aria-label="Remove from wishlist"><Trash2 size={17} /></button>
              </div>
            );
          })}
        </div>
      </aside>
    </div>
  );
};

const styles = {
  overlay: { position: 'fixed', inset: 0, zIndex: 1200, background: 'rgba(0,0,0,0.45)' },
  drawer: { marginLeft: 'auto', width: 'min(390px, 100%)', height: '100%', background: 'var(--bg-surface)', padding: '20px', boxSizing: 'border-box' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(148,163,184,0.2)', paddingBottom: '16px' },
  title: { display: 'flex', alignItems: 'center', gap: '8px', margin: 0, color: 'var(--text-main)' },
  list: { paddingTop: '16px' },
  item: { display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 0', borderBottom: '1px solid rgba(148,163,184,0.16)' },
  image: { width: '54px', height: '54px', objectFit: 'contain', background: '#fff' },
  info: { flex: 1, display: 'flex', flexDirection: 'column', gap: '6px', color: 'var(--text-main)' },
  itemTitle: { color: 'var(--text-main)', textDecoration: 'none', fontSize: '13px', fontWeight: '600' },
  empty: { color: 'var(--text-muted)', textAlign: 'center', padding: '30px 0' },
  iconButton: { border: 0, background: 'transparent', cursor: 'pointer', color: 'var(--text-muted)', display: 'inline-flex' },
};

export default WishlistDrawer;
