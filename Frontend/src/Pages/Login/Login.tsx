import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import styles from "./Login.module.scss";
import axios from "../../api/axiosInstance";
import { validateEmail } from "../../api/Helper";

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (!email || !password) {
      setErrorMessage("Please fill in all fields.");
      setLoading(false);
      return;
    }

    if (!validateEmail(email)) {
      setErrorMessage("Please enter a valid email");
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post("/auth/login", {
        email,
        password,
      });

      const user = response.data.user;

      // Save role (optional)
      localStorage.setItem("role", user.role);

      // 🔥 Role-based redirect
      if (user.role === "admin") {
        navigate("/admin");
      } else {
        navigate("/home");
      }
    } catch (error: any) {
      setErrorMessage(error.response?.data?.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.pageWrapper}>
      <form className={styles.formCard} onSubmit={handleLogin}>
        <h2>
          <strong>Login</strong>
        </h2>

        <input
          type="email"
          placeholder="Email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button type="submit" disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </button>
        {errorMessage && (
          <p style={{ color: "red", marginTop: "10px" }}>{errorMessage}</p>
        )}
        <p style={{ marginTop: "15px" }}>
          Don't have an account? <Link to="/signup">Register here</Link>
        </p>
      </form>
    </div>
  );
};

export default LoginPage;
