import { useContext } from 'react';
import { Link } from 'react-router-dom';
import { CartContext } from '../../../context/CartContext';
import styles from './Cart.module.scss';

const Cart = () => {
  const { cart, updateQuantity, removeFromCart } = useContext(CartContext);

  if (!cart || cart.products.length === 0) {
    return (
      <div className={styles.empty}>
        <h2>Your cart is empty</h2>
        <Link to="/">Start Shopping</Link>
      </div>
    );
  }

  const total = cart.products.reduce(
    (sum, item) => sum + item.price * item.quantity, 0
  );

  return (
    <div className={styles.container}>
      <h1>Shopping Cart</h1>
      
      <div className={styles.cartLayout}>
        <div className={styles.cartItems}>
          {cart.products.map((item) => (
            <div key={item.productId._id} className={styles.cartItem}>
              <div className={styles.image}>
                <img 
                  src={item.productId.images?.[0] || 'https://via.placeholder.com/100'} 
                  alt={item.productId.name} 
                />
              </div>
              
              <div className={styles.details}>
                <h3>{item.productId.name}</h3>
                <p className={styles.price}>${item.price}</p>
                <div className={styles.quantity}>
                  <button onClick={() => updateQuantity(item.productId._id, item.quantity - 1)}>-</button>
                  <span>{item.quantity}</span>
                  <button onClick={() => updateQuantity(item.productId._id, item.quantity + 1)}>+</button>
                </div>
              </div>

              <button 
                className={styles.removeBtn}
                onClick={() => removeFromCart(item.productId._id)}
              >
                Remove
              </button>
            </div>
          ))}
        </div>

        <div className={styles.summary}>
          <h3>Order Summary</h3>
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
          
          <Link to="/checkout">
            <button className={styles.checkoutBtn}>Proceed to Checkout</button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Cart;