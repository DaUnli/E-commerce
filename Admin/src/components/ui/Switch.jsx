import React from "react";
import styles from "./field.module.scss";

const Switch = ({ checked, onChange, disabled, label, className = "" }) => {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      className={`${styles.switch} ${checked ? styles.on : ""} ${className}`}
      onClick={() => !disabled && onChange?.(!checked)}
      disabled={disabled}
    />
  );
};

export default Switch;
