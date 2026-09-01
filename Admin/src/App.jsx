import React, { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Layout from "./components/Layout/Layout";
import RequireAuth from "./components/RequireAuth";
import Spinner from "./components/ui/Spinner";
import Toast from "./components/ui/Toast";

const Login = lazy(() => import("./pages/Login/Login"));
const Dashboard = lazy(() => import("./pages/Dashboard/Dashboard"));
const Products = lazy(() => import("./pages/Products/Products"));
const ProductEdit = lazy(() => import("./pages/Products/ProductEdit"));
const Orders = lazy(() => import("./pages/Orders/Orders"));
const Inventory = lazy(() => import("./pages/Inventory/Inventory"));
const Customers = lazy(() => import("./pages/Customers/Customers"));
const Settings = lazy(() => import("./pages/Settings/Settings"));

const fallback = (
  <div
    style={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      minHeight: "60vh",
    }}
  >
    <Spinner size="lg" />
  </div>
);

const App = () => {
  return (
    <>
      <BrowserRouter>
        <Suspense fallback={fallback}>
          <Routes>
            <Route path="/login" element={<Login />} />

            <Route element={<RequireAuth />}>
              <Route element={<Layout />}>
                <Route path="/" element={<Dashboard />} />
                <Route path="/products" element={<Products />} />
                <Route path="/products/new" element={<ProductEdit />} />
                <Route path="/products/:id" element={<ProductEdit />} />
                <Route path="/orders" element={<Orders />} />
                <Route path="/inventory" element={<Inventory />} />
                <Route path="/customers" element={<Customers />} />
                <Route path="/settings" element={<Settings />} />
              </Route>
            </Route>

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
      <Toast />
    </>
  );
};

export default App;
