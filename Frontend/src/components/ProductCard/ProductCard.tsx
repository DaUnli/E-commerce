import React, { useContext } from "react";
import { Link } from "react-router-dom";
import type { Product } from "../../types";
import { CartContext } from "../../context/CartContext";
import styles from "./ProductCard.module.scss";

interface ProductProps {
  product: Product;
}

const ProductCard: React.FC<ProductProps> = ({ product }) => {
  const { addToCart } = useContext(CartContext);

  return (
    <div className={styles.cardContainer}>
      <div className={styles.imageArea}>
        <img
          src={product.images?.[0]?.url || "https://via.placeholder.com/200"}
          alt={product.name}
        />
        {product.stock < 1 && (
          <span className={styles.soldOut}>Out of Stock</span>
        )}
      </div>

      <div className={styles.content}>
        <p className={styles.categoryText}>{product.category}</p>

        <Link to={`/product/${product._id}`} className={styles.productName}>
          {product.name}
        </Link>

        <div className={styles.ratingBox}>
          <span className={styles.stars}>
            {"★".repeat(Math.round(product.ratings || 0))}
          </span>
          <span className={styles.reviewCount}>
            ({product.numOfReviews || 0})
          </span>
        </div>

        <div className={styles.priceRow}>
          <span className={styles.priceTag}>
            ${product.price.toFixed(2)}
          </span>

          <button
            className={styles.actionBtn}
            disabled={product.stock < 1}
            onClick={() => addToCart(product._id, 1)}
          >
            {product.stock < 1 ? "Unavailable" : "Add to Cart"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;