import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { fetchProducts } from '../services/api';
import Loader from '../components/common/Loader';
import { ArrowLeft, Star, Heart } from 'lucide-react';

const ProductDetails = () => {
  const { id } = useParams();
  const { addToCart } = useCart();
  const { isWishlisted, toggleWishlist } = useWishlist();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [reviews, setReviews] = useLocalStorage(`eshop_reviews_${id}`, []);
  const [reviewForm, setReviewForm] = useState({ name: '', rating: 5, comment: '' });

  useEffect(() => {
    fetchProducts()
      .then((products) => {
        const match = products.find((item) => (item.id || item._id) === id);
        if (match) {
          setProduct(match);
          return null;
        }
        return fetch(`https://fakestoreapi.com/products/${id}`).then((res) => res.json());
      })
      .then((data) => {
        if (data) setProduct(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [id]);

  if (loading) return <Loader />;
  if (!product) return <p>Product not found.</p>;

  const submitReview = (event) => {
    event.preventDefault();
    if (!reviewForm.name.trim() || !reviewForm.comment.trim()) return;
    setReviews((items) => [{ ...reviewForm, name: reviewForm.name.trim(), comment: reviewForm.comment.trim(), createdAt: Date.now() }, ...items]);
    setReviewForm({ name: '', rating: 5, comment: '' });
  };

  return (
    <div>
      <Link to="/" style={styles.backLink}>
        <ArrowLeft size={18} /> Back to Products
      </Link>

      <div style={styles.grid}>
        <div style={styles.imageContainer}>
          <img src={product.image} alt={product.title} style={styles.image} />
        </div>

        <div style={styles.details}>
          <span style={styles.category}>{product.category}</span>
          <div style={styles.titleRow}>
            <h1 style={styles.title}>{product.title}</h1>
            <button type="button" onClick={() => toggleWishlist(product)} style={styles.wishlistButton} aria-label="Toggle wishlist">
              <Heart size={22} fill={isWishlisted(product.id || product._id) ? '#f42c37' : 'none'} color="#f42c37" />
            </button>
          </div>

          <div style={styles.rating}>
            <Star size={16} fill="#f59e0b" color="#f59e0b" />
            <span>{product.rating?.rate} ({product.rating?.count} reviews)</span>
          </div>

          <p style={styles.price}>${product.price?.toFixed(2)}</p>
          <p style={styles.description}>{product.description}</p>

          <button style={styles.button} onClick={() => addToCart(product)}>
            Add to Cart
          </button>
        </div>
      </div>

      <section style={styles.reviewSection}>
        <h2 style={styles.reviewHeading}>Product Reviews & Ratings</h2>
        {reviews.length === 0 && <p style={styles.muted}>No reviews yet. Be the first to review this product.</p>}
        {reviews.map((review) => (
          <article key={review.createdAt} style={styles.review}>
            <strong>{review.name}</strong>
            <div style={styles.reviewStars}>{'★'.repeat(Number(review.rating))}</div>
            <p style={styles.muted}>{review.comment}</p>
          </article>
        ))}
        <form onSubmit={submitReview} style={styles.reviewForm}>
          <input required placeholder="Your name" value={reviewForm.name} onChange={(e) => setReviewForm({ ...reviewForm, name: e.target.value })} style={styles.reviewInput} />
          <select value={reviewForm.rating} onChange={(e) => setReviewForm({ ...reviewForm, rating: e.target.value })} style={styles.reviewInput}>
            {[5, 4, 3, 2, 1].map((rating) => <option key={rating} value={rating}>{rating} stars</option>)}
          </select>
          <textarea required placeholder="Share your experience" value={reviewForm.comment} onChange={(e) => setReviewForm({ ...reviewForm, comment: e.target.value })} style={styles.reviewInput} rows="3" />
          <button type="submit" style={styles.button}>Submit Review</button>
        </form>
      </section>
    </div>
  );
};

const styles = {
  backLink: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    marginBottom: '20px',
    color: '#2563eb',
    textDecoration: 'none',
    fontWeight: 'bold',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: '40px',
    backgroundColor: '#fff',
    padding: '30px',
    borderRadius: '8px',
    border: '1px solid #e2e8f0',
  },
  imageContainer: { display: 'flex', justifyContent: 'center', alignItems: 'center' },
  image: { maxHeight: '350px', maxWidth: '100%', objectFit: 'contain' },
  details: { display: 'flex', flexDirection: 'column', gap: '12px' },
  category: { textTransform: 'uppercase', color: '#64748b', fontSize: '12px', fontWeight: 'bold' },
  title: { fontSize: '24px', margin: 0, color: '#0f172a' },
  titleRow: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px' },
  wishlistButton: { border: 0, background: 'transparent', cursor: 'pointer', padding: '6px' },
  rating: { display: 'flex', alignItems: 'center', gap: '6px', color: '#64748b', fontSize: '14px' },
  price: { fontSize: '28px', fontWeight: 'bold', color: '#059669', margin: 0 },
  description: { color: '#475569', lineHeight: '1.6' },
  button: {
    marginTop: '10px',
    padding: '12px 24px',
    backgroundColor: '#2563eb',
    color: '#fff',
    border: 'none',
    borderRadius: '6px',
    fontSize: '16px',
    fontWeight: 'bold',
    cursor: 'pointer',
  },
  reviewSection: { marginTop: '28px', background: 'var(--bg-surface)', padding: '24px', borderRadius: '8px' },
  reviewHeading: { margin: '0 0 16px', color: 'var(--text-main)' },
  review: { borderTop: '1px solid rgba(148,163,184,0.2)', padding: '14px 0' },
  reviewStars: { color: '#f59e0b', marginTop: '4px' },
  muted: { color: 'var(--text-muted)', lineHeight: '1.5' },
  reviewForm: { display: 'grid', gap: '10px', marginTop: '16px' },
  reviewInput: { width: '100%', boxSizing: 'border-box', padding: '10px', border: '1px solid #cbd5e1', borderRadius: '6px', background: 'var(--bg-main)', color: 'var(--text-main)' },
};

export default ProductDetails;