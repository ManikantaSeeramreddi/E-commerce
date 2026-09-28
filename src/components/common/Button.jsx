import React from 'react';

const Button = ({
  children,
  onClick,
  variant = 'primary',
  disabled = false,
  type = 'button',
  style = {},
}) => {
  const getVariantStyles = () => {
    switch (variant) {
      case 'secondary':
        return { backgroundColor: '#e2e8f0', color: '#1e293b' };
      case 'danger':
        return { backgroundColor: '#ef4444', color: '#ffffff' };
      case 'success':
        return { backgroundColor: '#10b981', color: '#ffffff' };
      case 'primary':
      default:
        return { backgroundColor: '#2563eb', color: '#ffffff' };
    }
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      style={{
        ...styles.base,
        ...getVariantStyles(),
        opacity: disabled ? 0.6 : 1,
        cursor: disabled ? 'not-allowed' : 'pointer',
        ...style,
      }}
    >
      {children}
    </button>
  );
};

const styles = {
  base: {
    padding: '8px 16px',
    borderRadius: '6px',
    border: 'none',
    fontWeight: '600',
    fontSize: '14px',
    transition: 'opacity 0.2s ease',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '6px',
  },
};

export default Button;