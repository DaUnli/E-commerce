import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { FaBoxOpen, FaCheckCircle } from "react-icons/fa";
import Navbar from "../../components/Navbar/Navbar";
import Toast from "../../components/Toast/Toast";
import styles from "./Orders.module.scss";
import {
  updateOrderStatus,
  cancelOrder,
  getMyOrders,
} from "../../store/ordersSlice";
import { showToast } from "../../store/toastSlice";

const methodLabels = {
  "credit-card": "Credit Card",
  gcash: "GCash",
  paypal: "PayPal",
};

const Orders = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const orders = useSelector((state) => state.orders.items);
  const user = useSelector((state) => state.auth.user);
  const [tab, setTab] = useState("pending");
  const [expanded, setExpanded] = useState(null);

  useEffect(() => {
    if (user) {
      dispatch(getMyOrders());
    } else {
      navigate("/login");
    }
  }, [user, dispatch, navigate]);

  const pendingOrders = orders.filter(
    (o) => o.status === "Pending" || o.status === "Paid"
  );
  const deliveredOrders = orders.filter((o) => o.status === "Delivered");

  const list = tab === "pending" ? pendingOrders : deliveredOrders;

  const handleDelivered = (order) => {
    dispatch(updateOrderStatus({ orderId: order.id, status: "Delivered" }));
    dispatch(
      showToast({ message: `Order ${order.id} marked as delivered`, type: "success" })
    );
  };

  const handleCancel = (order) => {
    dispatch(cancelOrder(order.id));
    dispatch(
      showToast({ message: `Order ${order.id} cancelled`, type: "success" })
    );
  };

  const formatDate = (iso) =>
    new Date(iso).toLocaleString("en-PH", {
      dateStyle: "medium",
      timeStyle: "short",
    });

  return (
    <>
      <Navbar />
      <Toast />
      <div className={styles.container}>
        <h1 className={styles.pageTitle}>My Orders</h1>

        <div className={styles.tabs}>
          <button
            className={tab === "pending" ? styles.active : ""}
            onClick={() => setTab("pending")}
          >
            Pending Orders ({pendingOrders.length})
          </button>
          <button
            className={tab === "delivered" ? styles.active : ""}
            onClick={() => setTab("delivered")}
          >
            Delivered ({deliveredOrders.length})
          </button>
        </div>

        {orders.length === 0 ? (
          <div className={styles.empty}>
            <FaBoxOpen className={styles.emptyIcon} />
            <h2>No orders yet</h2>
            <p>Place your first order to see it here.</p>
            <Link to="/home" className={styles.shopBtn}>
              Start Shopping
            </Link>
          </div>
        ) : list.length === 0 ? (
          <div className={styles.empty}>
            <p>
              No {tab === "pending" ? "pending" : "delivered"} orders found.
            </p>
          </div>
        ) : (
          <div className={styles.list}>
            {list.map((order) => (
              <div key={order.id} className={styles.orderCard}>
                <div
                  className={styles.orderHeader}
                  onClick={() =>
                    setExpanded(expanded === order.id ? null : order.id)
                  }
                >
                  <div>
                    <span className={styles.orderNo}>Order #{order.id}</span>
                    <span className={styles.orderDate}>
                      {formatDate(order.createdAt)}
                    </span>
                  </div>
                  <span className={`${styles.badge} ${styles[order.status.toLowerCase().replace(" ", "-")]}`}>
                    {order.status}
                  </span>
                </div>

                <div className={styles.itemsPreview}>
                  {order.items.map((item) => (
                    <div key={item.id} className={styles.itemRow}>
                      <img src={item.image} alt={item.name} />
                      <span className={styles.itemName}>{item.name}</span>
                      <span className={styles.itemQty}>x{item.quantity}</span>
                      <span className={styles.itemPrice}>
                        ₱{(item.price * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>

                <div className={styles.totalRow}>
                  <span>Total</span>
                  <span className={styles.total}>₱{order.total.toFixed(2)}</span>
                </div>

                {expanded === order.id && (
                  <div className={styles.details}>
                    <div className={styles.detailBlock}>
                      <h4>Shipping Address</h4>
                      <p>{order.shippingAddress.fullName}</p>
                      <p>{order.shippingAddress.street}, {order.shippingAddress.city} {order.shippingAddress.zip}</p>
                      <p>{order.shippingAddress.phone}</p>
                    </div>
                    <div className={styles.detailBlock}>
                      <h4>Payment</h4>
                      <p>
                        {methodLabels[order.paymentMethod] || order.paymentMethod}
                      </p>
                      <p>Subtotal: ₱{order.subtotal.toFixed(2)}</p>
                      <p>Delivery: ₱{order.deliveryFee.toFixed(2)}</p>
                    </div>
                  </div>
                )}

                {order.status !== "Delivered" && (
                  <div className={styles.actions}>
                    <button
                      className={styles.deliverBtn}
                      onClick={() => handleDelivered(order)}
                    >
                      <FaCheckCircle /> Confirm Received / Mark Delivered
                    </button>
                    <button
                      className={styles.cancelBtn}
                      onClick={() => handleCancel(order)}
                    >
                      Cancel Order
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default Orders;
