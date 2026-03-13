import { useState } from "react";
import styles from "./SideBar.module.scss";

const Sidebar = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [category, setCategory] = useState("All");

  
  const categories = ["All", "Electronics", "Clothing", "Books", "Home"];

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
    </div>
  );
};

export default Sidebar;
