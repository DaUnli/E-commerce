import React from "react";
import styles from "./LoadingSpinner.module.scss";

const LoadingSpinner = ({ size = "medium", fullScreen = false }) => {
  return (
    <div
      className={`${styles.wrapper} ${fullScreen ? styles.fullScreen : ""}`}
    >
      <div className={`${styles.spinner} ${styles[size]}`}></div>
    </div>
  );
};

export default LoadingSpinner;