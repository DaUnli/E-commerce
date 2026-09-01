import React from "react";
import styles from "./ui.module.scss";

const Badge = ({ children, color = "gray", className = "" }) => {
  return (
    <span className={`${styles.badge} ${styles[color]} ${className}`}>
      {children}
    </span>
  );
};

export default Badge;
