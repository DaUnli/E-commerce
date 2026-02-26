import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { orderApi } from '../../../api/orderApi';
import type { Order } from '../../../types/index';
import styles from './Orders.module.scss';

const Orders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await orderApi.getMyOrders();
        setOrders(res.data.orders);
      } catch (error) {
        console.error('Error fetching orders', error);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const handleCancel = async (orderId: string) => {
    if (!window.confirm('Are you sure you want to cancel this order?')) return;
    
    try {
      await orderApi.cancelOrder(orderId);
      setOrders(orders.map(order => 
        order._id === orderId ? { ...order, orderStatus: 'Cancelled' as const } : order
      ));
    } catch (error) {
      console.error('Error cancelling order', error);
      alert('Failed to cancel order');
    }
  };

  const getStatusClass = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending': return styles.pending;
      case 'processing': return styles.processing;
      case 'shipped': return styles.shipped;
      case 'delivered': return styles.delivered;
      case 'cancelled': return styles.cancelled;
      default: return '';
    }
  };

  if (loading) return <div className={styles.container}>Loading...</div>;

  if (orders.length === 0) {
    return (
      <div className={styles.container}>
        <h1>My Orders</h1>
        <div className={styles.empty}>
          <h2>No orders yet</h2>
          <p style={{ color: '#4B5563', marginBottom: '1rem' }}>Start shopping to see your orders here</p>
          <Link to="/">Start Shopping</Link>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <h1>My Orders</h1>
      
      <div className={styles.ordersList}>
        {orders.map((order) => (
          <div key={order._id} className={styles.orderCard}>
            <div className={styles.orderHeader}>
              <div className={styles.orderInfo}>
                <div className={styles.infoItem}>
                  <label>Order ID</label>
                  <span>#{order._id.slice(-8).toUpperCase()}</span>
                </div>
                <div className={styles.infoItem}>
                  <label>Date</label>
                  <span>{new Date(order.createdAt).toLocaleDateString()}</span>
                </div>
                <div className={styles.infoItem}>
                  <label>Total</label>
                  <span>${order.totalPrice.toFixed(2)}</span>
                </div>
              </div>
              <span className={`${styles.status} ${getStatusClass(order.orderStatus)}`}>
                {order.orderStatus}
              </span>
            </div>

            <div className={styles.orderItems}>
              {order.products.map((item, index) => (
                <div key={index} className={styles.item}>
                  <div className={styles.image}>
                    {/* Placeholder - replace with actual image if available */}
                    <img src="https://via.placeholder.com/70" alt={item.name} />
                  </div>
                  <div className={styles.details}>
                    <h4>{item.name}</h4>
                    <span className={styles.qty}>Qty: {item.quantity} × ${item.price}</span>
                  </div>
                  <span className={styles.price}>${item.price * item.quantity}</span>
                </div>
              ))}
            </div>

            <div className={styles.orderFooter}>
              <div className={styles.total}>
                <span>Total Paid:</span>
                ${order.totalPrice.toFixed(2)}
              </div>
              <div className={styles.actions}>
                {order.orderStatus === 'Pending' || order.orderStatus === 'Processing' ? (
                  <button 
                    className={styles.cancelBtn}
                    onClick={() => handleCancel(order._id)}
                  >
                    Cancel Order
                  </button>
                ) : null}
                <button className={styles.trackBtn}>Track Order</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Orders;