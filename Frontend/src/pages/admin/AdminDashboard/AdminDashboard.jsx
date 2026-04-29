import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { orderApi } from '../../../api/orderApi';
import styles from './AdminDashboard.module.scss';

const AdminDashboard = () => {
  const [orders, setOrders] = useState([]);
  const [stats, setStats] = useState({
    totalOrders: 0,
    pendingOrders: 0,
    totalRevenue: 0,
    cancelledOrders: 0
  });

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await orderApi.getAllOrders();
        const allOrders = res.data.orders;
        setOrders(allOrders);

        const totalRevenue = allOrders.reduce((sum, order) => 
          order.paymentStatus === 'Paid' ? sum + order.totalPrice : sum, 0
        );

        setStats({
          totalOrders: allOrders.length,
          pendingOrders: allOrders.filter((o) => o.orderStatus === 'Pending').length,
          totalRevenue,
          cancelledOrders: allOrders.filter((o) => o.orderStatus === 'Cancelled').length
        });
      } catch (error) {
        console.error('Error fetching orders', error);
      }
    };
    fetchOrders();
  }, []);

  const getStatusClass = (status) => {
    switch (status.toLowerCase()) {
      case 'pending': return '#92400e';
      case 'processing': return '#1e40af';
      case 'shipped': return '#3730a3';
      case 'delivered': return '#065f46';
      case 'cancelled': return '#991b1b';
      default: return '#4b5563';
    }
  };

  return (
    <div className={styles.container}>
      <aside className={styles.sidebar}>
        <nav className={styles.nav}>
          <Link to="/admin" className={`${styles.navItem} ${styles.active}`}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" />
              <rect x="14" y="14" width="7" height="7" /><rect x="3" y="14" width="7" height="7" />
            </svg>
            Dashboard
          </Link>
          <Link to="/admin/products" className={styles.navItem}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" />
              <line x1="7" y1="7" x2="7.01" y2="7" />
            </svg>
            Products
          </Link>
          <Link to="/admin/orders" className={styles.navItem}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
              <line x1="3" y1="6" x2="21" y2="6" />
              <path d="M16 10a4 4 0 0 1-8 0" />
            </svg>
            Orders
          </Link>
        </nav>
      </aside>

      <main className={styles.main}>
        <div className={styles.header}>
          <h1>Dashboard</h1>
        </div>

        <div className={styles.statsGrid}>
          <div className={styles.statCard}>
            <div className={styles.label}>Total Orders</div>
            <div className={styles.value}>{stats.totalOrders}</div>
          </div>
          <div className={styles.statCard}>
            <div className={styles.label}>Pending Orders</div>
            <div className={styles.value}>{stats.pendingOrders}</div>
          </div>
          <div className={styles.statCard}>
            <div className={styles.label}>Total Revenue</div>
            <div className={styles.value}>${stats.totalRevenue.toFixed(2)}</div>
          </div>
          <div className={styles.statCard}>
            <div className={styles.label}>Cancelled Orders</div>
            <div className={styles.value}>{stats.cancelledOrders}</div>
          </div>
        </div>

        <div className={styles.recentOrders}>
          <div className={styles.header}>
            <h2>Recent Orders</h2>
            <Link to="/admin/orders">View All</Link>
          </div>
          <table>
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Customer</th>
                <th>Date</th>
                <th>Status</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              {orders.slice(0, 5).map((order) => (
                <tr key={order._id}>
                  <td>#{order._id.slice(-8).toUpperCase()}</td>
                  <td>{order.userId}</td>
                  <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                  <td>
                    <span style={{ 
                      color: getStatusClass(order.orderStatus),
                      fontWeight: 600 
                    }}>
                      {order.orderStatus}
                    </span>
                  </td>
                  <td>${order.totalPrice.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;