import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";
import Navbar from "./components/Navbar/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";

// User Pages
import Home from "./pages/user/Home/Home";
import Login from "./pages/user/Login/Login";
import Register from "./pages/user/Register/Register";
import ProductDetails from "./pages/user/ProductDetails/ProductDetails";
import Cart from "./pages/user/Cart/Cart";
import Checkout from "./pages/user/Checkout/Checkout";
import Orders from "./pages/user/Orders/Orders";

// Admin Pages
import AdminDashboard from "./pages/admin/AdminDashboard/AdminDashboard";
import ProductManagement from "./pages/admin/ProductManagement/ProductManagement";
import OrderManagement from "./pages/admin/OrderManagement/OrderManagement";

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <Navbar />

          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/product/:id" element={<ProductDetails />} />
            <Route path="/cart" element={<Cart />} />

            {/* Protected User Routes */}
            <Route
              path="/checkout"
              element={
                <ProtectedRoute>
                  <Checkout />
                </ProtectedRoute>
              }
            />
            <Route
              path="/orders"
              element={
                <ProtectedRoute>
                  <Orders />
                </ProtectedRoute>
              }
            />

            {/* Admin Routes */}
            <Route
              path="/admin"
              element={
                <ProtectedRoute adminOnly={true}>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/products"
              element={
                <ProtectedRoute adminOnly={true}>
                  <ProductManagement />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/orders"
              element={
                <ProtectedRoute adminOnly={true}>
                  <OrderManagement />
                </ProtectedRoute>
              }
            />

            {/* 404 Page */}
            <Route path="*" element={<h1>404 Not Found</h1>} />
          </Routes>
        </Router>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;