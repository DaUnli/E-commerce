import React from "react";
import { getInitials } from "../../api/Helper";
import styles from "./Profile.module.scss";

interface User {
  _id: string;
  fullName: string;
  email?: string;
}

interface ProfileInfoProps {
  userInfo: User | null;
  onLogout: () => void;
}

const ProfileInfo: React.FC<ProfileInfoProps> = ({
  userInfo,
  onLogout,
}) => {
  if (!userInfo) return null;

  return (
    <div className={styles.container}>
      {/* Avatar */}
      <div className={styles.avatar}>
        {getInitials(userInfo.fullName)}
      </div>

      {/* Desktop Info */}
      <div className={styles.userDetails}>
        <p className={styles.name}>{userInfo.fullName}</p>
        <button className={styles.logoutBtn} onClick={onLogout}>
          Logout
        </button>
      </div>

      {/* Mobile Logout */}
      <button className={styles.mobileLogout} onClick={onLogout}>
        LOGOUT
      </button>
    </div>
  );
};

export default ProfileInfo;