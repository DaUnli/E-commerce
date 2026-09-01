import React from "react";
import { FaExclamationCircle } from "react-icons/fa";
import styles from "./field.module.scss";

const Field = ({
  label,
  required,
  optional,
  hint,
  error,
  htmlFor,
  className = "",
  children,
}) => {
  return (
    <div className={`${styles.field} ${className}`}>
      {(label || optional) && (
        <div className={styles.labelRow}>
          <label htmlFor={htmlFor}>
            {label}
            {required && <span className={styles.required}>*</span>}
          </label>
          {optional && <span className={styles.optional}>{optional}</span>}
        </div>
      )}
      {children}
      {error ? (
        <span className={styles.error}>
          <FaExclamationCircle /> {error}
        </span>
      ) : (
        hint && <span className={styles.hint}>{hint}</span>
      )}
    </div>
  );
};

export default Field;
