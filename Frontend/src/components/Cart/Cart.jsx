import React from 'react'
import { IoCartOutline   } from "react-icons/io5"; // Added Shopping Cart Icon
import styles from "./Cart.module.scss"
import { useNavigate } from 'react-router-dom'

const Cart = ({ cartCount }) => {

    const navigate = useNavigate()


    return (
        <>
            {/* Cart Icon Section */}
            <div className={styles.cartSection} onClick={() => navigate("/cart")}>
                <div className={styles.iconWrapper}>
                    <IoCartOutline   className={styles.cartIcon} />
                    {cartCount > 0 && (
                        <span className={styles.badge}>{cartCount}</span>
                    )}
                </div>
                <div className={styles.cartText}>
                    <h4>Cart</h4>
                </div>
            </div>
        </>
    )
}

export default Cart
