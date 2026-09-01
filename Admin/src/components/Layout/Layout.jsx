import React, { useState, useRef, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { NavLink, useLocation, useNavigate, Outlet } from "react-router-dom";
import {
  FaBars,
  FaStore,
  FaSearch,
  FaSun,
  FaMoon,
  FaBell,
  FaUser,
  FaSignOutAlt,
  FaChevronDown,
} from "react-icons/fa";
import { useTheme } from "../../hooks";
import { NAV_ITEMS } from "../../config/nav";
import { canAccess, ROLES } from "../../config/roles";
import { logout } from "../../store/authSlice";
import { statsApi } from "../../services/api";
import Badge from "../ui/Badge";
import Input from "../ui/Input";
import styles from "./layout.module.scss";

const useClickOutside = (ref, handler) => {
  useEffect(() => {
    const listener = (e) => {
      if (ref.current && !ref.current.contains(e.target)) handler();
    };
    document.addEventListener("mousedown", listener);
    return () => document.removeEventListener("mousedown", listener);
  }, [ref, handler]);
};

const Layout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { theme, toggle } = useTheme();
  const user = useSelector((state) => state.auth.user);

  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [notif, setNotif] = useState({ pending: 0, lowStock: 0 });

  const loadNotif = async () => {
    try {
      const { data } = await statsApi.overview();
      setNotif({
        pending: data?.pipeline?.Pending || 0,
        lowStock: data?.lowStock?.length || 0,
      });
    } catch {
      /* polling failures are silent */
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadNotif();
    const poll = setInterval(loadNotif, 20000);
    return () => clearInterval(poll);
  }, []);

  const notifCount = notif.pending + notif.lowStock;

  const profileRef = useRef(null);
  const notifRef = useRef(null);

  useClickOutside(profileRef, () => setProfileOpen(false));
  useClickOutside(notifRef, () => setNotifOpen(false));

  const items = NAV_ITEMS.filter((i) => canAccess(user?.role, i.module));

  const currentTitle =
    NAV_ITEMS.find((i) =>
      i.end ? location.pathname === i.to : location.pathname.startsWith(i.to)
    )?.label || "Dashboard";

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  const initials = user?.name
    ? user.name
        .split(" ")
        .map((n) => n[0])
        .slice(0, 2)
        .join("")
        .toUpperCase()
    : "A";

  return (
    <div
      className={`${styles.app} ${collapsed ? styles.collapsed : ""} ${
        mobileOpen ? styles.mobileOpen : ""
      }`}
    >
      {mobileOpen && (
        <div className={styles.mobileOverlay} onClick={() => setMobileOpen(false)} />
      )}

      <aside className={styles.sidebar}>
        <div className={styles.navbarBrand}>
          <div className={styles.brandLogo}>
            <FaStore />
          </div>
          <span className={styles.brandText}>7eleven Store</span>
        </div>

        <nav className={styles.navScroll}>
          <div className={styles.navGroup}>
            <div className={styles.navGroupLabel}>Main</div>
            {items.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.end}
                  onClick={() => setMobileOpen(false)}
                  className={({ isActive }) =>
                    `${styles.navLink} ${styles.navItem} ${
                      isActive ? styles.active : ""
                    }`
                  }
                >
                  <Icon className={styles.navIcon} />
                  <span className={styles.navLabel}>{item.label}</span>
                </NavLink>
              );
            })}
          </div>
        </nav>

        <div className={styles.sidebarFooter}>
          <div className={styles.userCard}>
            <div className={styles.avatar}>{initials}</div>
            <div className={styles.userInfo}>
              <div className={styles.name}>{user?.name || "Admin"}</div>
              <div className={styles.email}>{user?.email}</div>
            </div>
          </div>
          {user?.role && (
            <Badge color={ROLES[user.role]?.color || "gray"} className={styles.roleBadge}>
              {user.roleLabel}
            </Badge>
          )}
          <div className={styles.roleMeta}>
            {ROLES[user?.role]?.permissions === "*"
              ? "Full access"
              : `${ROLES[user?.role]?.permissions?.length || 0} modules`}
          </div>
        </div>
      </aside>

      <div className={styles.main}>
        <header className={styles.topbar}>
          <button
            className={styles.menuBtn}
            onClick={() => {
              if (window.innerWidth <= 768) setMobileOpen((v) => !v);
              else setCollapsed((v) => !v);
            }}
          >
            <FaBars />
          </button>
          <div className={styles.topbarTitle}>{currentTitle}</div>

          <div className={styles.spacer} />

          <div className={styles.searchWrap}>
            <Input
              size="sm"
              icon={FaSearch}
              placeholder="Search…"
              onKeyDown={(e) => {
                if (e.key === "Enter" && e.target.value.trim()) {
                  navigate(`/products?q=${encodeURIComponent(e.target.value.trim())}`);
                }
              }}
            />
          </div>

          <button className={styles.iconBtn} onClick={toggle} title="Toggle theme">
            {theme === "light" ? <FaMoon /> : <FaSun />}
          </button>

          <div className={styles.dropdownWrap} ref={notifRef}>
            <button
              className={styles.iconBtn}
              onClick={() => setNotifOpen((v) => !v)}
              title="Notifications"
            >
              <FaBell />
              {notifCount > 0 && (
                <span className={styles.notifCount}>{notifCount}</span>
              )}
            </button>
            {notifOpen && (
              <div className={styles.dropdown}>
                <div className={styles.ddHeader}>
                  <div className={styles.name}>Notifications</div>
                </div>
                {notifCount === 0 ? (
                  <div className={styles.ddEmpty}>You're all caught up</div>
                ) : (
                  <>
                    {notif.pending > 0 && (
                      <button
                        className={styles.ddItem}
                        onClick={() => {
                          setNotifOpen(false);
                          navigate("/orders");
                        }}
                      >
                        <FaBell /> {notif.pending} new order
                        {notif.pending > 1 ? "s" : ""} pending
                      </button>
                    )}
                    {notif.lowStock > 0 && (
                      <button
                        className={styles.ddItem}
                        onClick={() => {
                          setNotifOpen(false);
                          navigate("/inventory");
                        }}
                      >
                        <FaBell /> {notif.lowStock} item
                        {notif.lowStock > 1 ? "s" : ""} low on stock
                      </button>
                    )}
                  </>
                )}
              </div>
            )}
          </div>

          <div className={styles.dropdownWrap} ref={profileRef}>
            <button
              className={styles.iconBtn}
              onClick={() => setProfileOpen((v) => !v)}
            >
              <FaUser />
            </button>
            {profileOpen && (
              <div className={styles.dropdown}>
                <div className={styles.ddHeader}>
                  <div className={styles.name}>{user?.name || "Admin"}</div>
                  <div className={styles.email}>{user?.email}</div>
                </div>
                <button
                  className={styles.ddItem}
                  onClick={() => navigate("/settings")}
                >
                  <FaChevronDown /> Settings
                </button>
                <div className={styles.ddDivider} />
                <button className={styles.ddItem} onClick={handleLogout}>
                  <FaSignOutAlt /> Logout
                </button>
              </div>
            )}
          </div>
        </header>

        <main className={styles.content}>
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;
