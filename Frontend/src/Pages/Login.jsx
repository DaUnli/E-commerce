import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AOS from "aos";
import "aos/dist/aos.css";

const Login = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async () => {
    setLoading(true);
    setMessage("");
    const url = isLogin
      ? "http://localhost:5000/api/login"
      : "http://localhost:5000/api/register";

    try {
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ name, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setMessage(data.message || "Something went wrong");
        setLoading(false);
        return;
      }

      if (isLogin) {
        setMessage("✅ Login successful!");
        setTimeout(() => navigate("/home"), 500);
      } else {
        setMessage("✅ Registration successful, please login");
        setIsLogin(true);
      }

      setName("");
      setPassword("");
    } catch {
      setMessage("❌ Server error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gradient-to-br from-gray-900 via-indigo-900 to-purple-900 min-h-screen flex flex-col items-center justify-center px-4 font-sans">
      <div className="bg-gray-800 bg-opacity-90 rounded-2xl shadow-2xl p-8 w-full max-w-sm" data-aos="fade-down">
        <h1 className="text-3xl font-bold text-center text-white mb-6">
          {isLogin ? "Login" : "Register"}
        </h1>

        <div className="flex flex-col gap-4">
          <input
            type="text"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-4 py-3 rounded-xl bg-gray-700 text-white placeholder-gray-300 border border-gray-600 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 outline-none transition"
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-3 rounded-xl bg-gray-700 text-white placeholder-gray-300 border border-gray-600 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 outline-none transition"
          />

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="mt-4 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-xl shadow-lg transform hover:scale-105 transition-transform disabled:opacity-50"
          >
            {loading ? (isLogin ? "Logging in..." : "Registering...") : isLogin ? "Login" : "Register"}
          </button>
        </div>

        <button
          onClick={() => setIsLogin(!isLogin)}
          className="mt-6 text-indigo-400 hover:text-indigo-300 underline text-sm w-full text-center"
        >
          {isLogin ? "Don't have an account? Register" : "Already have an account? Login"}
        </button>

        {message && <p className="mt-4 text-center text-sm text-red-400">{message}</p>}
      </div>
    </div>
  );
};

export default Login;
