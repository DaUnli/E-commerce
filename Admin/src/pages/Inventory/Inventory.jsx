import React, { useCallback, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import {
  FaBoxOpen,
  FaExclamationTriangle,
  FaCheckCircle,
  FaWarehouse,
  FaPlus,
  FaSync,
} from "react-icons/fa";
import { productApi } from "../../services/api";
import { showToast } from "../../store/toastSlice";
import PageHeader from "../../components/PageHeader/PageHeader";
import Button from "../../components/ui/Button";
import Badge from "../../components/ui/Badge";
import Spinner from "../../components/ui/Spinner";
import Modal from "../../components/ui/Modal";
import EmptyState from "../../components/ui/EmptyState";
import Field from "../../components/ui/Field";
import Input from "../../components/ui/Input";
import { formatPrice } from "../../utils/format";
import styles from "./inventory.module.scss";

const LOW_THRESHOLD = 10;

const Inventory = () => {
  const dispatch = useDispatch();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [adjust, setAdjust] = useState(null);
  const [qty, setQty] = useState(0);
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await productApi.getAll();
      setProducts(data || []);
    } catch (err) {
      dispatch(
        showToast({
          message: err.response?.data?.message || "Failed to load inventory",
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

  const openAdjust = (p) => {
    setAdjust(p);
    setQty(p.stock || 0);
  };

  const saveAdjust = async () => {
    setSaving(true);
    try {
      await productApi.update(adjust._id, { stock: Number(qty) || 0 });
      setProducts((prev) =>
        prev.map((p) => (p._id === adjust._id ? { ...p, stock: Number(qty) || 0 } : p))
      );
      dispatch(showToast({ message: "Stock updated", type: "success" }));
      setAdjust(null);
    } catch (err) {
      dispatch(
        showToast({
          message: err.response?.data?.message || "Failed to update stock",
          type: "error",
        })
      );
    } finally {
      setSaving(false);
    }
  };

  const inStock = products.filter((p) => p.stock > 0).length;
  const lowStock = products.filter((p) => p.stock > 0 && p.stock <= LOW_THRESHOLD).length;
  const outOfStock = products.filter((p) => p.stock <= 0).length;
  const totalValue = products.reduce((s, p) => s + (p.stock || 0) * (p.price || 0), 0);
  const maxStock = Math.max(1, ...products.map((p) => p.stock || 0));

  const barColor = (p) => {
    if (p.stock <= 0) return "var(--destructive)";
    if (p.stock <= LOW_THRESHOLD) return "var(--warning)";
    return "var(--success)";
  };

  return (
    <div className="page">
      <PageHeader title="Inventory" subtitle="Stock levels across your catalog">
        <Button variant="secondary" onClick={load}>
          <FaSync /> Refresh
        </Button>
      </PageHeader>

      <div className={styles.stats}>
        <div className={styles.statCard}>
          <div className={styles.label}>
            In stock <FaCheckCircle className={styles.icon} />
          </div>
          <div className={styles.value}>{inStock}</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.label}>
            Low stock <FaExclamationTriangle className={styles.icon} />
          </div>
          <div className={styles.value} style={{ color: "var(--warning)" }}>
            {lowStock}
          </div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.label}>
            Out of stock <FaBoxOpen className={styles.icon} />
          </div>
          <div className={styles.value} style={{ color: "var(--destructive)" }}>
            {outOfStock}
          </div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.label}>
            Stock value <FaWarehouse className={styles.icon} />
          </div>
          <div className={styles.value}>{formatPrice(totalValue)}</div>
        </div>
      </div>

      {loading ? (
        <div style={{ display: "flex", justifyContent: "center", padding: "4rem" }}>
          <Spinner size="lg" />
        </div>
      ) : products.length === 0 ? (
        <div className="card">
          <EmptyState
            icon={FaBoxOpen}
            title="No products"
            description="Add products to begin managing inventory."
          />
        </div>
      ) : (
        <div className="card">
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Product</th>
                <th>Category</th>
                <th>Stock level</th>
                <th>Status</th>
                <th>Unit value</th>
                <th style={{ textAlign: "right" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p._id}>
                  <td>
                    <div className={styles.productCell}>
                      <div className={styles.thumb}>
                        {p.image && <img src={p.image} alt={p.name} />}
                      </div>
                      <div>
                        <div className={styles.pname}>{p.name}</div>
                        <div className={styles.pcat}>
                          {p.variants?.length ? `${p.variants.length} variants` : "Single unit"}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <Badge color="gray">{p.category || "—"}</Badge>
                  </td>
                  <td>
                    <div className={styles.stockBarWrap}>
                      <div className={styles.stockBar}>
                        <div
                          className={styles.fill}
                          style={{
                            width: `${(Math.min(p.stock, maxStock) / maxStock) * 100}%`,
                            background: barColor(p),
                          }}
                        />
                      </div>
                      <span className={styles.num}>{p.stock}</span>
                    </div>
                  </td>
                  <td>
                    <Badge
                      color={p.stock <= 0 ? "red" : p.stock <= LOW_THRESHOLD ? "amber" : "green"}
                    >
                      {p.stock <= 0
                        ? "Out of stock"
                        : p.stock <= LOW_THRESHOLD
                        ? "Low stock"
                        : "In stock"}
                    </Badge>
                  </td>
                  <td>{formatPrice(p.price)}</td>
                  <td>
                    <div style={{ display: "flex", justifyContent: "flex-end" }}>
                      <Button variant="outline" size="sm" onClick={() => openAdjust(p)}>
                        <FaPlus /> Adjust
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {adjust && (
        <Modal
          title="Adjust stock"
          onClose={() => setAdjust(null)}
          footer={
            <>
              <Button variant="secondary" onClick={() => setAdjust(null)}>
                Cancel
              </Button>
              <Button onClick={saveAdjust} disabled={saving}>
                {saving ? <Spinner size="sm" /> : "Save"}
              </Button>
            </>
          }
        >
          <div style={{ marginBottom: "1rem" }}>
            <strong>{adjust.name}</strong>
            <div className="muted" style={{ fontSize: "0.8125rem", marginTop: "0.25rem" }}>
              Current stock: {adjust.stock}
            </div>
          </div>
          <Field label="New quantity" htmlFor="inv-qty">
            <Input
              id="inv-qty"
              type="number"
              min="0"
              value={qty}
              onChange={(e) => setQty(e.target.value)}
              suffix="units"
            />
          </Field>
        </Modal>
      )}
    </div>
  );
};

export default Inventory;
