import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Searchbar from "../Searchbar/Searchbar";
import ProfileInfo from "../Profile/Profile";
import styles from "./Navbar.module.scss";
import Cart from "../Cart/Cart";
import Location from "../Location/Location";

const Navbar = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [userInfo, setUserInfo] = useState({
    fullName: "Cathleah Grace",
  });
  const [locationbar, setLocationbar] = useState("Gensan");
  
  // Example cart count - this would usually come from a Context or Redux
  const [cartCount, setCartCount] = useState(8);

  const onLogout = () => {
    setUserInfo(null);
    navigate("/login");
  };

  const handleSearch = () => {
    if (searchTerm) {
      // navigate(`/search?query=${searchTerm}`);
    }
  };

  return (
    <nav className={styles.navbar}>
      <div className={styles.logo}>
        <Link to="/">
          <img src="/logo.png" alt="Logo" className={styles.logoImage} />
        </Link>
      </div>

      <div className={styles.location}>
        <Location locationbar={locationbar}/>
      </div>

      <div className={styles.searchSection}>
        <Searchbar 
          value={searchTerm} 
          onChange={({ target }) => setSearchTerm(target.value)}
          handleSearch={handleSearch}
        />
      </div>

      {/* Cart Icon Section */}
      <Cart cartCount={cartCount}/>

      <div className={styles.profileSection}>
        <ProfileInfo userInfo={userInfo} onLogout={onLogout} />
      </div>
    </nav>
  );
};

export default Navbar;