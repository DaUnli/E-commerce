import React from 'react';
import styles from "./Cartlist.module.scss";
import { FaTrash, FaMinus, FaPlus, FaShoppingCart } from "react-icons/fa";

const Cartlist = ({
    cartItems,
    subtotal,
    deliveryFee,
    total,
    clearProducts,
    removeItem,
    increaseQty,
    decreaseQty
}) => {

    return (
        <aside className={styles.cartSidebar}>
            <div className={styles.cartHeader}>
                <h2>Your Cart ({cartItems.length})</h2>
                {cartItems.length > 0 && (
                    <button className={styles.clearAll} onClick={clearProducts}>
                        Clear all
                    </button>
                )}
            </div>

            {cartItems.length === 0 ? (
                <div className={styles.emptyCart}>
                    <FaShoppingCart className={styles.emptyIcon} />
                    <p>Your cart is currently empty.</p>
                </div>
            ) : (
                <>
                    <div className={styles.cartItems}>
                        {cartItems.map((item) => (
                            <div key={item.id} className={styles.cartItem}>
                                <img src={item.image} alt={item.name} />
                                
                                <div className={styles.itemDetails}>
                                    <h4>{item.name}</h4>
                                    <p className={styles.itemDesc}>{item.description}</p>
                                    
                                    <div className={styles.itemActions}>
                                        <span className={styles.itemPrice}>₱{item.price.toFixed(2)}</span>
                                        
                                        <div className={styles.qtyControls}>
                                            <button onClick={() => decreaseQty(item.id)} disabled={item.quantity <= 1}>
                                                <FaMinus size={10} />
                                            </button>
                                            <span>{item.quantity}</span>
                                            <button onClick={() => increaseQty(item.id)}>
                                                <FaPlus size={10} />
                                            </button>
                                        </div>

                                        <button
                                            className={styles.btnDelete}
                                            onClick={() => removeItem(item.id)}
                                            aria-label="Remove item"
                                        >
                                            <FaTrash size={14} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className={styles.cartSummary}>
                        <div className={styles.summaryRow}>
                            <span>Subtotal</span>
                            <span>₱{subtotal.toFixed(2)}</span>
                        </div>
                        <div className={styles.summaryRow}>
                            <span>Delivery Fee</span>
                            <span>₱{deliveryFee.toFixed(2)}</span>
                        </div>
                        <div className={`${styles.summaryRow} ${styles.total}`}>
                            <span>Total</span>
                            <span className={styles.totalPrice}>₱{total.toFixed(2)}</span>
                        </div>
                        <button className={styles.btnCheckout}>Proceed to Checkout</button>
                    </div>
                </>
            )}
        </aside>
    );
};

export default Cartlist;