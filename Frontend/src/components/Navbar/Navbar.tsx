import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./Navbar.module.scss";
import api from "../../api/axiosInstance";
import ProfileInfo from "../Card/Profile";
import Searchbar from "../SearchBar/SearchBar";

interface NavbarProps {
  userInfo: any; // Replace with proper User type if available
  onSearchNote: (query: string) => void;
  handleClearSearch: () => void;
}

const Navbar: React.FC<NavbarProps> = ({
  userInfo,
  onSearchNote,
  handleClearSearch,
}) => {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const navigate = useNavigate();

  const onLogout = async (): Promise<void> => {
    try {
      await api.post("/auth/logout");
    } catch (error) {
      console.error("Logout failed", error);
    } finally {
      navigate("/login");
    }
  };

  const handleSearch = (): void => {
    if (searchQuery.trim()) {
      onSearchNote(searchQuery);
    }
  };

  const onClearSearch = (): void => {
    setSearchQuery("");
    handleClearSearch();
  };

  return (
    <div className={styles.navbar}>
      {/* Logo */}
      <h2
        className={`${styles.logo} ${
          searchQuery ? styles.hideOnMobile : ""
        }`}
      >
        ThinTheHan<span>Nimo</span>
      </h2>

      {/* Searchbar */}
      {userInfo && (
        <div className={styles.searchContainer}>
          <Searchbar
            value={searchQuery}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setSearchQuery(e.target.value)
            }
            handleSearch={handleSearch}
            onClearSearch={onClearSearch}
          />
        </div>
      )}

      {/* Profile Section */}
      <div className={styles.profileSection}>
        <ProfileInfo userInfo={userInfo} onLogout={onLogout} />
      </div>
    </div>
  );
};

export default Navbar;