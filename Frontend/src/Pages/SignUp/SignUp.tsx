import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import styles from "./SignUp.module.scss";  
import axios from "axios";

const SignUp: React.FC = () => {
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");

  const navigate = useNavigate();

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    setLoading(true);

    // ✅ Validation
    if (!name || !email || !password) {
      setErrorMessage("Please fill in all fields.");
      setLoading(false);
      return;
    }

    if (password.length < 8) {
      setErrorMessage("Password must be at least 8 characters.");
      setLoading(false);
      return;
    }

    try {
      // ✅ Send to backend
      await axios.post("http://localhost:5000/api/auth/register", {
        name,
        email,
        password,
      });

      alert("Account created successfully!");
      navigate("/login");

    } catch (error: any) {
      setErrorMessage(
        error.response?.data?.message || "Something went wrong."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.pageWrapper}>
      <form className={styles.formCard} onSubmit={handleSignUp}>
        <h2><strong>Create Account</strong></h2>

        <input
          type="text"
          placeholder="Full Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button type="submit" disabled={loading}>
          {loading ? "Creating Account..." : "Sign Up"}
        </button>

        {errorMessage && (
          <p style={{ color: "red", marginTop: "10px" }}>
            {errorMessage}
          </p>
        )}

        <p style={{ marginTop: "15px" }}>
          Already have an account?{" "}
          <Link to="/login">Login here</Link>
        </p>
      </form>
    </div>
  );
};

export default SignUp;