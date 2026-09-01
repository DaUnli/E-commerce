import React from "react";
import styles from "./pageHeader.module.scss";

const PageHeader = ({ title, subtitle, children }) => {
  return (
    <div className={styles.header}>
      <div className={styles.left}>
        <h2 className={styles.title}>{title}</h2>
        {subtitle && <div className={styles.subtitle}>{subtitle}</div>}
      </div>
      {children && <div className={styles.right}>{children}</div>}
    </div>
  );
};

export default PageHeader;
