import React from "react";
import { Link } from "react-router-dom";
import styles from "./ProductCard.module.scss";

interface ProductImage {
  public_id: string;
  url: string;
}

interface ProductProps {
  product: {
    _id: string;
    name: string;
    price: number;
    category: string;
    images: ProductImage[];
    ratings: number;
    numOfReviews: number;
    stock: number;
  };
}

const ProductCard: React.FC<ProductProps> = ({ product }) => {
  return (
    <div className={styles.cardContainer}>
      <div className={styles.imageArea}>
        <img 
          src={product.images[0]?.url} 
          alt={product.name} 
        />
        {product.stock < 1 && <span className={styles.soldOut}>Out of Stock</span>}
      </div>

      <div className={styles.content}>
        <p className={styles.categoryText}>{product.category}</p>
        <Link to={`/product/${product._id}`} className={styles.productName}>
          {product.name}
        </Link>
        
        <div className={styles.ratingBox}>
          <span className={styles.stars}>{"★".repeat(Math.round(product.ratings))}</span>
          <span className={styles.reviewCount}>({product.numOfReviews})</span>
        </div>

        <div className={styles.priceRow}>
          <span className={styles.priceTag}>${product.price}</span>
          <button className={styles.actionBtn} disabled={product.stock < 1}>
            {product.stock < 1 ? "Unavailable" : "Add to Cart"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;