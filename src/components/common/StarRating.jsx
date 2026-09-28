import React from 'react';
import { Star } from 'lucide-react';

const StarRating = ({ rating = 0, count }) => {
  const roundedRating = Math.round(rating);

  return (
    <div style={styles.container}>
      <div style={styles.stars}>
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            size={16}
            color={star <= roundedRating ? '#f59e0b' : '#cbd5e1'}
            fill={star <= roundedRating ? '#f59e0b' : 'none'}
          />
        ))}
      </div>
      {count !== undefined && (
        <span style={styles.text}>({count})</span>
      )}
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
  },
  stars: {
    display: 'flex',
    alignItems: 'center',
    gap: '2px',
  },
  text: {
    fontSize: '12px',
    color: '#64748b',
  },
};

export default StarRating;