import React, { useState, useEffect } from "react";
import Navbar from "../../components/Navbar/Navbar";
import LoadingSpinner from "../../components/LoadingSpinner/LoadingSpinner";
import styles from "./Home.module.scss";
import sample from "../../assets/sample.png";
import ProductCard from "../../components/ProductCard/ProductCard";
import Cartlist from "../../components/Cartlist/Cartlist";

const BEST_SELLERS = [
  {
    id: 6,
    name: "Chicken Shawarma",
    description: "Delicious Filipino-style shawarma with garlic sauce",
    image: "./7.png",
    price: 120,
    rating: 4.5,
    quantity: 2,
    tags: ["Street Food", "Davao", "Best Seller"],
  },
  {
    id: 7,
    name: "Beef Shawarma",
    description: "Juicy beef shawarma wrapped in soft pita bread",
    image: "./logo.png",
    price: 140,
    rating: 4.6,
    quantity: 1,
    tags: ["Street Food", "Beef", "Popular"],
  },
  {
    id: 8,
    name: "Pork Shawarma",
    description: "Savory pork shawarma with special creamy sauce",
    image: "https://via.placeholder.com/300",
    price: 130,
    rating: 4.4,
    quantity: 1,
    tags: ["Street Food", "Pork", "Best Seller"],
  },
  {
    id: 9,
    name: "Chicken Kebab Wrap",
    description: "Grilled chicken kebab wrapped with fresh vegetables",
    image: "https://via.placeholder.com/300",
    price: 125,
    rating: 4.3,
    quantity: 1,
    tags: ["Grilled", "Healthy", "Chicken"],
  },
  {
    id: 10,
    name: "Falafel Shawarma",
    description: "Crispy falafel wrap with creamy tahini sauce",
    image: "https://via.placeholder.com/300",
    price: 110,
    rating: 4.2,
    quantity: 1,
    tags: ["Vegetarian", "Healthy", "Street Food"],
  },
];

const Home = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [products, setProducts] = useState(BEST_SELLERS);
  const [cartItems, setCartItems] = useState([
    { ...BEST_SELLERS[0], quantity: 1 },
    { ...BEST_SELLERS[1], quantity: 2 },
    { ...BEST_SELLERS[2], quantity: 2 },
  ]);

  // ⭐ MODAL STATE
  const [selectedProduct, setSelectedProduct] = useState(null);

  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const deliveryFee = 35;
  const total = subtotal + deliveryFee;

  const handleRemove = (id) => {
    setCartItems(cartItems.filter((item) => item.id !== id));
  };

  const clearCart = () => {
    setCartItems([]);
  };

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
      <Navbar cartCount={cartItems.length} />

      <div className={styles.container}>
        <main className={styles.content}>
          <img src={sample} alt="sample" className={styles.sample} />

          <div className={styles.productGrid}>
            {products.map((product) => (
              <ProductCard
                key={product.id}
                name={product.name}
                description={product.description}
                image={product.image}
                price={product.price}
                rating={product.rating}
                quantity={product.quantity}
                tags={product.tags}
                onClick={() => setSelectedProduct(product)} // ⭐ OPEN MODAL
              />
            ))}
          </div>
        </main>

        <div className={styles.cartWrapper}>
          <Cartlist
            cartItems={cartItems}
            subtotal={subtotal}
            deliveryFee={deliveryFee}
            total={total}
            clearProducts={clearCart}
            removeItem={handleRemove}
          />
        </div>
      </div>

      {/* ⭐ FULL SCREEN MODAL */}
      {selectedProduct && (
        <div
          className={styles.modalBackdrop}
          onClick={() => setSelectedProduct(null)}
        >
          <div
            className={styles.modalContent}
            onClick={(e) => e.stopPropagation()}
          >

            <button
              className={styles.closeBtn}
              onClick={() => setSelectedProduct(null)}
            >
              ✕
            </button>

            <div className={styles.modalGrid}>

              <div className={styles.modalImage}>
                <img src={selectedProduct.image} alt={selectedProduct.name} />
              </div>

              <div className={styles.modalInfo}>
                <h2>{selectedProduct.name}</h2>
                <p className={styles.description}>{selectedProduct.description}</p>
                <div className={styles.price}>₱{selectedProduct.price}</div>

                <div className={styles.tags}>
                  {selectedProduct.tags.map((tag, i) => (
                    <span key={i}>{tag}</span>
                  ))}
                </div>

                <button
                  className={styles.addToCartBtn}
                  onClick={() => {
                    setCartItems((prev) => [...prev, selectedProduct]);
                    setSelectedProduct(null);
                  }}
                >
                  Add to Cart
                </button>
              </div>

            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Home;