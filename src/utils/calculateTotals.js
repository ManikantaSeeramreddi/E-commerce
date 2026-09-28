export const calculateTotals = (cart = []) => {
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const tax = subtotal * 0.08; // 8% sales tax
  const shipping = subtotal > 50 || subtotal === 0 ? 0 : 9.99; // Free shipping over $50
  const grandTotal = subtotal + tax + shipping;

  return { subtotal, tax, shipping, grandTotal };
};