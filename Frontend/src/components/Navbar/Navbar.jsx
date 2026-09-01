import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Searchbar from "../Searchbar/Searchbar";
import ProfileInfo from "../Profile/Profile";
import styles from "./Navbar.module.scss";
import Cart from "../Cart/Cart";
import Location from "../Location/Location";
import Menu from "../Menu/Menu";
import { selectCartCount, resetCartState } from "../../store/cartSlice";
import { logout } from "../../store/authSlice";
import { setSearchQuery, setCategory } from "../../store/productsSlice";

const Navbar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const cartCount = useSelector(selectCartCount);
  const user = useSelector((state) => state.auth.user);

  const [searchTerm, setSearchTerm] = useState("");
  const [locationbar] = useState({
    HouseUnitBlockLotNumber: "Blk 5 Lot 3",
    StreetName: "Rizal Street",
    PurokSitio: "Purok 2",
    Barangay: "Apopong",
    Municipality: "Davao City",
    Province: "Davao del Sur",
    Region: "Region XI",
    ZIP: "8000",
    Country: "Philippines",
  });

  const onLogout = () => {
    dispatch(logout());
    dispatch(resetCartState());
    navigate("/login");
  };

  const handleSearch = () => {
    if (searchTerm) {
      dispatch(setSearchQuery(searchTerm));
      dispatch(setCategory("all"));
      navigate("/home");
    }
  };

  const handleClearSearch = () => {
    setSearchTerm("");
    dispatch(setSearchQuery(""));
  };

  return (
    <>
      <nav className={styles.navbar}>
        <div className={styles.logo}>
          <Link to="/">
            <img src="/logo.png" alt="Logo" className={styles.logoImage} />
          </Link>
        </div>

        <div className={styles.location}>
          <Location locationbar={locationbar} />
        </div>

        <div className={styles.searchSection}>
          <Searchbar
            value={searchTerm}
            onChange={({ target }) => setSearchTerm(target.value)}
            handleSearch={handleSearch}
            onClearSearch={handleClearSearch}
          />
        </div>

        <Cart cartCount={cartCount} />

        <div className={styles.profileSection}>
          <ProfileInfo
            userInfo={user ? { fullName: user.name } : null}
            onLogout={onLogout}
          />
        </div>
      </nav>

      <div className={styles.secondaryNavbar}>
        <Menu />
      </div>
    </>
  );
};

export default Navbar;
