import React from 'react'
import styles from "./Location.module.scss"
import { IoLocationOutline } from "react-icons/io5"; // Added Shopping Cart Icon


const Location = ({ locationbar }) => {
    return (
        <div>
            <div className={styles.locationSection}>
                <div className={styles.iconWrapper}>
                    <IoLocationOutline className={styles.cartIcon} />
                </div>
                <div className={styles.locationText}>
                    <p>Delivered in</p><span>{locationbar}</span>
                </div>
            </div>
        </div>
    )
}

export default Location
