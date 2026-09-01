import React, { forwardRef } from "react";
import { FaChevronDown } from "react-icons/fa";
import styles from "./field.module.scss";

const Select = forwardRef(
  (
    {
      size = "md",
      icon: Icon,
      error,
      className = "",
      id,
      children,
      ...props
    },
    ref
  ) => {
    return (
      <div
        className={`${styles.control} ${styles[size]} ${
          error ? styles.error : ""
        } ${props.disabled ? styles.disabled : ""} ${className}`}
      >
        {Icon && (
          <span className={`${styles.addon} ${styles.leading}`}>
            <Icon />
          </span>
        )}
        <select ref={ref} id={id} className={styles.select} {...props}>
          {children}
        </select>
        <span className={styles.selectChevron}>
          <FaChevronDown />
        </span>
      </div>
    );
  }
);

Select.displayName = "Select";
export default Select;
