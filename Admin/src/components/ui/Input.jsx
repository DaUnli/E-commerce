import React, { forwardRef } from "react";
import styles from "./field.module.scss";

const Input = forwardRef(
  (
    {
      size = "md",
      icon: Icon,
      rightIcon,
      prefix,
      suffix,
      error,
      className = "",
      id,
      type = "text",
      ...props
    },
    ref
  ) => {
    const RightIcon = rightIcon;
    return (
      <div
        className={`${styles.control} ${styles[size]} ${
          error ? styles.error : ""
        } ${props.disabled ? styles.disabled : ""} ${className}`}
      >
        {(Icon || prefix) && (
          <span className={`${styles.addon} ${styles.leading}`}>
            {Icon && <Icon />}
            {prefix && <span>{prefix}</span>}
          </span>
        )}
        <input
          ref={ref}
          id={id}
          type={type}
          className={styles.element}
          {...props}
        />
        {(RightIcon || suffix) && (
          <span className={`${styles.addon} ${styles.trailing}`}>
            {RightIcon && <RightIcon />}
            {suffix && <span>{suffix}</span>}
          </span>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";
export default Input;
