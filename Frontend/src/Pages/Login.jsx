import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AOS from "aos";
import "aos/dist/aos.css";

// Helper function for email validation
const validateEmail = (email) => {
  return String(email)
    .toLowerCase()
    .match(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/);
};

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState(""); // Only for Register
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    AOS.init({ duration: 1000 });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    // 1. Basic Validation
    if (!validateEmail(email)) {
      setMessage("❌ Please enter a valid email");
      setLoading(false);
      return;
    }

    if (!isLogin && name.length < 2) {
      setMessage("❌ Name must be at least 2 characters");
      setLoading(false);
      return;
    }

    // 2. Setup URL and Payload
    const url = isLogin
      ? "http://localhost:5000/api/auth/login"
      : "http://localhost:5000/api/auth/register";

    const payload = isLogin 
      ? { email, password } 
      : { name, email, password };

    try {
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include", // Crucial for receiving cookies
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        setMessage(`❌ ${data.message || "Something went wrong"}`);
        setLoading(false);
        return;
      }

      if (isLogin) {
        setMessage("✅ Login successful!");
        // Store user info in local storage if needed
        localStorage.setItem("user", JSON.stringify(data.user));
        setTimeout(() => navigate("/home"), 1000);
      } else {
        setMessage("✅ Registration successful! Redirecting to login...");
        setTimeout(() => {
          setIsLogin(true);
          setMessage("");
        }, 2000);
      }
    } catch (error) {
      setMessage("❌ Cannot connect to server");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gradient-to-br from-gray-900 via-indigo-900 to-purple-900 min-h-screen flex flex-col items-center justify-center px-4 font-sans">
      <div
        className="bg-gray-800 bg-opacity-90 rounded-2xl shadow-2xl p-8 w-full max-w-sm"
        data-aos="fade-down"
      >
        <h1 className="text-3xl font-bold text-center text-white mb-6">
          {isLogin ? "Welcome Back" : "Create Account"}
        </h1>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {/* SHOW NAME FIELD ONLY DURING REGISTRATION */}
          {!isLogin && (
            <input
              type="text"
              placeholder="Full Name"
              value={name}
              required
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-gray-700 text-white placeholder-gray-300 border border-gray-600 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 outline-none transition"
            />
          )}

          <input
            type="email"
            placeholder="Email Address"
            value={email}
            required
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-3 rounded-xl bg-gray-700 text-white placeholder-gray-300 border border-gray-600 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 outline-none transition"
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            required
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-3 rounded-xl bg-gray-700 text-white placeholder-gray-300 border border-gray-600 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 outline-none transition"
          />

          <button
            type="submit"
            disabled={loading}
            className="mt-4 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-xl shadow-lg transform hover:scale-105 transition-transform disabled:opacity-50"
          >
            {loading ? "Processing..." : isLogin ? "Login" : "Register"}
          </button>
        </form>

        <button
          onClick={() => {
            setIsLogin(!isLogin);
            setMessage(""); // Clear messages when switching
          }}
          className="mt-6 text-indigo-400 hover:text-indigo-300 underline text-sm w-full text-center"
        >
          {isLogin
            ? "Don't have an account? Register"
            : "Already have an account? Login"}
        </button>

        {message && (
          <p className={`mt-4 text-center text-sm font-medium ${message.includes('✅') ? 'text-green-400' : 'text-red-400'}`}>
            {message}
          </p>
        )}
      </div>
    </div>
  );
};

export default AuthPage;