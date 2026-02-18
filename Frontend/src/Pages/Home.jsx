import React from "react";
import ProductList from "../components/ProductList";
import Navbar from "../components/Navbar";

const Home = () => {
  // Replace with actual admin check from context or redux
  const isAdmin = false; // true if user.role === "admin"

  return (
    <div className="p-8">
      <Navbar />
      <h1 className="text-2xl font-bold mb-6">Products</h1>
      <ProductList isAdmin={isAdmin} />
    </div>
  );
};

export default Home;
