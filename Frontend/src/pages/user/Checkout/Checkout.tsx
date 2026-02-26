import { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CartContext } from '../../../context/CartContext';
import { orderApi } from '../../../api/orderApi';
import styles from './Checkout.module.scss';

const Checkout = () => {
  const [address, setAddress] = useState('');
  const [loading, setLoading] = useState(false);
  const { cart, fetchCart } = useContext(CartContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!cart || cart.products.length === 0) {
      navigate('/cart');
    }
  }, [cart, navigate]);

  const total = cart?.products.reduce(
    (sum, item) => sum + item.price * item.quantity, 0
  ) || 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await orderApi.createOrder(address);
      await fetchCart();
      navigate('/orders');
    } catch (error) {
      console.error('Checkout failed', error);
      alert('Checkout failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!cart) return null;

  return (
    <div className={styles.container}>
      <h1>Checkout</h1>

      <div className={styles.layout}>
        <div className={styles.formSection}>
          <h3>Shipping Address</h3>
          <form className={styles.form} onSubmit={handleSubmit}>
            <div className={styles.field}>
              <label>Full Address</label>
              <textarea
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Enter your complete shipping address"
                required
              />
            </div>
            <button type="submit" className={styles.submitBtn} disabled={loading}>
              {loading ? 'Processing...' : 'Place Order'}
            </button>
          </form>
        </div>

        <div className={styles.summary}>
          <h3>Order Summary</h3>
          {cart.products.map((item) => (
            <div key={item.productId._id} className={styles.item}>
              <div className={styles.image}>
                <img 
                  src={item.productId.images?.[0] || 'https://via.placeholder.com/60'} 
                  alt={item.productId.name} 
                />
              </div>
              <div className={styles.info}>
                <h4>{item.productId.name}</h4>
                <span className={styles.qty}>Qty: {item.quantity}</span>
              </div>
              <span className={styles.price}>${item.price * item.quantity}</span>
            </div>
          ))}
          <div className={styles.totals}>
            <div className={styles.row}>
              <span>Subtotal</span>
              <span>${total.toFixed(2)}</span>
            </div>
            <div className={styles.row}>
              <span>Shipping</span>
              <span>Free</span>
            </div>
            <div className={`${styles.row} ${styles.total}`}>
              <span>Total</span>
              <span>${total.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;