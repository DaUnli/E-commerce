import React from "react";
import styles from "./spinner.module.scss";

const Spinner = ({ size = "md" }) => {
  return <div className={`${styles.spinner} ${styles[size]}`} />;
};

export default Spinner;
