import React, { useCallback, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { Link, useSearchParams } from "react-router-dom";
import { FaPlus, FaEdit, FaTrash, FaSearch, FaBoxOpen } from "react-icons/fa";
import { productApi } from "../../services/api";
import { showToast } from "../../store/toastSlice";
import PageHeader from "../../components/PageHeader/PageHeader";
import Button from "../../components/ui/Button";
import Badge from "../../components/ui/Badge";
import Spinner from "../../components/ui/Spinner";
import Modal from "../../components/ui/Modal";
import EmptyState from "../../components/ui/EmptyState";
import Input from "../../components/ui/Input";
import Select from "../../components/ui/Select";
import { formatPrice } from "../../utils/format";
import styles from "./products.module.scss";

const CATEGORIES = [
  "all",
  "Snacks",
  "Beverages",
  "Instant Noodles",
  "Canned Goods",
  "Personal Care",
  "Household",
];

const sortOptions = [
  { value: "newest", label: "Newest" },
  { value: "name", label: "Name A—Z" },
  { value: "priceHigh", label: "Price: High→Low" },
  { value: "priceLow", label: "Price: Low→High" },
  { value: "stockLow", label: "Stock: Low→High" },
];

const Products = () => {
  const dispatch = useDispatch();
  const [searchParams, setSearchParams] = useSearchParams();
  const q = searchParams.get("q") || "";
  const [all, setAll] = useState([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState("all");
  const [sort, setSort] = useState("newest");
  const [toDelete, setToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await productApi.getAll();
      setAll(data || []);
    } catch (err) {
      dispatch(
        showToast({
          message: err.response?.data?.message || "Failed to load products",
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

  const filtered = all
    .filter((p) => {
      const matchQ = q
        ? p.name.toLowerCase().includes(q.toLowerCase()) ||
          p.description?.toLowerCase().includes(q.toLowerCase()) ||
          (p.category || "").toLowerCase().includes(q.toLowerCase())
        : true;
      const matchCat = category === "all" || p.category === category;
      return matchQ && matchCat;
    })
    .sort((a, b) => {
      switch (sort) {
        case "name":
          return a.name.localeCompare(b.name);
        case "priceHigh":
          return (b.price || 0) - (a.price || 0);
        case "priceLow":
          return (a.price || 0) - (b.price || 0);
        case "stockLow":
          return (a.stock || 0) - (b.stock || 0);
        default:
          return new Date(b.createdAt) - new Date(a.createdAt);
      }
    });

  const remove = async () => {
    setDeleting(true);
    try {
      await productApi.remove(toDelete._id);
      setAll((p) => p.filter((x) => x._id !== toDelete._id));
      dispatch(showToast({ message: "Product deleted", type: "success" }));
      setToDelete(null);
    } catch (err) {
      dispatch(
        showToast({
          message: err.response?.data?.message || "Failed to delete",
          type: "error",
        })
      );
    } finally {
      setDeleting(false);
    }
  };

  const margin = (p) => {
    if (!p.cost) return null;
    return ((p.price - p.cost) / p.price) * 100;
  };

  return (
    <div className="page">
      <PageHeader title="Products" subtitle={`${all.length} products total`}>
        <Link to="/products/new">
          <Button>
            <FaPlus /> Add Product
          </Button>
        </Link>
      </PageHeader>

      <div className={styles.toolbar}>
        <div className={styles.searchWrap}>
          <Input
            size="sm"
            icon={FaSearch}
            placeholder="Search products…"
            value={q}
            onChange={(e) =>
              setSearchParams(e.target.value ? { q: e.target.value } : {})
            }
          />
        </div>
        <Select
          size="sm"
          style={{ width: 160 }}
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>
              {c === "all" ? "All categories" : c}
            </option>
          ))}
        </Select>
        <Select
          size="sm"
          style={{ width: 160 }}
          value={sort}
          onChange={(e) => setSort(e.target.value)}
        >
          {sortOptions.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </Select>
      </div>

      {loading ? (
        <div style={{ display: "flex", justifyContent: "center", padding: "4rem" }}>
          <Spinner size="lg" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="card">
          <EmptyState
            icon={FaBoxOpen}
            title="No products found"
            description="Try a different search or add a new product."
            action={
              <Link to="/products/new">
                <Button>
                  <FaPlus /> Add Product
                </Button>
              </Link>
            }
          />
        </div>
      ) : (
        <div className="card">
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Product</th>
                <th>Category</th>
                <th>Price</th>
                <th>Cost</th>
                <th>Margin</th>
                <th>Stock</th>
                <th>Status</th>
                <th style={{ textAlign: "right" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((p) => {
                const m = margin(p);
                return (
                  <tr key={p._id}>
                    <td>
                      <div className={styles.productCell}>
                        <div className={styles.thumb}>
                          {p.image && <img src={p.image} alt={p.name} />}
                        </div>
                        <div>
                          <div className={styles.pname}>{p.name}</div>
                          <div className={styles.pcategory}>
                            SKU {p._id?.toString().slice(-6)}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <Badge color="gray">{p.category || "—"}</Badge>
                    </td>
                    <td>
                      {p.salePrice ? (
                        <>
                          <span style={{ color: "var(--destructive)" }}>
                            {formatPrice(p.salePrice)}
                          </span>{" "}
                          <s className="muted">{formatPrice(p.price)}</s>
                        </>
                      ) : (
                        formatPrice(p.price)
                      )}
                    </td>
                    <td className="muted">{formatPrice(p.cost)}</td>
                    <td>
                      {m == null ? (
                        <span className="muted">—</span>
                      ) : (
                        <span style={{ color: m > 0 ? "var(--success)" : "var(--destructive)" }}>
                          {m.toFixed(0)}%
                        </span>
                      )}
                    </td>
                    <td>
                      <span
                        className={`${styles.stock} ${
                          p.stock <= 10 ? styles.low : styles.ok
                        }`}
                      >
                        {p.stock} {p.stock <= 10 && "⚠"}
                      </span>
                    </td>
                    <td>
                      <Badge color={p.stock <= 0 ? "red" : "green"}>
                        {p.stock <= 0 ? "Out of stock" : "In stock"}
                      </Badge>
                    </td>
                    <td>
                      <div className={styles.actions} style={{ justifyContent: "flex-end" }}>
                        <Link to={`/products/${p._id}`}>
                          <Button variant="outline" size="sm">
                            <FaEdit />
                          </Button>
                        </Link>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => setToDelete(p)}
                        >
                          <FaTrash />
                        </Button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {toDelete && (
        <Modal
          title="Delete product"
          onClose={() => setToDelete(null)}
          footer={
            <>
              <Button variant="secondary" onClick={() => setToDelete(null)}>
                Cancel
              </Button>
              <Button variant="destructive" onClick={remove} disabled={deleting}>
                {deleting ? <Spinner size="sm" /> : "Delete"}
              </Button>
            </>
          }
        >
          <p className="muted" style={{ fontSize: "0.875rem" }}>
            Are you sure you want to delete{" "}
            <strong style={{ color: "var(--foreground)" }}>{toDelete.name}</strong>?
            This action cannot be undone.
          </p>
        </Modal>
      )}
    </div>
  );
};

export default Products;
