import { Link, useNavigate } from "react-router-dom";
import { useContext, useState } from "react";
import styles from "./Navbar.module.scss";

const Navbar = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
  };

  return (
    <nav className={styles.navbar}>
      <div className={styles.logo}>
        <img src="/logo.png" alt="Company Logo" className="logo-style" />
      </div>

      <form className={styles.search} onSubmit={handleSearch}>
        <input
          type="text"
          placeholder="Search products..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button type="submit" style={{ display: "none" }}>
          Search
        </button>
      </form>
    </nav>
  );
};

export default Navbar;
