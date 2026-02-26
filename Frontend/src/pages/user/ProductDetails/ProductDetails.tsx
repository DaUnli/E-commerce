import { useState, useEffect, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import { productApi } from '../../../api/productApi';
import { CartContext } from '../../../context/CartContext';
import type { Product } from '../../../types/index';
import styles from './ProductDetails.module.scss';

const ProductDetails = () => {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useContext(CartContext);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await productApi.getById(id!);
        setProduct(res.data.product);
      } catch (error) {
        console.error('Error fetching product', error);
      }
    };
    fetchProduct();
  }, [id]);

  const handleAddToCart = () => {
    if (product) {
      addToCart(product._id, quantity);
    }
  };

  if (!product) return <div>Loading...</div>;

  return (
    <div className={styles.container}>
      <div className={styles.breadcrumb}>
        <Link to="/">Home</Link> / <span>{product.name}</span>
      </div>

      <div className={styles.product}>
        <div className={styles.imageSection}>
          <div className={styles.mainImage}>
            <img 
              src={product.images?.[0] || 'https://via.placeholder.com/450'} 
              alt={product.name} 
            />
          </div>
        </div>

        <div className={styles.infoSection}>
          <span className={styles.category}>{product.category}</span>
          <h1>{product.name}</h1>
          <p className={styles.price}>${product.price}</p>
          <p className={styles.description}>{product.description}</p>

          <div className={styles.quantity}>
            <label>Quantity:</label>
            <div className={styles.qtyControl}>
              <button onClick={() => setQuantity(Math.max(1, quantity - 1))}>-</button>
              <span>{quantity}</span>
              <button onClick={() => setQuantity(quantity + 1)}>+</button>
            </div>
          </div>

          <button className={styles.addBtn} onClick={handleAddToCart}>
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;