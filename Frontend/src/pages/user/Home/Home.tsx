import { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { productApi } from '../../../api/productApi';
import { CartContext } from '../../../context/CartContext';
import type { Product } from '../../../types/index';
import styles from './Home.module.scss';

const Home = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [category, setCategory] = useState('All');
  const { addToCart } = useContext(CartContext);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await productApi.getAll();
        setProducts(res.data.products);
      } catch (error) {
        console.error('Error fetching products', error);
      }
    };
    fetchProducts();
  }, []);

  const categories = ['All', 'Electronics', 'Clothing', 'Books', 'Home'];

  const filtered = category === 'All' 
    ? products 
    : products.filter(p => p.category === category);

  return (
    <div className={styles.container}>
      <div className={styles.sidebar}>
        <h3>Categories</h3>
        {categories.map(cat => (
          <button 
            key={cat} 
            className={category === cat ? styles.active : ''}
            onClick={() => setCategory(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className={styles.productGrid}>
        {filtered.map(product => (
          <div key={product._id} className={styles.productCard}>
            <div className={styles.image}>
              <img src={product.images?.[0] || 'https://via.placeholder.com/200'} alt={product.name} />
            </div>
            <div className={styles.info}>
              <h3>{product.name}</h3>
              <p className={styles.category}>{product.category}</p>
              <p className={styles.price}>${product.price}</p>
            </div>
            <div className={styles.actions}>
              <button 
                className={styles.addBtn}
                onClick={() => addToCart(product._id, 1)}
              >
                Add to Cart
              </button>
              <Link to={`/product/${product._id}`} className={styles.viewBtn}>
                View
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;