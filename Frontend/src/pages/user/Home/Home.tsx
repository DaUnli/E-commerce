import { useState, useEffect, useContext } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { CartContext } from "../../../context/CartContext";
import type { Product } from "../../../types/index";
import styles from "./Home.module.scss";
import { formatPrice } from "../../../types/Helper";
import { searchApi } from "../../../api/searchApi";

const Home = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [category, setCategory] = useState("All");
  const [loading, setLoading] = useState(true);
  const { addToCart } = useContext(CartContext);
  const [searchParams] = useSearchParams();

  // Updated: use "query" param instead of "name"
  const searchQuery = searchParams.get("query") || "";

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        // Call the new search API
        const res = await searchApi.search(searchQuery);
        setProducts(res.data.products);
      } catch (error) {
        console.error("Error fetching products", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [searchQuery]);

  const categories = ["All", "Electronics", "Clothing", "Books", "Home"];

  const filtered =
    category === "All"
      ? products
      : products.filter((p) => p.category === category);

  return (
    <div className={styles.container}>
      <div className={styles.sidebar}>
        <h3>Categories</h3>
        {categories.map((cat) => (
          <button
            key={cat}
            className={category === cat ? styles.active : ""}
            onClick={() => setCategory(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className={styles.mainContent}>
        {searchQuery && (
          <div className={styles.searchHeader}>
            <h2>Results for "{searchQuery}"</h2>
            <Link to="/" className={styles.clearSearch}>
              Clear Search
            </Link>
          </div>
        )}

        {loading ? (
          <p>Loading products...</p>
        ) : (
          <div className={styles.productGrid}>
            {filtered.length > 0 ? (
              filtered.map((product) => (
                <div key={product._id} className={styles.productCard}>
                  <div className={styles.image}>
                    <img
                      src={
                        product.images?.[0]?.url ||
                        "https://via.placeholder.com/200"
                      }
                      alt={product.name}
                    />
                  </div>
                  <div className={styles.info}>
                    <h3>{product.name}</h3>
                    <p className={styles.category}>{product.category}</p>
                    <p className={styles.price}>{formatPrice(product.price)}</p>
                  </div>
                  <div className={styles.actions}>
                    <button
                      className={styles.addBtn}
                      onClick={() => addToCart(product._id, 1)}
                    >
                      Add to Cart
                    </button>
                    <Link
                      to={`/product/${product._id}`}
                      className={styles.viewBtn}
                    >
                      View
                    </Link>
                  </div>
                </div>
              ))
            ) : (
              <p className={styles.noResults}>
                No products found matching your criteria.
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
