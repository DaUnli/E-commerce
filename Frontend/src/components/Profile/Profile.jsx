import React from "react";
import { Link } from "react-router-dom";
import { GoPerson } from "react-icons/go";
import { getInitials } from "../../types/Helper";
import styles from "./Profile.module.scss";

const ProfileInfo = ({ userInfo, onLogout }) => {
  return (
    <div className={styles.profileWrapper}>
      {/* 1. Changed condition: If NO userInfo, show login link */}
      {userInfo ? (
        <Link to="/login" className={styles.loginLink}>
          <div className={styles.loginIconWrapper}>
            <GoPerson />
          </div>
          <span className={styles.loginText}>Sign in / Register</span>
        </Link>
      ) : (
        <>
          <div className={styles.avatar}>
            {getInitials(userInfo.fullName)}
          </div>

          <div className={styles.details}>
            <p className={styles.userName}>{userInfo.fullName}</p>
            <button className={styles.logoutBtn} onClick={onLogout}>
              Logout
            </button>
          </div>

          <button className={styles.mobileLogoutBtn} onClick={onLogout}>
            LOGOUT
          </button>
        </>
      )}
    </div>
  );
};

export default ProfileInfo;