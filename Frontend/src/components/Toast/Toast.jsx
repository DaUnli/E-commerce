import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { hideToast } from "../../store/toastSlice";
import { FaCheckCircle, FaExclamationCircle } from "react-icons/fa";
import styles from "./Toast.module.scss";

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
      {type === "success" ? (
        <FaCheckCircle className={styles.icon} />
      ) : (
        <FaExclamationCircle className={styles.icon} />
      )}
      <span>{message}</span>
    </div>
  );
};

export default Toast;
