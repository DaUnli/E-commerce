import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import styles from "./Login.module.scss";
import { login } from "../../store/authSlice";
import { showToast } from "../../store/toastSlice";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const result = await dispatch(login({ email, password }));
    if (login.fulfilled.match(result)) {
      dispatch(showToast({ message: "Welcome back!", type: "success" }));
      navigate("/home");
    } else {
      setError(result.payload || "Invalid email or password");
    }
    setLoading(false);
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h2>Welcome Back</h2>
        <p className={styles.subtitle}>Sign in to continue</p>

        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.field}>
            <label>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
            />
          </div>

          <div className={styles.field}>
            <label>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
            />
          </div>

          {error && <p className={styles.error}>{error}</p>}

          <button type="submit" className={styles.submitBtn} disabled={loading}>
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <p className={styles.hint}>
          Demo: <strong>Jamess@hemom.com</strong> / <strong>12345678</strong>
        </p>

        <div className={styles.footer}>
          Don't have an account?
          <Link to="/register">Register</Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
