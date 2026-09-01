import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar/Navbar";
import LoadingSpinner from "../../components/LoadingSpinner/LoadingSpinner";
import styles from "./Home.module.scss";
import sample from "../../assets/sample.png";
import ProductCard from "../../components/ProductCard/ProductCard";
import Cartlist from "../../components/Cartlist/Cartlist";
import Toast from "../../components/Toast/Toast";
import {
  fetchProducts,
  selectVisibleProducts,
} from "../../store/productsSlice";
import {
  addToCart,
  increaseQty,
  decreaseQty,
  removeFromCart,
  clearCart,
  fetchCart,
  selectSubtotal,
} from "../../store/cartSlice";
import { showToast } from "../../store/toastSlice";

const DELIVERY_FEE = 35;

const Home = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const productsStatus = useSelector((state) => state.products.status);
  const visibleProducts = useSelector(selectVisibleProducts);
  const cartItems = useSelector((state) => state.cart.items);
  const subtotal = useSelector(selectSubtotal);
  const user = useSelector((state) => state.auth.user);

  const [selectedProduct, setSelectedProduct] = useState(null);

  const total = subtotal + DELIVERY_FEE;

  useEffect(() => {
    if (productsStatus === "idle") {
      dispatch(fetchProducts());
    }
  }, [productsStatus, dispatch]);

  useEffect(() => {
    if (user) {
      dispatch(fetchCart());
    }
  }, [user, dispatch]);

  const handleAddToCart = (product) => {
    if (product.stock <= 0) return;
    if (!user) {
      dispatch(
        showToast({
          message: "Please login to add items to your cart",
          type: "error",
        })
      );
      navigate("/login");
      return;
    }
    const result = dispatch(addToCart(product));
    result.unwrap().then(
      () =>
        dispatch(
          showToast({
            message: `${product.name} added to cart`,
            type: "success",
          })
        ),
      (err) =>
        dispatch(showToast({ message: err || "Failed to add to cart", type: "error" }))
    );
  };

  if (productsStatus === "loading") {
    return <LoadingSpinner fullScreen={true} size="large" />;
  }

  return (
    <>
      <Navbar />
      <Toast />

      <div className={styles.container}>
        <main className={styles.content}>
          <img src={sample} alt="banner" className={styles.sample} />

          {visibleProducts.length === 0 ? (
            <div className={styles.emptyState}>
              <p>No products found.</p>
              <button
                onClick={() => navigate("/home")}
                className={styles.emptyBtn}
              >
                Show all products
              </button>
            </div>
          ) : (
            <div className={styles.productGrid}>
              {visibleProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  name={product.name}
                  description={product.description}
                  image={product.image}
                  price={product.price}
                  rating={product.rating}
                  quantity={product.stock}
                  tags={product.tags}
                  onClick={() => setSelectedProduct(product)}
                  onAddToCart={() => handleAddToCart(product)}
                />
              ))}
            </div>
          )}
        </main>

        <div className={styles.cartWrapper}>
          <Cartlist
            cartItems={cartItems}
            subtotal={subtotal}
            deliveryFee={DELIVERY_FEE}
            total={total}
            clearProducts={() => dispatch(clearCart())}
            removeItem={(id) => dispatch(removeFromCart(id))}
            increaseQty={(id) => dispatch(increaseQty(id))}
            decreaseQty={(id) => dispatch(decreaseQty(id))}
          />
        </div>
      </div>

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
                <img
                  src={selectedProduct.image}
                  alt={selectedProduct.name}
                />
              </div>

              <div className={styles.modalInfo}>
                <h2>{selectedProduct.name}</h2>
                <p className={styles.description}>
                  {selectedProduct.description}
                </p>
                <div className={styles.price}>₱{selectedProduct.price}</div>

                <div className={styles.tags}>
                  {selectedProduct.tags.map((tag, i) => (
                    <span key={i}>{tag}</span>
                  ))}
                </div>

                <p className={styles.stockNote}>
                  {selectedProduct.stock > 0
                    ? `${selectedProduct.stock} in stock`
                    : "Out of stock"}
                </p>

                <button
                  className={styles.addToCartBtn}
                  disabled={selectedProduct.stock <= 0}
                  onClick={() => {
                    handleAddToCart(selectedProduct);
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
