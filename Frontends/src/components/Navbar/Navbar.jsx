import { Link, useNavigate } from "react-router-dom";
import { useContext, useState } from "react";
import styles from "./Navbar.module.scss";

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const { cart } = useContext(CartContext);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  const cartCount =
    cart?.products?.reduce((acc, item) => acc + item.quantity, 0) || 0;

  const handleSearch = (e) => {
    e.preventDefault();

    // If searchTerm is empty, go to all products page
    if (!searchTerm.trim()) {
      navigate("/products"); // or '/' if your homepage lists all products
      return;
    }

    // Redirect to search page with query param
    navigate(`/search?query=${encodeURIComponent(searchTerm.trim())}`);
  };

  return (
    <nav className={styles.navbar}>
      <div className={styles.logo}>
        <Link to="/">ShopLogo</Link>
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

      <div className={styles.links}>
        {user && (
          <Link to="/cart">
            Cart <span className={styles.cartBadge}>{cartCount}</span>
          </Link>
        )}

        {user ? (
          <>
            <Link to="/orders">My Orders</Link>
            {user.role === "admin" && <Link to="/admin">Admin</Link>}
            <button className={styles.logoutBtn} onClick={logout}>
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
