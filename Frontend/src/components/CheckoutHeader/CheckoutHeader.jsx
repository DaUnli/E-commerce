import React from "react";
import { Link } from "react-router-dom";
import { FaArrowLeft, FaLock } from "react-icons/fa";
import styles from "./CheckoutHeader.module.scss";

const CheckoutHeader = ({ title, step, backTo, backLabel }) => {
  return (
    <header className={styles.header}>
      <div className={styles.accent} />
      <div className={styles.bar}>
        <Link to="/home" className={styles.brand}>
          <img src="/logo.png" alt="7eleven" className={styles.logo} />
        </Link>

        <div className={styles.center}>
          <span className={styles.stepLabel}>Step {step} of 2</span>
          <h1 className={styles.title}>{title}</h1>
        </div>

        <div className={styles.right}>
          <span className={styles.secure}>
            <FaLock className={styles.secureIcon} />
            Secure Checkout
          </span>
          <Link to={backTo || "/home"} className={styles.back}>
            <FaArrowLeft className={styles.backIcon} />
            <span className={styles.backText}>{backLabel || "Continue Shopping"}</span>
          </Link>
        </div>
      </div>
    </header>
  );
};

export default CheckoutHeader;
