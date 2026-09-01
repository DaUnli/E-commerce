import React, { useCallback, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { FaSearch, FaClipboardList, FaSync } from "react-icons/fa";
import { orderApi } from "../../services/api";
import { showToast } from "../../store/toastSlice";
import { ORDER_STATUSES, orderStatusMeta, paymentMethodLabel } from "../../utils/status";
import { formatPrice, formatDateTime, formatDate } from "../../utils/format";
import PageHeader from "../../components/PageHeader/PageHeader";
import Button from "../../components/ui/Button";
import Badge from "../../components/ui/Badge";
import Spinner from "../../components/ui/Spinner";
import Modal from "../../components/ui/Modal";
import EmptyState from "../../components/ui/EmptyState";
import Input from "../../components/ui/Input";
import Select from "../../components/ui/Select";
import styles from "./orders.module.scss";

const Orders = () => {
  const dispatch = useDispatch();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState(null);
  const [updating, setUpdating] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await orderApi.getAll();
      setOrders(data || []);
    } catch (err) {
      dispatch(
        showToast({
          message: err.response?.data?.message || "Failed to load orders",
          type: "error",
        })
      );
    } finally {
      setLoading(false);
    }
  }, [dispatch]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    load();
  }, [load]);

  const filtered = orders.filter((o) => {
    const matchStatus = statusFilter === "All" || o.status === statusFilter;
    const q = search.trim().toLowerCase();
    const matchSearch =
      !q ||
      (o.shippingAddress?.fullName || "").toLowerCase().includes(q) ||
      (o.shippingAddress?.email || "").toLowerCase().includes(q) ||
      (o._id || "").toString().toLowerCase().includes(q);
    return matchStatus && matchSearch;
  });

  const changeStatus = async (newStatus) => {
    setUpdating(true);
    try {
      const { data } = await orderApi.updateStatus(selected._id, newStatus);
      setOrders((prev) =>
        prev.map((o) => (o._id === selected._id ? { ...o, status: data.status || newStatus } : o))
      );
      setSelected((s) => ({ ...s, status: data.status || newStatus }));
      dispatch(showToast({ message: `Order marked ${data.status || newStatus}`, type: "success" }));
    } catch (err) {
      dispatch(
        showToast({
          message: err.response?.data?.message || "Failed to update status",
          type: "error",
        })
      );
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div className="page">
      <PageHeader
        title="Orders"
        subtitle={`${orders.length} orders total`}
      >
        <Button variant="secondary" onClick={load}>
          <FaSync /> Refresh
        </Button>
      </PageHeader>

      <div className={styles.toolbar}>
        <div className={styles.searchWrap}>
          <Input
            size="sm"
            icon={FaSearch}
            placeholder="Search by customer, email or ID…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className={styles.filterRow}>
          {["All", ...ORDER_STATUSES].map((s) => (
            <button
              key={s}
              className={`${styles.filterBtn} ${statusFilter === s ? styles.active : ""}`}
              onClick={() => setStatusFilter(s)}
            >
              {s}
              {s !== "All" && (
                <span style={{ opacity: 0.7, marginLeft: "0.25rem" }}>
                  {orders.filter((o) => o.status === s).length}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div style={{ display: "flex", justifyContent: "center", padding: "4rem" }}>
          <Spinner size="lg" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="card">
          <EmptyState
            icon={FaClipboardList}
            title="No orders found"
            description="Orders will appear here as customers place them."
          />
        </div>
      ) : (
        <div className="card">
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Order</th>
                <th>Customer</th>
                <th>Date</th>
                <th>Items</th>
                <th>Payment</th>
                <th>Total</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((o) => (
                <tr key={o._id} onClick={() => setSelected(o)}>
                  <td className={styles.orderNo}>
                    #{o._id?.toString().slice(-6)}
                  </td>
                  <td>{o.shippingAddress?.fullName || "—"}</td>
                  <td className="muted">{formatDate(o.createdAt)}</td>
                  <td>{o.items?.reduce((s, i) => s + i.quantity, 0)}</td>
                  <td className="muted">{paymentMethodLabel(o.paymentMethod)}</td>
                  <td style={{ fontWeight: 600 }}>{formatPrice(o.total)}</td>
                  <td>
                    <Badge color={orderStatusMeta[o.status]?.color || "gray"}>
                      {o.status}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {selected && (
        <Modal
          title={`Order #${selected._id?.toString().slice(-6)}`}
          size="large"
          onClose={() => setSelected(null)}
        >
          <div className="muted" style={{ fontSize: "0.75rem", marginBottom: "1rem" }}>
            Placed {formatDateTime(selected.createdAt)}
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "1rem" }}
            className="responsive2col"
          >
            <div className={styles.statusWrap}>
              <h4 style={{ fontSize: "0.8125rem", fontWeight: 600, marginBottom: "0.375rem" }}>
                Update status
              </h4>
              <Select
                value={selected.status}
                disabled={updating}
                onChange={(e) => changeStatus(e.target.value)}
              >
                {ORDER_STATUSES.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </Select>
              {updating && <Spinner size="sm" />}
            </div>

            <div className={styles.customerInfo}>
              <h4 style={{ fontSize: "0.8125rem", fontWeight: 600, marginBottom: "0.5rem" }}>
                Customer
              </h4>
              <div className={styles.line}>
                <span className={styles.k}>Name</span>
                {selected.shippingAddress?.fullName || "—"}
              </div>
              <div className={styles.line}>
                <span className={styles.k}>Email</span>
                {selected.shippingAddress?.email || "—"}
              </div>
              <div className={styles.line}>
                <span className={styles.k}>Phone</span>
                {selected.shippingAddress?.phone || "—"}
              </div>
              <div className={styles.line}>
                <span className={styles.k}>Address</span>
                {[selected.shippingAddress?.street, selected.shippingAddress?.city, selected.shippingAddress?.zip]
                  .filter(Boolean)
                  .join(", ") || "—"}
              </div>
              <div className={styles.line}>
                <span className={styles.k}>Payment</span>
                {paymentMethodLabel(selected.paymentMethod)}
              </div>
            </div>
          </div>

          <div className={styles.itemsList}>
            <h4 style={{ fontSize: "0.8125rem", fontWeight: 600, marginBottom: "0.25rem" }}>
              Items
            </h4>
            {selected.items?.map((item, i) => (
              <div className={styles.item} key={i}>
                <div className={styles.img}>
                  {item.image && <img src={item.image} alt={item.name} />}
                </div>
                <div className={styles.info}>
                  <div className={styles.name}>{item.name}</div>
                  <div className={styles.qty}>
                    {item.quantity} × {formatPrice(item.price)}
                  </div>
                </div>
                <div className={styles.lineTotal}>
                  {formatPrice(item.price * item.quantity)}
                </div>
              </div>
            ))}
          </div>

          <div className={styles.totals}>
            <div className={styles.row}>
              <span>Subtotal</span>
              <span>{formatPrice(selected.subtotal)}</span>
            </div>
            <div className={styles.row}>
              <span>Delivery</span>
              <span>{formatPrice(selected.deliveryFee)}</span>
            </div>
            <div className={styles.row}>
              <span>Total</span>
              <span>{formatPrice(selected.total)}</span>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default Orders;
