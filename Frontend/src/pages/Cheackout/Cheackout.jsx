import React from 'react'
import styles from "./Cheackout.module.scss";

const Cheackout = () => {
  return (
    <div className={styles.checkout}>
      <div className={styles.checkout__container}>

        {/* LEFT SIDE */}
        <div className={styles.checkout__left}>
          <h1 className={styles.title}>Checkout</h1>

          {/* CONTACT */}
          <div className={styles.card}>
            <h2>Contact Information</h2>

            <div className={styles["input-group"]}>
              <label>Full Name</label>
              <input type="text" placeholder="John Doe" />
            </div>

            <div className={styles["input-group"]}>
              <label>Email Address</label>
              <input type="email" placeholder="john@example.com" />
            </div>

            <div className={styles["input-group"]}>
              <label>Phone Number</label>
              <input type="text" placeholder="+63 912 345 6789" />
            </div>
          </div>

          {/* SHIPPING */}
          <div className={styles.card}>
            <h2>Shipping Address</h2>

            <div className={styles["input-group"]}>
              <label>Street Address</label>
              <input type="text" placeholder="123 Main Street" />
            </div>

            <div className={styles.row}>
              <div className={styles["input-group"]}>
                <label>City</label>
                <input type="text" placeholder="General Santos" />
              </div>

              <div className={styles["input-group"]}>
                <label>Zip Code</label>
                <input type="text" placeholder="9500" />
              </div>
            </div>
          </div>

          {/* PAYMENT */}
          <div className={styles.card}>
            <h2>Payment Method</h2>

            <div className={styles["payment-methods"]}>
              <button className={styles.active}>Credit Card</button>
              <button>GCash</button>
              <button>PayPal</button>
            </div>

            <div className={styles["input-group"]}>
              <label>Card Number</label>
              <input type="text" placeholder="1234 5678 9012 3456" />
            </div>

            <div className={styles.row}>
              <div className={styles["input-group"]}>
                <label>Expiry</label>
                <input type="text" placeholder="MM/YY" />
              </div>

              <div className={styles["input-group"]}>
                <label>CVV</label>
                <input type="password" placeholder="123" />
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className={styles.checkout__right}>
          <div className={styles.summary}>
            <h2>Order Summary</h2>

            <div className={styles.product}>
              <img
                src="https://images.unsplash.com/photo-1542291026-7eec264c27ff"
                alt="product"
              />

              <div>
                <h3>Nike Air Max</h3>
                <p>Size: 42</p>
              </div>

              <span>$120</span>
            </div>

            <div className={styles.line}></div>

            <div className={styles.price}>
              <p>Subtotal</p>
              <span>$120</span>
            </div>

            <div className={styles.price}>
              <p>Shipping</p>
              <span>$10</span>
            </div>

            <div className={`${styles.price} ${styles.total}`}>
              <p>Total</p>
              <span>$130</span>
            </div>

            <button className={styles["checkout-btn"]}>
              Complete Purchase
            </button>
          </div>
        </div>

      </div>
    </div>
  )
}

export default Cheackout;