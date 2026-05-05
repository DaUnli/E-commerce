import React from 'react'
import styles from "./Cartlist.module.scss"


const Cartlist = ({cartItems, subtotal, deliveryFee, total}) => {
    
    return (
        <div>
            <aside className={styles.cartSidebar}>
                <h2>Cart ({cartItems.length})</h2>

                <div className={styles.cartItems}>
                    {cartItems.map((item) => (
                        <div key={item.id} className={styles.cartItem}>
                            <img src={item.image} />
                            <div>
                                <h4>{item.name}</h4>
                                <span>₱{item.price}</span>
                            </div>
                        </div>
                    ))}
                </div>

                <div className={styles.cartSummary}>
                    <p>Subtotal: ₱{subtotal}</p>
                    <p>Delivery: ₱{deliveryFee}</p>
                    <h3>Total: ₱{total}</h3>
                    <button className={styles.btnCheckout}>Checkout</button>
                </div>
            </aside>
        </div>
    )
}

export default Cartlist
