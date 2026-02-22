import React from "react";
import { FaSearch, FaTimes } from "react-icons/fa";
import styles from "./Searchbar.module.scss";

interface SearchbarProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSearch: () => void;
  onClearSearch: () => void;
}

const Searchbar: React.FC<SearchbarProps> = ({
  value,
  onChange,
  handleSearch,
  onClearSearch,
}) => {
  return (
    <div className={styles.container}>
      <input
        type="text"
        placeholder="Search notes..."
        className={styles.input}
        value={value}
        onChange={onChange}
        onKeyDown={(e) => e.key === "Enter" && handleSearch()}
      />

      <div className={styles.actions}>
        {value && (
          <button
            onClick={onClearSearch}
            className={styles.iconButton}
            type="button"
          >
            <FaTimes className={styles.clearIcon} />
          </button>
        )}

        <button
          onClick={handleSearch}
          className={styles.iconButton}
          type="button"
        >
          <FaSearch className={styles.searchIcon} />
        </button>
      </div>
    </div>
  );
};

export default Searchbar;