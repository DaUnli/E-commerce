import { Link } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { CartContext } from '../../context/CartContext';
import styles from './Navbar.module.scss';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const { cart } = useContext(CartContext);

  const cartCount = cart?.products.reduce((acc, item) => acc + item.quantity, 0) || 0;

  return (
    <nav className={styles.navbar}>
      <div className={styles.logo}>
        <Link to="/">ShopLogo</Link>
      </div>
      
      <div className={styles.search}>
        <input type="text" placeholder="Search products..." />
      </div>

      <div className={styles.links}>
        <Link to="/cart">
          Cart <span className={styles.cartBadge}>{cartCount}</span>
        </Link>
        
        {user ? (
          <>
            <Link to="/orders">My Orders</Link>
            {user.role === 'admin' && <Link to="/admin">Admin</Link>}
            <button onClick={logout}>Logout</button>
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