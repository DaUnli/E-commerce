import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import styles from "./SignUp.module.scss";
import api from "../../api/axiosInstance";
import { validateEmail } from "../../api/Helper";
import { strongPassword } from "../../api/Helper";

const SignUp: React.FC = () => {
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");

  const [address, setAddress] = useState({
    street: "",
    city: "",
    zipCode: "",
  });

  const [loading, setLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");

  const navigate = useNavigate();

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

    // ================= VALIDATION =================

    if (
      !name ||
      !email ||
      !password ||
      !confirmPassword ||
      !address.street ||
      !address.city
    ) {
      setErrorMessage("Please fill in all required fields.");
      return;
    }

    if (!validateEmail(email)) {
      setErrorMessage("Please enter a valid email.");
      return;
    }

    if (password.length < 8) {
      setErrorMessage("Password must be at least 8 characters.");
      return;
    }

    if (!strongPassword.test(password)) {
      setErrorMessage(
        "Password must contain at least 1 uppercase letter, 1 number, and 1 special character."
      );
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage("Passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      await api.post("/auth/register", {
        name,
        email,
        password,
        address,
      });

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
        <h2>Create Account</h2>

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

        <input
          type="password"
          placeholder="Confirm Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />

        {/* Live password match indicator */}
        {confirmPassword && password !== confirmPassword && (
          <p>Passwords do not match</p>
        )}

        <div className={styles.addressSection}>
          <input
            type="text"
            placeholder="Street Address"
            value={address.street}
            onChange={(e) =>
              setAddress({ ...address, street: e.target.value })
            }
          />

          <div className={styles.row}>
            <input
              type="text"
              placeholder="City"
              value={address.city}
              onChange={(e) =>
                setAddress({ ...address, city: e.target.value })
              }
            />

            <input
              type="text"
              placeholder="Zip Code"
              value={address.zipCode}
              onChange={(e) =>
                setAddress({ ...address, zipCode: e.target.value })
              }
            />
          </div>
        </div>

        <button type="submit" disabled={loading}>
          {loading ? "Registering..." : "Sign Up"}
        </button>

        {errorMessage && (
          <p style={{ color: "red", marginTop: "10px" }}>
            {errorMessage}
          </p>
        )}

        <span>
          Already have an account? <Link to="/login">Login here</Link>
        </span>
      </form>
    </div>
  );
};

export default SignUp;