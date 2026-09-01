import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { FaCheckCircle, FaLock } from "react-icons/fa";
import Navbar from "../../components/Navbar/Navbar";
import LoadingSpinner from "../../components/LoadingSpinner/LoadingSpinner";
import styles from "./Payment.module.scss";
import { updateOrderStatus } from "../../store/ordersSlice";

const readPaymentInfo = () => {
  try {
    const raw = sessionStorage.getItem("paymentInfo");
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

const Payment = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [info] = useState(readPaymentInfo);
  const [processing, setProcessing] = useState(false);
  const [paid, setPaid] = useState(false);

  const methodLabels = {
    "credit-card": "Credit Card",
    gcash: "GCash",
    paypal: "PayPal",
  };

  const handlePay = () => {
    setProcessing(true);
    setTimeout(() => {
      if (info) {
        dispatch(
          updateOrderStatus({ orderId: info.orderId, status: "Paid" })
        );
      }
      setProcessing(false);
      setPaid(true);
      sessionStorage.removeItem("paymentInfo");
    }, 2000);
  };

  return (
    <>
      <Navbar />
      <div className={styles.container}>
        {!info && !paid ? (
          <div className={styles.centerBox}>
            <h2>No payment pending</h2>
            <p>You have no active payment to complete.</p>
            <Link to="/home" className={styles.link}>
              Go Shopping
            </Link>
          </div>
        ) : paid ? (
          <div className={`${styles.centerBox} ${styles.success}`}>
            <FaCheckCircle className={styles.successIcon} />
            <h2>Payment Successful!</h2>
            <p>Your order has been paid and is now being prepared.</p>
            <div className={styles.btnRow}>
              <Link to="/orders" className={styles.primaryBtn}>
                View My Orders
              </Link>
              <Link to="/home" className={styles.secondaryBtn}>
                Continue Shopping
              </Link>
            </div>
          </div>
        ) : (
          <div className={styles.payCard}>
            <div className={styles.payHeader}>
              <FaLock className={styles.lockIcon} />
              <h2>Secure Payment</h2>
              <p>
                Paying with{" "}
                <strong>{methodLabels[info.method] || "your method"}</strong>
              </p>
            </div>

            <div className={styles.amount}>
              <span>Total Due</span>
              <strong>₱{info.total.toFixed(2)}</strong>
            </div>

            {info.method === "credit-card" && (
              <div className={styles.cardPreview}>
                <p>•••• •••• •••• 4242</p>
                <span>VISA</span>
              </div>
            )}
            {info.method === "gcash" && (
              <div className={styles.methodNote}>
                Complete payment via your GCash app.
              </div>
            )}
            {info.method === "paypal" && (
              <div className={styles.methodNote}>
                You'll be redirected to PayPal to approve the payment.
              </div>
            )}

            <button
              className={styles.payBtn}
              onClick={handlePay}
              disabled={processing}
            >
              {processing ? (
                <LoadingSpinner size="small" />
              ) : (
                `Pay ₱${info.total.toFixed(2)}`
              )}
            </button>

            <button
              className={styles.cancelBtn}
              onClick={() => navigate("/orders")}
              disabled={processing}
            >
              Cancel & go to Orders
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default Payment;
