import React from "react";
import styles from "./ui.module.scss";

const EmptyState = ({ icon: Icon, title, description, action }) => {
  return (
    <div className={styles.empty}>
      {Icon && <Icon className={styles.icon} />}
      <h3>{title}</h3>
      {description && <p>{description}</p>}
      {action}
    </div>
  );
};

export default EmptyState;
