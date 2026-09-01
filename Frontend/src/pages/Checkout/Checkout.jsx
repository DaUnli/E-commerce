import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import CheckoutHeader from "../../components/CheckoutHeader/CheckoutHeader";
import Toast from "../../components/Toast/Toast";
import styles from "./Checkout.module.scss";
import { placeOrder } from "../../store/ordersSlice";
import { clearCart, selectSubtotal } from "../../store/cartSlice";
import { showToast } from "../../store/toastSlice";

const DELIVERY_FEE = 35;

const Checkout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const cartItems = useSelector((state) => state.cart.items);
  const subtotal = useSelector(selectSubtotal);
  const total = subtotal + DELIVERY_FEE;
  const user = useSelector((state) => state.auth.user);

  const [contact, setContact] = useState({
    fullName: user?.name || "",
    email: user?.email || "",
    phone: "",
  });
  const [shipping, setShipping] = useState({
    street: "",
    city: "Davao City",
    zip: "8000",
  });
  const [payment, setPayment] = useState({
    method: "credit-card",
    cardNumber: "",
    expiry: "",
    cvv: "",
  });
  const [error, setError] = useState("");

  const handleContact = (e) =>
    setContact({ ...contact, [e.target.name]: e.target.value });
  const handleShipping = (e) =>
    setShipping({ ...shipping, [e.target.name]: e.target.value });
  const handlePayment = (e) =>
    setPayment({ ...payment, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user) {
      setError("Please login to place an order.");
      return;
    }
    if (cartItems.length === 0) {
      setError("Your cart is empty.");
      return;
    }
    if (!contact.fullName || !contact.email || !contact.phone) {
      setError("Please fill in your contact information.");
      return;
    }
    if (!shipping.street) {
      setError("Please provide your shipping address.");
      return;
    }

    const order = {
      items: cartItems,
      shippingAddress: {
        fullName: contact.fullName,
        email: contact.email,
        phone: contact.phone,
        street: shipping.street,
        city: shipping.city,
        zip: shipping.zip,
      },
      paymentMethod: payment.method,
      subtotal,
      deliveryFee: DELIVERY_FEE,
      total,
    };

    const result = await dispatch(placeOrder(order));
    if (!placeOrder.fulfilled.match(result)) {
      setError(result.payload || "Failed to place your order.");
      return;
    }

    const orderId = result.payload.id;
    dispatch(clearCart());

    sessionStorage.setItem(
      "paymentInfo",
      JSON.stringify({
        orderId,
        method: payment.method,
        total,
      })
    );

    dispatch(
      showToast({ message: "Order placed! Proceeding to payment.", type: "success" })
    );
    navigate("/payment");
  };

  const paymentOptions = [
    { id: "credit-card", label: "Credit Card" },
    { id: "gcash", label: "GCash" },
    { id: "paypal", label: "PayPal" },
  ];

  return (
    <>
      <CheckoutHeader
        title="Checkout"
        step={2}
        backTo="/cart"
        backLabel="Back to Cart"
      />
      <Toast />
      <div className={styles.checkout}>
        <div className={styles.checkout__container}>
          <div className={styles.checkout__left}>
            <h1 className={styles.title}>Checkout</h1>

            <form onSubmit={handleSubmit} className={styles.form}>
              <div className={styles.card}>
                <h2>Contact Information</h2>
                <div className={styles["input-group"]}>
                  <label>Full Name</label>
                  <input
                    type="text"
                    name="fullName"
                    value={contact.fullName}
                    onChange={handleContact}
                    placeholder="Jane Doe"
                  />
                </div>
                <div className={styles["input-group"]}>
                  <label>Email Address</label>
                  <input
                    type="email"
                    name="email"
                    value={contact.email}
                    onChange={handleContact}
                    placeholder="jane@example.com"
                  />
                </div>
                <div className={styles["input-group"]}>
                  <label>Phone Number</label>
                  <input
                    type="text"
                    name="phone"
                    value={contact.phone}
                    onChange={handleContact}
                    placeholder="+63 912 345 6789"
                  />
                </div>
              </div>

              <div className={styles.card}>
                <h2>Shipping Address</h2>
                <div className={styles["input-group"]}>
                  <label>Street Address</label>
                  <input
                    type="text"
                    name="street"
                    value={shipping.street}
                    onChange={handleShipping}
                    placeholder="123 Main Street"
                  />
                </div>
                <div className={styles.row}>
                  <div className={styles["input-group"]}>
                    <label>City</label>
                    <input
                      type="text"
                      name="city"
                      value={shipping.city}
                      onChange={handleShipping}
                    />
                  </div>
                  <div className={styles["input-group"]}>
                    <label>Zip Code</label>
                    <input
                      type="text"
                      name="zip"
                      value={shipping.zip}
                      onChange={handleShipping}
                    />
                  </div>
                </div>
              </div>

              <div className={styles.card}>
                <h2>Payment Method</h2>
                <div className={styles["payment-methods"]}>
                  {paymentOptions.map((opt) => (
                    <button
                      type="button"
                      key={opt.id}
                      className={
                        payment.method === opt.id ? styles.active : ""
                      }
                      onClick={() =>
                        setPayment({ ...payment, method: opt.id })
                      }
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>

                {payment.method === "credit-card" && (
                  <>
                    <div className={styles["input-group"]}>
                      <label>Card Number</label>
                      <input
                        type="text"
                        name="cardNumber"
                        value={payment.cardNumber}
                        onChange={handlePayment}
                        placeholder="1234 5678 9012 3456"
                      />
                    </div>
                    <div className={styles.row}>
                      <div className={styles["input-group"]}>
                        <label>Expiry</label>
                        <input
                          type="text"
                          name="expiry"
                          value={payment.expiry}
                          onChange={handlePayment}
                          placeholder="MM/YY"
                        />
                      </div>
                      <div className={styles["input-group"]}>
                        <label>CVV</label>
                        <input
                          type="password"
                          name="cvv"
                          value={payment.cvv}
                          onChange={handlePayment}
                          placeholder="123"
                        />
                      </div>
                    </div>
                  </>
                )}

                {payment.method !== "credit-card" && (
                  <p className={styles.note}>
                    You will be redirected to {payment.method === "gcash" ? "GCash" : "PayPal"} to
                    complete your payment.
                  </p>
                )}
              </div>

              {error && <p className={styles.error}>{error}</p>}
            </form>
          </div>

          <div className={styles.checkout__right}>
            <div className={styles.summary}>
              <h2>Order Summary ({cartItems.length} items)</h2>

              <div className={styles.products}>
                {cartItems.map((item) => (
                  <div key={item.id} className={styles.product}>
                    <img src={item.image} alt={item.name} />
                    <div>
                      <h3>{item.name}</h3>
                      <p>Qty: {item.quantity}</p>
                    </div>
                    <span>₱{(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>

              <div className={styles.line}></div>

              <div className={styles.price}>
                <p>Subtotal</p>
                <span>₱{subtotal.toFixed(2)}</span>
              </div>
              <div className={styles.price}>
                <p>Delivery Fee</p>
                <span>₱{DELIVERY_FEE.toFixed(2)}</span>
              </div>
              <div className={`${styles.price} ${styles.total}`}>
                <p>Total</p>
                <span>₱{total.toFixed(2)}</span>
              </div>

              <button
                type="submit"
                className={styles["checkout-btn"]}
                onClick={handleSubmit}
              >
                Complete Purchase
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Checkout;
