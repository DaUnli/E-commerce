import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { FaMinus, FaPlus, FaTrash, FaShoppingCart } from "react-icons/fa";
import CheckoutHeader from "../../components/CheckoutHeader/CheckoutHeader";
import Toast from "../../components/Toast/Toast";
import styles from "./Cart.module.scss";
import {
  increaseQty,
  decreaseQty,
  removeFromCart,
  clearCart,
  selectSubtotal,
} from "../../store/cartSlice";

const DELIVERY_FEE = 35;

const Cart = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const cartItems = useSelector((state) => state.cart.items);
  const subtotal = useSelector(selectSubtotal);
  const total = subtotal + DELIVERY_FEE;

  if (cartItems.length === 0) {
    return (
      <>
        <CheckoutHeader title="Your Cart" step={1} />
        <Toast />
        <div className={styles.empty}>
          <FaShoppingCart className={styles.emptyIcon} />
          <h2>Your cart is empty</h2>
          <p>Looks like you haven't added anything yet.</p>
          <Link to="/home" className={styles.shopBtn}>
            Start Shopping
          </Link>
        </div>
      </>
    );
  }

  return (
    <>
      <CheckoutHeader title="Your Cart" step={1} />
      <Toast />
      <div className={styles.container}>
        <div className={styles.header}>
          <h1>Your Cart</h1>
          <button
            className={styles.clearAll}
            onClick={() => dispatch(clearCart())}
          >
            Clear Cart
          </button>
        </div>

        <div className={styles.layout}>
          <div className={styles.items}>
            {cartItems.map((item) => (
              <div key={item.id} className={styles.item}>
                <img src={item.image} alt={item.name} />
                <div className={styles.info}>
                  <h3>{item.name}</h3>
                  <p className={styles.desc}>{item.description}</p>
                  <span className={styles.price}>
                    ₱{(item.price * item.quantity).toFixed(2)}
                  </span>
                </div>
                <div className={styles.actions}>
                  <div className={styles.qty}>
                    <button
                      onClick={() => dispatch(decreaseQty(item.id))}
                      disabled={item.quantity <= 1}
                    >
                      <FaMinus />
                    </button>
                    <span>{item.quantity}</span>
                    <button onClick={() => dispatch(increaseQty(item.id))}>
                      <FaPlus />
                    </button>
                  </div>
                  <button
                    className={styles.delete}
                    onClick={() => dispatch(removeFromCart(item.id))}
                    aria-label="Remove"
                  >
                    <FaTrash />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className={styles.summary}>
            <h2>Order Summary</h2>
            <div className={styles.row}>
              <span>Items ({cartItems.length})</span>
              <span>₱{subtotal.toFixed(2)}</span>
            </div>
            <div className={styles.row}>
              <span>Delivery Fee</span>
              <span>₱{DELIVERY_FEE.toFixed(2)}</span>
            </div>
            <div className={`${styles.row} ${styles.total}`}>
              <span>Total</span>
              <span>₱{total.toFixed(2)}</span>
            </div>
            <button
              className={styles.checkoutBtn}
              onClick={() => navigate("/checkout")}
            >
              Proceed to Checkout
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Cart;
