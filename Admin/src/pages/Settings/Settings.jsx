import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  FaCheck,
  FaUserShield,
  FaStore,
  FaCreditCard,
  FaTruck,
  FaStoreAlt,
  FaCoins,
  FaGlobe,
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
} from "react-icons/fa";
import { showToast } from "../../store/toastSlice";
import { ROLES } from "../../config/roles";
import { useTheme } from "../../hooks";
import PageHeader from "../../components/PageHeader/PageHeader";
import Button from "../../components/ui/Button";
import Badge from "../../components/ui/Badge";
import Field from "../../components/ui/Field";
import Input from "../../components/ui/Input";
import Switch from "../../components/ui/Switch";
import styles from "./settings.module.scss";

const TABS = [
  { key: "general", label: "General", icon: FaStore },
  { key: "roles", label: "Users & Roles", icon: FaUserShield },
  { key: "payments", label: "Payments", icon: FaCreditCard },
  { key: "shipping", label: "Shipping", icon: FaTruck },
];

const loadLocal = (key, fallback) => {
  try {
    return JSON.parse(localStorage.getItem(key)) ?? fallback;
  } catch {
    return fallback;
  }
};
const saveLocal = (key, value) => {
  localStorage.setItem(key, JSON.stringify(value));
};

const Settings = () => {
  const dispatch = useDispatch();
  const user = useSelector((s) => s.auth.user);
  const { theme, toggle } = useTheme();
  const [tab, setTab] = useState("general");

  const [store, setStore] = useState(() =>
    loadLocal("settings_store", {
      name: "7eleven Store",
      currency: "PHP (₱)",
      timezone: "Asia/Manila (GMT+8)",
      email: "support@7eleven.com",
      phone: "+63 2 8888 0000",
      address: "Unit 1, Shopwise Arcade, Cubao, Quezon City",
    })
  );

  const [payments, setPayments] = useState(() =>
    loadLocal("settings_payments", {
      "credit-card": true,
      gcash: true,
      paypal: false,
      cod: true,
      "bank-transfer": false,
    })
  );

  const [shipping, setShipping] = useState(() =>
    loadLocal("settings_shipping", {
      metro: 35,
      provincial: 75,
      freeThreshold: 999,
    })
  );

  const saveStore = () => {
    saveLocal("settings_store", store);
    dispatch(showToast({ message: "Store settings saved", type: "success" }));
  };
  const saveShipping = () => {
    saveLocal("settings_shipping", shipping);
    dispatch(showToast({ message: "Shipping settings saved", type: "success" }));
  };

  const togglePayment = (key) => {
    const next = { ...payments, [key]: !payments[key] };
    setPayments(next);
    saveLocal("settings_payments", next);
    dispatch(showToast({ message: "Payment method updated", type: "success" }));
  };

  const paymentList = [
    { key: "credit-card", label: "Credit / Debit Card", desc: "Card payments online" },
    { key: "gcash", label: "GCash", desc: "Mobile wallet" },
    { key: "paypal", label: "PayPal", desc: "International payments" },
    { key: "cod", label: "Cash on Delivery", desc: "Pay on delivery" },
    { key: "bank-transfer", label: "Bank Transfer", desc: "Manual bank transfer" },
  ];

  return (
    <div className="page">
      <PageHeader title="Settings" subtitle={`Signed in as ${user?.roleLabel || "Admin"}`} />

      <div className={styles.tabs}>
        {TABS.map((t) => {
          const Icon = t.icon;
          return (
            <button
              key={t.key}
              className={`${styles.tab} ${tab === t.key ? styles.active : ""}`}
              onClick={() => setTab(t.key)}
            >
              <Icon style={{ marginRight: "0.375rem" }} />
              {t.label}
            </button>
          );
        })}
      </div>

      <div className={styles.section}>
        {tab === "general" && (
          <>
            <div className={`card ${styles.card}`}>
              <div className={styles.cardTitle}>Store information</div>
              <div className={styles.cardDesc}>
                These details appear on receipts and customer communications.
              </div>
              <div style={{ display: "flex", gap: "1.5rem", alignItems: "center", marginBottom: "1rem" }}>
                <div className={styles.toggleRow} style={{ border: "none", padding: 0, flex: 1 }}>
                  <div className={styles.info}>
                    <div className={styles.title}>Appearance</div>
                    <div className={styles.desc}>Switch between light and dark theme</div>
                  </div>
                  <Switch checked={theme === "dark"} onChange={toggle} label="Dark mode" />
                </div>
              </div>
              <div className={styles.formGrid}>
                <Field label="Store name" htmlFor="s-name">
                  <Input
                    id="s-name"
                    icon={FaStoreAlt}
                    value={store.name}
                    onChange={(e) => setStore({ ...store, name: e.target.value })}
                  />
                </Field>
                <Field label="Currency" htmlFor="s-currency">
                  <Input id="s-currency" icon={FaCoins} value={store.currency} readOnly />
                </Field>
                <Field label="Timezone" htmlFor="s-tz">
                  <Input id="s-tz" icon={FaGlobe} value={store.timezone} readOnly />
                </Field>
                <Field label="Support email" htmlFor="s-email">
                  <Input
                    id="s-email"
                    icon={FaEnvelope}
                    type="email"
                    value={store.email}
                    onChange={(e) => setStore({ ...store, email: e.target.value })}
                  />
                </Field>
                <Field label="Phone" htmlFor="s-phone">
                  <Input
                    id="s-phone"
                    icon={FaPhone}
                    value={store.phone}
                    onChange={(e) => setStore({ ...store, phone: e.target.value })}
                  />
                </Field>
                <Field label="Address" htmlFor="s-address">
                  <Input
                    id="s-address"
                    icon={FaMapMarkerAlt}
                    value={store.address}
                    onChange={(e) => setStore({ ...store, address: e.target.value })}
                  />
                </Field>
              </div>
              <div className={styles.actions}>
                <Button onClick={saveStore}>
                  <FaCheck /> Save changes
                </Button>
              </div>
            </div>
          </>
        )}

        {tab === "roles" && (
          <div className={`card ${styles.card}`}>
            <div className={styles.cardTitle}>Account & role</div>
            <div className={styles.cardDesc}>
              Your access level comes from the backend account you signed in with
              and cannot be changed here.
            </div>
            <div className={styles.roleRow}>
              <div className={styles.roleInfo}>
                <Badge color={ROLES[user?.role]?.color || "gray"}>
                  {user?.roleLabel || user?.role}
                </Badge>
                <div>
                  <div className={styles.roleName}>{user?.name}</div>
                  <div className={styles.perms}>{user?.email}</div>
                </div>
              </div>
            </div>
            <div className={styles.roleRow}>
              <div className={styles.roleInfo}>
                <div>
                  <div className={styles.roleName}>Permissions</div>
                  <div className={styles.perms}>
                    {user?.role === "admin"
                      ? "Full access to all modules"
                      : "Dashboard access"}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {tab === "payments" && (
          <div className={`card ${styles.card}`}>
            <div className={styles.cardTitle}>Payment methods</div>
            <div className={styles.cardDesc}>
              Enable or disable the payment options customers can use at checkout.
            </div>
            {paymentList.map((p) => (
              <div className={styles.toggleRow} key={p.key}>
                <div className={styles.info}>
                  <div className={styles.title}>{p.label}</div>
                  <div className={styles.desc}>{p.desc}</div>
                </div>
                <Switch
                  checked={!!payments[p.key]}
                  onChange={() => togglePayment(p.key)}
                  label={p.label}
                />
              </div>
            ))}
          </div>
        )}

        {tab === "shipping" && (
          <div className={`card ${styles.card}`}>
            <div className={styles.cardTitle}>Shipping rates</div>
            <div className={styles.cardDesc}>
              Delivery fees applied at checkout based on destination.
            </div>
            <div className={styles.formGrid}>
              <Field label="Metro Manila" htmlFor="ship-metro">
                <Input
                  id="ship-metro"
                  type="number"
                  prefix="₱"
                  value={shipping.metro}
                  onChange={(e) => setShipping({ ...shipping, metro: Number(e.target.value) })}
                />
              </Field>
              <Field label="Provincial" htmlFor="ship-prov">
                <Input
                  id="ship-prov"
                  type="number"
                  prefix="₱"
                  value={shipping.provincial}
                  onChange={(e) => setShipping({ ...shipping, provincial: Number(e.target.value) })}
                />
              </Field>
              <Field label="Free shipping threshold" htmlFor="ship-free">
                <Input
                  id="ship-free"
                  type="number"
                  prefix="₱"
                  value={shipping.freeThreshold}
                  onChange={(e) => setShipping({ ...shipping, freeThreshold: Number(e.target.value) })}
                />
              </Field>
            </div>
            <div className={styles.actions}>
              <Button onClick={saveShipping}>
                <FaCheck /> Save shipping
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Settings;
