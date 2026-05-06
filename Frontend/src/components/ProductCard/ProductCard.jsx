import React from "react";
import { FaTrash, FaStar, FaShoppingCart } from "react-icons/fa";
import styles from "./ProductCard.module.scss";

const ProductCard = ({
  name,
  description,
  image,
  price,
  rating = 0,
  quantity = 1,
  tags = [],
  onDelete,
  onAddToCart,
  onClick, // ⭐ ADD THIS
}) => {
  const isOutOfStock = quantity <= 0;

  return (
    <article className={styles.card} onClick={onClick}>
      {/* Delete */}
      {onDelete && (
        <button
          className={styles.delete}
          onClick={(e) => {
            e.stopPropagation(); // prevent modal open
            onDelete();
          }}
        >
          <FaTrash />
        </button>
      )}

      {/* Image */}
      <div className={styles.imageWrapper}>
        <img src={image} alt={name} loading="lazy" />
        {isOutOfStock && (
          <span className={styles.outOfStockBadge}>Sold Out</span>
        )}
      </div>

      {/* Body */}
      <div className={styles.body}>
        <div className={styles.header}>
          <h3 className={styles.name}>{name}</h3>
          <span className={styles.price}>₱{Number(price).toFixed(2)}</span>
        </div>

        {/* Rating */}
        <div className={styles.rating}>
          {[...Array(5)].map((_, i) => (
            <FaStar
              key={i}
              className={i < rating ? styles.activeStar : styles.inactiveStar}
            />
          ))}
          <span className={styles.stockText}>
            {isOutOfStock ? "Out of stock" : `${quantity} in stock`}
          </span>
        </div>

        <p className={styles.description}>{description}</p>

        {/* Tags */}
        {tags.length > 0 && (
          <div className={styles.tags}>
            {tags.map((tag, index) => (
              <span key={index}>🇵🇭 {tag}</span>
            ))}
          </div>
        )}

        {/* Add to Cart */}
        <button
          className={styles.btnAction}
          disabled={isOutOfStock}
          onClick={(e) => {
            e.stopPropagation();
            onAddToCart && onAddToCart();
          }}
        >
          <FaShoppingCart />
          {isOutOfStock ? "Unavailable" : "Add to Cart"}
        </button>
      </div>
    </article>
  );
};

export default ProductCard;