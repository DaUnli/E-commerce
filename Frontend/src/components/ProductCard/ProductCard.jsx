import React from "react";
import { FaTrash, FaStar } from "react-icons/fa";
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
}) => {
  return (
    <div className={styles.card}>
      
      {/* Image */}
      <div className={styles.image}>
        <img src={image} alt={name} />
      </div>

      {/* Body */}
      <div className={styles.body}>
        <h3 className={styles.name}>{name}</h3>

        <p className={styles.description}>
          {description?.slice(0, 80)}
          {description?.length > 80 && "..."}
        </p>

        {/* Rating */}
        <div className={styles.rating}>
          {[...Array(5)].map((_, i) => (
            <FaStar
              key={i}
              className={i < rating ? styles.active : ""}
            />
          ))}
        </div>

        {/* Price + Stock */}
        <div className={styles.meta}>
          <span className={styles.price}>₱{price}</span>
          <span className={styles.quantity}>Stock: {quantity}</span>
        </div>

        {/* Tags */}
        <div className={styles.tags}>
          {tags.map((tag, index) => (
            <span key={index}>🇵🇭 {tag}</span>
          ))}
        </div>
      </div>

      {/* Delete */}
      <button className={styles.delete} onClick={onDelete}>
        <FaTrash />
      </button>
    </div>
  );
};

export default ProductCard;