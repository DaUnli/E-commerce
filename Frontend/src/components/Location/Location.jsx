import React, { useState } from 'react';
import styles from "./Location.module.scss";
import { IoLocationOutline } from "react-icons/io5";
import { IoIosArrowDown } from "react-icons/io";

const Location = ({ locationbar }) => {
    const [showLocation, setShowLocation] = useState(false);

    return (
        <div className={styles.wrapper}>
            <div className={styles.locationSection}>
                <div className={styles.iconWrapper}>
                    <IoLocationOutline className={styles.cartIcon} />
                </div>

                <div className={styles.locationText}>
                    <p>Delivered in</p>
                    <span>{locationbar.Municipality}</span>

                    <button
                        className={`${styles.arrow} ${showLocation ? styles.open : ""}`}
                        onClick={() => setShowLocation(!showLocation)}
                    >
                        <IoIosArrowDown />
                    </button>
                </div>
            </div>

            {/* 🔥 Overlay Dropdown */}
            {showLocation && (
                <div className={styles.overlay} onClick={() => setShowLocation(false)}>
                    <div className={styles.dropdown} onClick={(e) => e.stopPropagation()}>
                        <p>
                            {locationbar.HouseUnitBlockLotNumber}, {" "}
                            {locationbar.StreetName}, {" "}
                            {locationbar.PurokSitio}, {" "}
                            {locationbar.Barangay}
                        </p>

                        <p>
                            {locationbar.Municipality}, {" "}
                            {locationbar.Province}, {" "}
                            {locationbar.Region}, {" "}
                            {locationbar.ZIP}, {" "}
                            {locationbar.Country}
                        </p>
                    </div>
                </div>
            )}


        </div>
    );
};

export default Location;