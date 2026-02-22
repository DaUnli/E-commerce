import React, { useState } from "react";
import Navbar from "../../components/Navbar/Navbar";
import styles from "./Home.module.scss";
import ProductCard from "../../components/ProductCard/ProductCard";

interface User {
  _id: string;
  fullName: string;
  email?: string;
  role?: string;
}

const Home: React.FC = () => {
  const [userInfo, setUserInfo] = useState<User | null>({
    _id: "1",
    fullName: "John Doe",
    email: "john@example.com",
    role: "user",
  });

  const handleSearchNote = (query: string) => {
    console.log("Searching notes for:", query);
  };

  const handleClearSearch = () => {
    console.log("Clearing search");
  };

  // Sample product
  const sampleProduct = {
    _id: "p1",
    name: "Sample Product",
    price: 99.99,
    category: "Electronics",
    images: [{ public_id: "img1", url: "/cart.png" }],
    ratings: 4.5,
    numOfReviews: 12,
    stock: 5,
  };

  return (
    <div className={styles.main}>
      <Navbar
        userInfo={userInfo}
        onSearchNote={handleSearchNote}
        handleClearSearch={handleClearSearch}
      />

      <div style={{ padding: "20px" }}>
        <h1>Welcome, {userInfo?.fullName || "Guest"}!</h1>
        <p>Email: {userInfo?.email || "Not provided"}</p>
        <p>Role: {userInfo?.role || "Guest"}</p>
      </div>

      {/* Render Product Card */}
      <ProductCard product={sampleProduct} />
    </div>
  );
};

export default Home;