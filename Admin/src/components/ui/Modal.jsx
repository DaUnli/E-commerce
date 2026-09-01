import React from "react";
import { FaTimes } from "react-icons/fa";
import Button from "./Button";
import styles from "./modal.module.scss";

const Modal = ({ title, children, footer, onClose, size = "" }) => {
  return (
    <div className={styles.overlay} onClick={onClose}>
      <div
        className={`${styles.content} ${size === "large" ? styles.large : ""}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className={styles.header}>
          <h3>{title}</h3>
          <button className={styles.close} onClick={onClose}>
            <FaTimes />
          </button>
        </div>
        <div className={styles.body}>{children}</div>
        {footer && <div className={styles.footer}>{footer}</div>}
      </div>
    </div>
  );
};

export { Button };
export default Modal;
