import React from 'react';
import { Calendar, User, ArrowRight } from 'lucide-react';

const blogs = [
  {
    id: 1,
    title: 'How to Choose the Perfect Smartwatch in 2026',
    date: 'Jan 20, 2026',
    author: 'Dilshad',
    image: 'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=600&q=80',
    snippet: 'Compare display brightness, battery duration, ECG tracking, and fitness sensors before making your purchase.',
  },
  {
    id: 2,
    title: 'Top 5 Flagship Laptops for Creators & Developers',
    date: 'Jan 22, 2026',
    author: 'Satya',
    image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600&q=80',
    snippet: 'A deep-dive review comparing Apple Silicon M3 Max performance against Intel Core Ultra with OLED displays.',
  },
  {
    id: 3,
    title: 'The Ultimate Guide to Active Noise Cancelling Headphones',
    date: 'Jan 25, 2026',
    author: 'Sabir',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&q=80',
    snippet: 'Learn how multi-mic acoustic arrays reduce low-frequency rumblings during travel and daily commutes.',
  },
];

const BlogsPage = () => {
  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>Recent News & Tech Blogs</h1>
        <p style={styles.subtitle}>Explore expert buyer guides, product comparisons, and tech news</p>
      </div>

      <div style={styles.grid}>
        {blogs.map((blog) => (
          <div key={blog.id} style={styles.card}>
            <img src={blog.image} alt={blog.title} style={styles.image} />
            <div style={styles.content}>
              <div style={styles.meta}>
                <span style={styles.metaItem}><Calendar size={14} /> {blog.date}</span>
                <span style={styles.metaItem}><User size={14} /> by {blog.author}</span>
              </div>
              <h3 style={styles.blogTitle}>{blog.title}</h3>
              <p style={styles.snippet}>{blog.snippet}</p>
              <button style={styles.readMore}>
                <span>Read Article</span>
                <ArrowRight size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const styles = {
  container: {
    maxWidth: '1240px',
    margin: '0 auto',
    padding: '40px 24px 80px',
  },
  header: {
    textAlign: 'center',
    marginBottom: '50px',
  },
  title: {
    fontSize: '36px',
    fontWeight: '800',
    color: 'var(--text-main)',
    margin: '0 0 10px',
  },
  subtitle: {
    color: 'var(--text-muted)',
    fontSize: '16px',
    margin: 0,
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
    gap: '30px',
  },
  card: {
    backgroundColor: 'var(--bg-surface)',
    borderRadius: '20px',
    overflow: 'hidden',
    border: '1px solid #e5e7eb',
    display: 'flex',
    flexDirection: 'column',
  },
  image: {
    width: '100%',
    height: '220px',
    objectFit: 'cover',
  },
  content: {
    padding: '24px',
    display: 'flex',
    flexDirection: 'column',
    flex: 1,
  },
  meta: {
    display: 'flex',
    gap: '16px',
    fontSize: '12px',
    color: 'var(--text-muted)',
    marginBottom: '12px',
  },
  metaItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
  },
  blogTitle: {
    fontSize: '18px',
    fontWeight: '700',
    color: 'var(--text-main)',
    margin: '0 0 10px',
    lineHeight: '1.4',
  },
  snippet: {
    fontSize: '14px',
    color: 'var(--text-muted)',
    lineHeight: '1.6',
    flex: 1,
    marginBottom: '16px',
  },
  readMore: {
    background: 'none',
    border: 'none',
    color: '#f42c37',
    fontWeight: '700',
    fontSize: '14px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    padding: 0,
  },
};

export default BlogsPage;