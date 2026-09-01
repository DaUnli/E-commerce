import React from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { IoIosMenu } from "react-icons/io";
import { IoMdPricetag } from "react-icons/io";
import styles from "./Menu.module.scss";
import { categories } from "../../data/products";
import { setCategory } from "../../store/productsSlice";

const Menu = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const activeCategory = useSelector((state) => state.products.category);

  const handleCategory = (id) => {
    dispatch(setCategory(id));
    navigate("/home");
  };

  return (
    <nav className={styles.menu}>
      <div className={styles.left}>
        <div className={styles.menuButton} onClick={() => handleCategory("all")}>
          <button className={styles.menuIcon}>
            <IoIosMenu />
          </button>
          <p>All Categories</p>
        </div>
      </div>

      <div className={styles.center}>
        {categories
          .filter((c) => c.id !== "all")
          .map((c) => (
            <button
              key={c.id}
              className={activeCategory === c.id ? styles.active : ""}
              onClick={() => handleCategory(c.id)}
            >
              {c.name}
            </button>
          ))}
      </div>

      <div className={styles.right}>
        <IoMdPricetag />
        <span>Promotion</span>
      </div>
    </nav>
  );
};

export default Menu;
