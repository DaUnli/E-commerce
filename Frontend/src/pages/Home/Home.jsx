import React, { useState, useEffect } from "react"; // Capitalized React & added useEffect
import Navbar from "../../components/Navbar/Navbar";
import LoadingSpinner from "../../components/LoadingSpinner/LoadingSpinner"; // Import your spinner
import styles from "./Home.module.scss";
import sample from "../../assets/sample.png"
import Cheackout from "../Cheackout/Cheackout";
import ProductCard from "../../components/ProductCard/ProductCard";
import Cartlist from "../../components/Cartlist/Cartlist";

const READY_TO_EAT = [
  { id: 1, name: "Spicy Basil Chicken with Rice", price: 65, tag: "Best Seller", image: "https://placehold.co/150x150/f8f9fa/008061?text=Chicken+Rice" },
  { id: 2, name: "Ham Cheese Sandwich", price: 45, image: "https://placehold.co/150x150/f8f9fa/008061?text=Sandwich" },
  { id: 3, name: "Tuna Mayo Onigiri", price: 35, image: "https://placehold.co/150x150/f8f9fa/008061?text=Onigiri" },
  { id: 4, name: "Minced Pork Cup Noodles", price: 25, image: "https://placehold.co/150x150/f8f9fa/008061?text=Noodles" },
];

const Home = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [cartItems, setCartItems] = useState([
    { ...READY_TO_EAT[0], quantity: 1 },
    { ...READY_TO_EAT[1], quantity: 2 },
    { ...READY_TO_EAT[2], quantity: 2 },
  ]);

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const deliveryFee = 35;
  const total = subtotal + deliveryFee;

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return <LoadingSpinner fullScreen={true} size="large" />;
  }

  return (
    <>
      <Navbar />
      <div className={styles.container}>

        <main className={styles.content}>
          <img src={sample} alt="sample" className={styles.sample} />
          <ProductCard
            name="Chicken Shawarma"
            description="Delicious Filipino-style shawarma with garlic sauce"
            image="https://via.placeholder.com/300"
            price={120}
            rating={4}
            quantity={15}
            tags={["Street Food", "Davao", "Best Seller"]}
            onDelete={() => console.log("Deleted")}
          />
        </main>
        <div className={styles.product}>
          <Cartlist cartItems={cartItems} subtotal={subtotal} deliveryFee={deliveryFee} total={total} />
        </div>
      </div>
    </>
  );
};

export default Home;