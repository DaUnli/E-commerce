import React, { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import {
  FaArrowLeft,
  FaPlus,
  FaTrash,
  FaTag,
  FaImage,
  FaBoxes,
  FaCoins,
  FaTags,
  FaListAlt,
} from "react-icons/fa";
import { productApi } from "../../services/api";
import { showToast } from "../../store/toastSlice";
import PageHeader from "../../components/PageHeader/PageHeader";
import Button from "../../components/ui/Button";
import Spinner from "../../components/ui/Spinner";
import Field from "../../components/ui/Field";
import Input from "../../components/ui/Input";
import Select from "../../components/ui/Select";
import Textarea from "../../components/ui/Textarea";
import styles from "./products.module.scss";

const CATEGORIES = [
  "Snacks",
  "Beverages",
  "Instant Noodles",
  "Canned Goods",
  "Personal Care",
  "Household",
];

const emptyVariant = { name: "", options: [], price: "", stock: "" };

const ProductEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const isEdit = Boolean(id);
  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    name: "",
    category: "Snacks",
    description: "",
    price: "",
    cost: "",
    salePrice: "",
    image: "",
    stock: "",
    rating: "",
    tags: "",
    variants: [],
  });
  const [optionInputs, setOptionInputs] = useState({});
  const [errors, setErrors] = useState({});
  const fileRef = useRef(null);

  useEffect(() => {
    if (!isEdit) return;
    (async () => {
      try {
        const { data } = await productApi.getById(id);
        setForm({
          name: data.name,
          category: data.category,
          description: data.description,
          price: data.price,
          cost: data.cost,
          salePrice: data.salePrice ?? "",
          image: data.image,
          stock: data.stock,
          rating: data.rating,
          tags: (data.tags || []).join(", "),
          variants: data.variants || [],
        });
      } catch (err) {
        dispatch(
          showToast({
            message: err.response?.data?.message || "Product not found",
            type: "error",
          })
        );
      } finally {
        setLoading(false);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const onFile = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => set("image", reader.result);
    reader.readAsDataURL(file);
    e.target.value = "";
  };

  const addVariant = () => {
    set("variants", [...form.variants, { ...emptyVariant }]);
  };
  const removeVariant = (i) =>
    set("variants", form.variants.filter((_, idx) => idx !== i));
  const variantSet = (i, k, v) =>
    set(
      "variants",
      form.variants.map((item, idx) => (idx === i ? { ...item, [k]: v } : item))
    );

  const onOptionsKeyDown = (e, i) => {
    if (e.key === "Enter" && e.target.value.trim()) {
      e.preventDefault();
      const val = e.target.value.trim();
      const existing = form.variants[i]?.options || [];
      const next = [...existing, val];
      variantSet(i, "options", next);
      setOptionInputs((o) => ({ ...o, [i]: "" }));
    }
  };

  const submit = async (e) => {
    e.preventDefault();
    const nextErrors = {};
    if (!form.name.trim()) nextErrors.name = "Product name is required";
    if (form.price === "" || Number(form.price) <= 0) nextErrors.price = "Enter a valid price";
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) {
      dispatch(showToast({ message: "Please fix the highlighted fields", type: "error" }));
      return;
    }
    setSaving(true);
    const payload = {
      name: form.name,
      category: form.category,
      description: form.description,
      price: Number(form.price),
      cost: Number(form.cost) || 0,
      salePrice: form.salePrice ? Number(form.salePrice) : null,
      image: form.image,
      stock: Number(form.stock) || 0,
      rating: Number(form.rating) || 0,
      tags: form.tags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
      variants: form.variants.map((v) => ({
        name: v.name,
        options: v.options || [],
        price: Number(v.price) || 0,
        stock: Number(v.stock) || 0,
      })),
    };
    try {
      if (isEdit) {
        await productApi.update(id, payload);
        dispatch(showToast({ message: "Product updated", type: "success" }));
      } else {
        await productApi.create(payload);
        dispatch(showToast({ message: "Product created", type: "success" }));
      }
      navigate("/products");
    } catch (err) {
      dispatch(
        showToast({
          message: err.response?.data?.message || "Failed to save product",
          type: "error",
        })
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", padding: "4rem" }}>
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="page">
      <PageHeader
        title={isEdit ? "Edit product" : "Add product"}
        subtitle={isEdit ? "Update product details" : "Create a new product"}
      >
        <Button variant="secondary" onClick={() => navigate("/products")}>
          <FaArrowLeft /> Back
        </Button>
      </PageHeader>

      <form onSubmit={submit}>
        <div className="card" style={{ padding: "1.25rem" }}>
          <div className={styles.formGrid}>
            <Field label="Product name" required htmlFor="p-name" error={errors.name}>
              <Input
                id="p-name"
                icon={FaTag}
                value={form.name}
                onChange={(e) => {
                  set("name", e.target.value);
                  if (errors.name) setErrors((er) => ({ ...er, name: "" }));
                }}
                error={!!errors.name}
                placeholder="e.g. Lucky Me Pancit Canton"
                required
              />
            </Field>

            <Field label="Category" htmlFor="p-category">
              <Select
                id="p-category"
                icon={FaListAlt}
                value={form.category}
                onChange={(e) => set("category", e.target.value)}
              >
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </Select>
            </Field>

            <Field label="Description" htmlFor="p-desc" className={styles.full}>
              <Textarea
                id="p-desc"
                rows={3}
                value={form.description}
                onChange={(e) => set("description", e.target.value)}
                placeholder="Short product description…"
              />
            </Field>

            <Field label="Price" required htmlFor="p-price" error={errors.price}>
              <Input
                id="p-price"
                type="number"
                prefix="₱"
                icon={FaCoins}
                min="0"
                step="0.01"
                value={form.price}
                onChange={(e) => {
                  set("price", e.target.value);
                  if (errors.price) setErrors((er) => ({ ...er, price: "" }));
                }}
                error={!!errors.price}
                placeholder="0.00"
                required
              />
            </Field>

            <Field label="Cost" optional="for margin" htmlFor="p-cost">
              <Input
                id="p-cost"
                type="number"
                prefix="₱"
                min="0"
                step="0.01"
                value={form.cost}
                onChange={(e) => set("cost", e.target.value)}
                placeholder="0.00"
              />
            </Field>

            <Field label="Sale price" htmlFor="p-sale">
              <Input
                id="p-sale"
                type="number"
                prefix="₱"
                min="0"
                step="0.01"
                value={form.salePrice}
                onChange={(e) => set("salePrice", e.target.value)}
                placeholder="Optional"
              />
            </Field>

            <Field label="Stock" htmlFor="p-stock">
              <Input
                id="p-stock"
                type="number"
                icon={FaBoxes}
                min="0"
                value={form.stock}
                onChange={(e) => set("stock", e.target.value)}
                placeholder="0"
              />
            </Field>

            <Field className={styles.full} label="Image URL" hint="Paste a link or upload an image" htmlFor="p-image">
              <Input
                id="p-image"
                icon={FaImage}
                value={form.image}
                onChange={(e) => set("image", e.target.value)}
                placeholder="https://…"
              />
              <div className={styles.thumbInput} style={{ marginTop: "0.5rem" }}>
                {form.image && (
                  <div className={styles.preview}>
                    <img src={form.image} alt="preview" />
                  </div>
                )}
                <Button type="button" variant="secondary" size="sm" onClick={() => fileRef.current?.click()}>
                  Upload image
                </Button>
                <input
                  ref={fileRef}
                  type="file"
                  accept="image/*"
                  style={{ display: "none" }}
                  onChange={onFile}
                />
              </div>
            </Field>

            <Field className={styles.full} label="Tags" hint="Comma separated, e.g. new, bestseller" htmlFor="p-tags">
              <Input
                id="p-tags"
                icon={FaTags}
                value={form.tags}
                onChange={(e) => set("tags", e.target.value)}
                placeholder="tropical, condiments, bestseller"
              />
            </Field>
          </div>
        </div>

        <div className="card" style={{ padding: "1.25rem", marginTop: "1rem" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
            <div>
              <h3 style={{ fontSize: "0.9375rem", fontWeight: 600 }}>Variants</h3>
              <p className="muted" style={{ fontSize: "0.8125rem" }}>
                e.g. Size, Color — each option counts toward stock.
              </p>
            </div>
            <Button type="button" variant="secondary" size="sm" onClick={addVariant}>
              <FaPlus /> Add variant
            </Button>
          </div>

          {form.variants.length === 0 ? (
            <p className="muted" style={{ fontSize: "0.875rem" }}>
              No variants. This product is sold as a single unit.
            </p>
          ) : (
            <div className={styles.variantList}>
              {form.variants.map((v, i) => (
                <div className={styles.variant} key={i}>
                  <Input
                    size="sm"
                    placeholder="Variant name (e.g. Size)"
                    value={v.name}
                    onChange={(e) => variantSet(i, "name", e.target.value)}
                  />
                  <Input
                    size="sm"
                    placeholder="Options (type + Enter)"
                    value={optionInputs[i] || ""}
                    onChange={(e) => setOptionInputs((o) => ({ ...o, [i]: e.target.value }))}
                    onKeyDown={(e) => onOptionsKeyDown(e, i)}
                  />
                  <Input
                    size="sm"
                    type="number"
                    placeholder="Stock"
                    value={v.stock}
                    onChange={(e) => variantSet(i, "stock", e.target.value)}
                  />
                  <Button type="button" variant="ghost" size="sm" onClick={() => removeVariant(i)}>
                    <FaTrash />
                  </Button>
                  {v.options.length > 0 && (
                    <div style={{ gridColumn: "1 / -1", display: "flex", gap: "0.375rem", flexWrap: "wrap" }}>
                      {v.options.map((opt, oi) => (
                        <BadgeLocal
                          key={oi}
                          text={opt}
                          onRemove={() =>
                            variantSet(i, "options", v.options.filter((_, x) => x !== oi))
                          }
                        />
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        <div style={{ display: "flex", gap: "0.625rem", justifyContent: "flex-end", marginTop: "1rem" }}>
          <Button variant="secondary" onClick={() => navigate("/products")}>
            Cancel
          </Button>
          <Button type="submit" disabled={saving}>
            {saving ? <Spinner size="sm" /> : isEdit ? "Save changes" : "Create product"}
          </Button>
        </div>
      </form>
    </div>
  );
};

const BadgeLocal = ({ text, onRemove }) => (
  <span
    style={{
      display: "inline-flex",
      alignItems: "center",
      gap: "0.375rem",
      background: "var(--muted)",
      padding: "0.25rem 0.625rem",
      borderRadius: 999,
      fontSize: "0.75rem",
      fontWeight: 500,
    }}
  >
    {text}
    <button type="button" onClick={onRemove} style={{ background: "none", border: "none", color: "var(--muted-foreground)", cursor: "pointer" }}>
      ×
    </button>
  </span>
);

export default ProductEdit;
