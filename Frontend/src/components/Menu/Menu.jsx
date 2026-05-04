import React from "react";
import { IoIosMenu } from "react-icons/io";
import { IoMdPricetag } from "react-icons/io";
import styles from "./Menu.module.scss";

const Menu = () => {
    return (
        <nav className={styles.menu}>

            {/* Left: Menu */}
            <div className={styles.left}>
                <div className={styles.menuButton}>
                    <button className={styles.menuIcon}>
                        <IoIosMenu />
                    </button>
                    <p>All Categories</p>
                </div>
            </div>

            {/* Center: Categories */}
            <div className={styles.center}>
                <button>Ready to eat</button>
                <button>Drink</button>
                <button>Snacks</button>
                <button>Personal Care</button>
                <button>Household</button>
                <button>All Product</button>
            </div>

            {/* Right: Promotion */}
            <div className={styles.right}>
                <IoMdPricetag />
                <span>Promotion</span>
            </div>

        </nav>
    );
};

export default Menu;