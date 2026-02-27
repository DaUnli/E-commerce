import React from "react";
import styles from "./LoadingSpinner.module.scss";

interface LoadingSpinnerProps {
  size?: "small" | "medium" | "large";
  fullScreen?: boolean;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = "medium",
  fullScreen = false,
}) => {
  return (
    <div className={`${styles.wrapper} ${fullScreen ? styles.fullScreen : ""}`}>
      <div className={`${styles.spinner} ${styles[size]}`}></div>
    </div>
  );
};

export default LoadingSpinner;