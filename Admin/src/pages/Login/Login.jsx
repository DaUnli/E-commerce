import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { FaStore, FaSun, FaMoon, FaEnvelope, FaLock } from "react-icons/fa";
import { login } from "../../store/authSlice";
import Button from "../../components/ui/Button";
import Spinner from "../../components/ui/Spinner";
import Field from "../../components/ui/Field";
import Input from "../../components/ui/Input";
import { useTheme } from "../../hooks";
import styles from "./login.module.scss";

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { status, error } = useSelector((state) => state.auth);
  const { theme, toggle } = useTheme();

  const [email, setEmail] = useState("admin@7eleven.com");
  const [password, setPassword] = useState("admin123456");

  const submit = async (e) => {
    e.preventDefault();
    const result = await dispatch(login({ email, password }));
    if (login.fulfilled.match(result)) {
      navigate("/");
    }
  };

  return (
    <div className={styles.login}>
      <div className={styles.brandPanel}>
        <div className={styles.brand}>
          <div className={styles.logo}>
            <FaStore />
          </div>
          7eleven Admin
        </div>
        <div className={styles.content}>
          <h1>
            Manage your store,
            <br />
            one dashboard.
          </h1>
          <p>
            Products, orders, inventory, customers and analytics — everything in
            one place.
          </p>
        </div>
        <div className={styles.stats}>
          <div className={styles.stat}>
            <div className={styles.value}>20+</div>
            <div className={styles.label}>Products</div>
          </div>
          <div className={styles.stat}>
            <div className={styles.value}>24/7</div>
            <div className={styles.label}>Monitoring</div>
          </div>
          <div className={styles.stat}>
            <div className={styles.value}>100%</div>
            <div className={styles.label}>Control</div>
          </div>
        </div>
      </div>

      <button className={styles.themeToggle} onClick={toggle} title="Toggle theme">
        {theme === "light" ? <FaMoon /> : <FaSun />}
      </button>

      <div className={styles.formPanel}>
        <div className={styles.card}>
          <h2 className={styles.title}>Welcome back</h2>
          <p className={styles.subtitle}>Sign in to your admin dashboard</p>

          {error && <div className={styles.error}>{error}</div>}

          <form onSubmit={submit}>
            <Field label="Email" required htmlFor="login-email">
              <Input
                id="login-email"
                type="email"
                icon={FaEnvelope}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </Field>

            <Field label="Password" required htmlFor="login-password">
              <Input
                id="login-password"
                type="password"
                icon={FaLock}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </Field>

            <Button type="submit" block size="lg" disabled={status === "loading"}>
              {status === "loading" ? <Spinner size="sm" /> : "Sign in"}
            </Button>
          </form>

          <div className={styles.hint}>
            Admin account: <code>admin@7eleven.com</code> / <code>admin123456</code>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
