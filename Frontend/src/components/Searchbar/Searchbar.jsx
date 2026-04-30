import React from 'react';
import { FaSearch, FaTimes } from 'react-icons/fa';
import styles from './Searchbar.module.scss';

const Searchbar = ({ value, onChange, handleSearch, onClearSearch }) => {
  return (
    <div className={styles.searchWrapper}>
      <input 
        type="text" 
        placeholder="Search for items..."
        className={styles.inputField}
        value={value}
        onChange={onChange}
        onKeyDown={(e) => e.key === "Enter" && handleSearch()}
      />

      <div className={styles.iconGroup}>
        {value && (
          <button 
            onClick={onClearSearch}
            className={`${styles.iconButton} ${styles.clear}`}
            aria-label="Clear search"
          >
            <FaTimes />
          </button>
        )}

        <button 
          onClick={handleSearch}
          className={`${styles.iconButton} ${styles.search}`}
          aria-label="Submit search"
        >
          <FaSearch />
        </button>
      </div>
    </div>
  );
};

export default Searchbar;