import React, { forwardRef } from "react";
import styles from "./field.module.scss";

const Textarea = forwardRef(
  ({ size = "md", error, className = "", id, ...props }, ref) => {
    return (
      <div
        className={`${styles.control} ${styles[size]} ${styles.textarea} ${
          error ? styles.error : ""
        } ${props.disabled ? styles.disabled : ""} ${className}`}
        style={{ alignItems: "stretch", display: "flex" }}
      >
        <textarea
          ref={ref}
          id={id}
          className={styles.element}
          style={{ minHeight: 80, padding: "0.375rem 0.125rem" }}
          {...props}
        />
      </div>
    );
  }
);

Textarea.displayName = "Textarea";
export default Textarea;
