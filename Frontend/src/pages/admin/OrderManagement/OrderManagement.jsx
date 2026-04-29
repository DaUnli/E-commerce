import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { orderApi } from "../../../api/orderApi";


const OrderManagement = () => {
  const [orders, setOrders] = useState([]);
  const [cancelledOrders, setCancelledOrders] = useState([]);
  const [activeTab, setActiveTab] = useState<"all" | "cancelled">("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const [allRes, cancelledRes] = await Promise.all([
        orderApi.getAllOrders(),
        orderApi.getCancelledOrders(),
      ]);
      setOrders(allRes.data.orders);
      setCancelledOrders(cancelledRes.data.orders);
    } catch (error) {
      console.error("Error fetching orders", error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await orderApi.updateOrderStatus(orderId, newStatus);
      setOrders(
        orders.map((order) =>
          order._id === orderId
            ? { ...order, orderStatus: newStatus }
            : order,
        ),
      );
    } catch (error) {
      console.error("Error updating order status", error);
      alert("Failed to update order status");
    }
  };

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case "pending":
        return "#fef3c7";
      case "processing":
        return "#dbeafe";
      case "shipped":
        return "#e0e7ff";
      case "delivered":
        return "#d1fae5";
      case "cancelled":
        return "#fee2e2";
      default:
        return "#f3f4f6";
    }
  };

  const getStatusTextColor = (status) => {
    switch (status.toLowerCase()) {
      case "pending":
        return "#92400e";
      case "processing":
        return "#1e40af";
      case "shipped":
        return "#3730a3";
      case "delivered":
        return "#065f46";
      case "cancelled":
        return "#991b1b";
      default:
        return "#4b5563";
    }
  };

  const displayOrders = activeTab === "all" ? orders : cancelledOrders;

  return (
    <div className={styles.container}>
      <aside className={styles.sidebar}>
        <nav className={styles.nav}>
          <Link to="/admin" className={styles.navItem}>
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <rect x="3" y="3" width="7" height="7" />
              <rect x="14" y="3" width="7" height="7" />
              <rect x="14" y="14" width="7" height="7" />
              <rect x="3" y="14" width="7" height="7" />
            </svg>
            Dashboard
          </Link>
          <Link to="/admin/products" className={styles.navItem}>
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" />
              <line x1="7" y1="7" x2="7.01" y2="7" />
            </svg>
            Products
          </Link>
          <Link
            to="/admin/orders"
            className={`${styles.navItem} ${styles.active}`}
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 02V6l-3-4z" />{" "}
              <line x1="3" y1="6" x2="21" y2="6" />{" "}
              <path d="M16 10a4 4 0 0 1-8 0" />{" "}
            </svg>{" "}
            Orders{" "}
          </Link>{" "}
        </nav>{" "}
      </aside>

      <main className={styles.main}>
        <div className={styles.header}>
          <h1>Order Management</h1>
          <div className={styles.tabs}>
            <button
              className={`${styles.tab} ${activeTab === "all" ? styles.active : ""}`}
              onClick={() => setActiveTab("all")}
            >
              All Orders ({orders.length})
            </button>
            <button
              className={`${styles.tab} ${activeTab === "cancelled" ? styles.active : ""}`}
              onClick={() => setActiveTab("cancelled")}
            >
              Cancelled ({cancelledOrders.length})
            </button>
          </div>
        </div>

        <div className={styles.tableCard}>
          {loading ? (
            <div style={{ padding: "2rem", textAlign: "center" }}>
              Loading...
            </div>
          ) : displayOrders.length === 0 ? (
            <div
              style={{ padding: "2rem", textAlign: "center", color: "#4B5563" }}
            >
              No orders found
            </div>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Customer</th>
                  <th>Date</th>
                  <th>Products</th>
                  <th>Total</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {displayOrders.map((order) => (
                  <tr key={order._id}>
                    <td>#{order._id.slice(-8).toUpperCase()}</td>
                    <td>{order.userId}</td>
                    <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                    <td>{order.products.length} items</td>
                    <td>${order.totalPrice.toFixed(2)}</td>
                    <td>
                      <span
                        className={styles.status}
                        style={{
                          backgroundColor: getStatusColor(order.orderStatus),
                          color: getStatusTextColor(order.orderStatus),
                        }}
                      >
                        {order.orderStatus}
                      </span>
                    </td>
                    <td>
                      <div className={styles.actions}>
                        <select
                          value={order.orderStatus}
                          onChange={(e) =>
                            handleStatusChange(order._id, e.target.value)
                          }
                          disabled={order.orderStatus === "Cancelled"}
                        >
                          <option value="Pending">Pending</option>
                          <option value="Processing">Processing</option>
                          <option value="Shipped">Shipped</option>
                          <option value="Delivered">Delivered</option>
                          <option value="Cancelled">Cancelled</option>
                        </select>
                        <button>View</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </main>
    </div>
  );
};

export default OrderManagement;
