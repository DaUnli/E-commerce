import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import { FaCircle, FaCompactDisc, FaUsers, FaDollarSign } from "react-icons/fa";
import { statsApi, orderApi } from "../../services/api";
import { showToast } from "../../store/toastSlice";
import { canAccess } from "../../config/roles";
import PageHeader from "../../components/PageHeader/PageHeader";
import Spinner from "../../components/ui/Spinner";
import Badge from "../../components/ui/Badge";
import EmptyState from "../../components/ui/EmptyState";
import Button from "../../components/ui/Button";
import { orderStatusMeta } from "../../utils/status";
import { formatPrice, formatDate, timeAgo } from "../../utils/format";
import styles from "./dashboard.module.scss";

const buildSalesSeries = (orders) => {
  const days = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    d.setDate(d.getDate() - i);
    const label = d.toLocaleDateString("en-US", { weekday: "short" });
    const total = orders
      .filter((o) => {
        const od = new Date(o.createdAt);
        return (
          od.getFullYear() === d.getFullYear() &&
          od.getMonth() === d.getMonth() &&
          od.getDate() === d.getDate() &&
          o.status !== "Cancelled"
        );
      })
      .reduce((s, o) => s + (o.total || 0), 0);
    days.push({ name: label, total: Math.round(total * 100) / 100 });
  }
  return days;
};

const buildDeltas = (orders) => {
  const now = new Date();
  const daysAgo = (n) => {
    const d = new Date(now);
    d.setDate(d.getDate() - n);
    return d;
  };
  const since = (o, start) => new Date(o.createdAt) >= start;
  const revenue = (list) =>
    list
      .filter((o) => o.status !== "Cancelled")
      .reduce((s, o) => s + (o.total || 0), 0);
  const aov = (list) => (list.length ? revenue(list) / list.length : 0);
  const pct = (cur, prev) =>
    prev === 0 ? (cur === 0 ? undefined : 100) : Math.round(((cur - prev) / prev) * 100);

  const cur30 = orders.filter((o) => since(o, daysAgo(30)));
  const prev30 = orders.filter((o) => since(o, daysAgo(60)) && !since(o, daysAgo(30)));

  return {
    revenue: pct(revenue(cur30), revenue(prev30)),
    orders: pct(cur30.length, prev30.length),
    aov: pct(aov(cur30), aov(prev30)),
  };
};

const KpiCard = (props) => {
  const { label, value, delta } = props;
  const Icon = props.icon;
  return (
    <div className={styles.statCard}>
      <div className={styles.label}>
        {label}
        <Icon className={styles.icon} />
      </div>
      <div className={styles.value}>{value}</div>
      {delta && (
        <div className={`${styles.delta} ${delta > 0 ? styles.up : styles.down}`}>
          {delta > 0 ? "▲" : "▼"} {Math.abs(delta)}%
        </div>
      )}
    </div>
  );
};

const Dashboard = () => {
  const dispatch = useDispatch();
  const user = useSelector((s) => s.auth.user);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);
  const [orders, setOrders] = useState([]);

  const load = async (silent = false) => {
    if (!silent) setLoading(true);
    try {
      const [statsRes, ordersRes] = await Promise.all([
        statsApi.overview(),
        orderApi.getAll(),
      ]);
      setStats(statsRes.data);
      setOrders(ordersRes.data || []);
    } catch (err) {
      if (!silent) {
        dispatch(
          showToast({ message: err.response?.data?.message || "Failed to load", type: "error" })
        );
      }
    } finally {
      if (!silent) setLoading(false);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    load();
    const poll = setInterval(() => load(true), 20000);
    return () => clearInterval(poll);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const salesSeries = useMemo(() => buildSalesSeries(orders), [orders]);
  const deltas = useMemo(() => buildDeltas(orders), [orders]);
  const recentOrders = useMemo(
    () => [...orders].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 7),
    [orders]
  );

  const maxPipeline = stats?.pipeline
    ? Math.max(1, ...Object.values(stats.pipeline))
    : 1;

  const pipelineColors = {
    Pending: "var(--warning)",
    Paid: "var(--info)",
    Delivered: "var(--success)",
    Cancelled: "var(--destructive)",
  };

  return (
    <div className="page">
      <PageHeader
        title="Dashboard"
        subtitle={`Welcome back, ${user?.name || "Admin"}`}
      >
        <Button variant="secondary" onClick={load}>
          Refresh
        </Button>
      </PageHeader>

      {loading && !stats ? (
        <div style={{ display: "flex", justifyContent: "center", padding: "4rem" }}>
          <Spinner size="lg" />
        </div>
      ) : (
        <>
          <div className={styles.kpis}>
            <KpiCard
              label="Total Revenue"
              value={formatPrice(stats?.kpis?.totalRevenue)}
              icon={FaDollarSign}
              delta={stats?.kpis ? deltas.revenue : undefined}
            />
            <KpiCard
              label="Orders"
              value={stats?.kpis?.orders}
              icon={FaCircle}
              delta={stats?.kpis ? deltas.orders : undefined}
            />
            <KpiCard
              label="Avg. Order Value"
              value={formatPrice(stats?.kpis?.aov)}
              icon={FaCompactDisc}
              delta={stats?.kpis ? deltas.aov : undefined}
            />
            <KpiCard
              label="Customers"
              value={stats?.kpis?.customers}
              icon={FaUsers}
            />
          </div>

          <div className={styles.grid}>
            <div className={styles.panel}>
              <div className={styles.panelTitle}>
                Sales (last 7 days)
                <span>{formatPrice(stats?.kpis?.totalRevenue)}</span>
              </div>
              <div className={styles.chartWrap}>
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={salesSeries}>
                    <defs>
                      <linearGradient id="sales" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="var(--primary)" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                    <XAxis dataKey="name" stroke="var(--muted-foreground)" fontSize={12} />
                    <YAxis
                      stroke="var(--muted-foreground)"
                      fontSize={11}
                      tickFormatter={(v) => `₱${v}`}
                      width={60}
                    />
                    <Tooltip
                      contentStyle={{
                        background: "var(--card)",
                        border: "1px solid var(--border)",
                        borderRadius: "8px",
                        color: "var(--foreground)",
                      }}
                      formatter={(v) => [formatPrice(v), "Sales"]}
                    />
                    <Area
                      type="monotone"
                      dataKey="total"
                      stroke="var(--primary)"
                      strokeWidth={2}
                      fill="url(#sales)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className={styles.panel}>
              <div className={styles.panelTitle}>Order Pipeline</div>
              {stats?.pipeline &&
                Object.entries(stats.pipeline).map(([key, count]) => (
                  <div className={styles.row} key={key}>
                    <div className={styles.rowTop}>
                      <span>{orderStatusMeta[key]?.label || key}</span>
                      <span className={styles.count}>{count}</span>
                    </div>
                    <div className={styles.bar}>
                      <div
                        className={styles.fill}
                        style={{
                          width: `${(count / maxPipeline) * 100}%`,
                          background: pipelineColors[key] || "var(--primary)",
                        }}
                      />
                    </div>
                  </div>
                ))}
            </div>
          </div>

          <div className={styles.grid}>
            <div className={styles.panel}>
              <div className={styles.panelTitle}>
                Recent Orders
                {canAccess(user?.role, "orders") && (
                  <Link className={styles.link} to="/orders">
                    View all
                  </Link>
                )}
              </div>
              {recentOrders.length === 0 ? (
                <EmptyState
                  title="No orders yet"
                  description="Orders will appear here once customers check out."
                />
              ) : (
                <div className={styles.recentList}>
                  {recentOrders.map((o) => (
                    <div className={styles.recentRow} key={o._id}>
                      <div className={styles.customer}>
                        <div className={styles.name}>
                          {o.shippingAddress?.fullName || "Customer"}
                        </div>
                        <div className={styles.meta}>
                          {formatDate(o.createdAt)} · #
                          {(o.orderNumber || o._id).toString().slice(-8)}
                        </div>
                      </div>
                      <div>
                        <Badge color={orderStatusMeta[o.status]?.color || "gray"}>
                          {o.status}
                        </Badge>
                      </div>
                      <div className={styles.amount}>{formatPrice(o.total)}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className={styles.panel}>
              <div className={styles.panelTitle}>
                Low Stock
                {canAccess(user?.role, "inventory") && (
                  <Link className={styles.link} to="/inventory">
                    Manage
                  </Link>
                )}
              </div>
              {!stats?.lowStock?.length ? (
                <EmptyState
                  title="All stocked up"
                  description="No products running low on inventory."
                />
              ) : (
                <div className={styles.lowStockList}>
                  {stats.lowStock.slice(0, 5).map((p) => (
                    <div className={styles.lowRow} key={p._id}>
                      <div className={styles.img}>
                        {p.image && <img src={p.image} alt={p.name} />}
                      </div>
                      <div className={styles.info}>
                        <div className={styles.pname}>{p.name}</div>
                        <div className={styles.cat}>
                          {p.category} · {timeAgo(p.updatedAt)}
                        </div>
                      </div>
                      <div className={styles.stock}>{p.stock} left</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Dashboard;