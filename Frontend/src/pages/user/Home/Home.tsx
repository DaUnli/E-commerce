import { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import type { Product } from "../../../types";
import styles from "./Home.module.scss";
import { productApi } from "../../../api/productApi";
import ProductCard from "../../../components/ProductCard/ProductCard";
import LoadingSpinner from "../../../components/LoadingSpinner/LoadingSpinner";

const Home = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [category, setCategory] = useState("All");
  const [loading, setLoading] = useState(true);
  const [searchParams] = useSearchParams();

  const searchQuery = searchParams.get("query") || "";

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const res = await productApi.getAll();
        if (res.data.success) {
          let data = res.data.products;

          if (searchQuery) {
            data = data.filter((p) =>
              p.name.toLowerCase().includes(searchQuery.toLowerCase())
            );
          }

          setProducts(data);
        }
      } catch (err) {
        console.error("Error fetching products:", err);
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
      {/* Sidebar */}
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

      {/* Main Content */}
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
          <LoadingSpinner />
        ) : (
          <div className={styles.productGrid}>
            {filtered.length > 0 ? (
              filtered.map((product) => (
                <ProductCard key={product._id} product={product} />
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