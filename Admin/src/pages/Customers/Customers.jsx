import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useDispatch } from "react-redux";
import { FaSearch, FaUsers, FaSync } from "react-icons/fa";
import { customerApi } from "../../services/api";
import { showToast } from "../../store/toastSlice";
import PageHeader from "../../components/PageHeader/PageHeader";
import Button from "../../components/ui/Button";
import Badge from "../../components/ui/Badge";
import Spinner from "../../components/ui/Spinner";
import EmptyState from "../../components/ui/EmptyState";
import Input from "../../components/ui/Input";
import { formatPrice, formatDate } from "../../utils/format";
import styles from "./customers.module.scss";

const Customers = () => {
  const dispatch = useDispatch();
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await customerApi.getAll();
      setCustomers(data || []);
    } catch (err) {
      dispatch(
        showToast({
          message: err.response?.data?.message || "Failed to load customers",
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

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return customers;
    return customers.filter(
      (c) =>
        (c.name || "").toLowerCase().includes(q) ||
        (c.email || "").toLowerCase().includes(q)
    );
  }, [customers, search]);

  const totalSpent = customers.reduce((s, c) => s + (c.totalSpent || 0), 0);
  const repeat = customers.filter((c) => c.totalOrders > 1).length;

  const initials = (name) =>
    name
      ? name
          .split(" ")
          .map((n) => n[0])
          .slice(0, 2)
          .join("")
          .toUpperCase()
      : "?";

  return (
    <div className="page">
      <PageHeader
        title="Customers"
        subtitle={`${customers.length} customers · ${formatPrice(totalSpent)} lifetime value`}
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
            placeholder="Search customers…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {loading ? (
        <div style={{ display: "flex", justifyContent: "center", padding: "4rem" }}>
          <Spinner size="lg" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="card">
          <EmptyState
            icon={FaUsers}
            title="No customers found"
            description="Customers who register and place orders will appear here."
          />
        </div>
      ) : (
        <div className="card">
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Customer</th>
                <th>Joined</th>
                <th>Orders</th>
                <th>Total spent</th>
                <th>Last order</th>
                <th>Tier</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((c) => (
                <tr key={c._id}>
                  <td>
                    <div className={styles.cell}>
                      <div className={styles.avatar}>{initials(c.name)}</div>
                      <div>
                        <div className={styles.name}>{c.name || "—"}</div>
                        <div className={styles.email}>{c.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="muted">{formatDate(c.createdAt)}</td>
                  <td>
                    <Badge color="gray">{c.totalOrders || 0}</Badge>
                  </td>
                  <td style={{ fontWeight: 600 }}>{formatPrice(c.totalSpent)}</td>
                  <td className="muted">{formatDate(c.lastOrder)}</td>
                  <td>
                    <Badge
                      color={(c.totalSpent || 0) >= 1000 ? "green" : "blue"}
                    >
                      {(c.totalSpent || 0) >= 1000 ? "VIP" : "Standard"}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div style={{ padding: "0.75rem 1rem", borderTop: "1px solid var(--border)", fontSize: "0.8125rem", color: "var(--muted-foreground)" }}>
            {repeat} repeat customers
          </div>
        </div>
      )}
    </div>
  );
};

export default Customers;
