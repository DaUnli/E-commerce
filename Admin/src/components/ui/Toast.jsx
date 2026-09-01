import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { hideToast } from "../../store/toastSlice";
import styles from "./toast.module.scss";

const Toast = () => {
  const dispatch = useDispatch();
  const { message, type } = useSelector((state) => state.toast);

  useEffect(() => {
    if (!message) return;
    const t = setTimeout(() => dispatch(hideToast()), 2500);
    return () => clearTimeout(t);
  }, [message, dispatch]);

  if (!message) return null;

  return (
    <div className={`${styles.toast} ${styles[type]}`}>
      <span className={styles.dot} />
      {message}
    </div>
  );
};

export default Toast;
