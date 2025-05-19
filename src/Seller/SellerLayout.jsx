import React, { useCallback, useContext, useEffect, useState } from "react";
import { Outlet, NavLink, useNavigate } from "react-router-dom";
import styles from "./SellerLayout.module.css";
import { AuthContext } from "../Context/AuthContext";
import { getUserProfile } from "../Service/authService";
import { LogOut, Menu, X } from "lucide-react";

export default function SellerLayout() {
  const navigate = useNavigate();
  const { logout } = useContext(AuthContext);
  const [formData, setFormData] = useState({
    fullName: "",
  });
  const [profilePicture, setProfilePicture] = useState(
    "Assets/textures/unknown-person.png"
  );
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { setAuth, auth } = useContext(AuthContext);

  const fetchUserProfile = useCallback(async () => {
    try {
      const { data, success } = await getUserProfile();

      if (success && data) {
        setAuth(data);

        setFormData({
          fullName: `${data.firstName || ""} ${data.lastName || ""}`.trim(),
        });

        if (data.photoUrl) {
          setProfilePicture(data.photoUrl);
        }
      }
    } catch (error) {
      console.error("Failed to fetch user profile:", error);
    }
  }, [setAuth]);

  useEffect(() => {
    fetchUserProfile();
  }, [fetchUserProfile]);

  const toggleSidebar = () => {
    if (window.innerWidth <= 768) {
      setSidebarOpen(false);
      document.body.classList.remove("sidebar-open");
    } else {
      setSidebarCollapsed(!sidebarCollapsed);
    }
  };

  const openSidebar = () => {
    setSidebarOpen(true);
    document.body.classList.add("sidebar-open");
  };

  const closeSidebar = () => {
    setSidebarOpen(false);
    document.body.classList.remove("sidebar-open");
  };

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  useEffect(() => {
    const handleEscKey = (e) => {
      if (e.key === "Escape" && window.innerWidth <= 768 && sidebarOpen) {
        closeSidebar();
      }
    };

    document.addEventListener("keydown", handleEscKey);
    return () => {
      document.removeEventListener("keydown", handleEscKey);
    };
  }, [sidebarOpen]);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setSidebarCollapsed(false);
        setSidebarOpen(false);
      } else {
        setSidebarOpen(false);
        document.body.classList.remove("sidebar-open");
      }
    };

    handleResize();

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <div className={styles.sellerLayout}>
      <div
        className={`${styles.overlay} ${sidebarOpen ? styles.active : ""}`}
        onClick={closeSidebar}
      ></div>

      <aside
        className={`${styles.sidebar} ${
          sidebarCollapsed ? styles.collapsed : ""
        } ${sidebarOpen ? styles.open : ""}`}
      >
        <div className={styles.logo}>
          <h2>Seller Portal</h2>
          <button
            className={styles.toggleButton}
            onClick={toggleSidebar}
            aria-label={
              sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"
            }
          >
            {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        <nav className={styles.navigation}>
          <NavLink
            to="/account"
            className={({ isActive }) =>
              isActive ? styles.activeLink : styles.navLink
            }
          >
            <span className={styles.navIcon}>👤</span>
            <span className={styles.navText}>Profile</span>
          </NavLink>
          <NavLink
            to="./dashboard"
            className={({ isActive }) =>
              isActive ? styles.activeLink : styles.navLink
            }
          >
            <span className={styles.navIcon}>📊</span>
            <span className={styles.navText}>Dashboard</span>
          </NavLink>
          <NavLink
            to="./products"
            className={({ isActive }) =>
              isActive ? styles.activeLink : styles.navLink
            }
          >
            <span className={styles.navIcon}>📦</span>
            <span className={styles.navText}>Products</span>
          </NavLink>
          <NavLink
            to="./orders"
            className={({ isActive }) =>
              isActive ? styles.activeLink : styles.navLink
            }
          >
            <span className={styles.navIcon}>🛒</span>
            <span className={styles.navText}>Orders</span>
          </NavLink>
        </nav>

        <div className={styles.userSection}>
          <div className={styles.userAvatar}>
            <img
              src={profilePicture}
              alt="Profile"
              className={styles.profileImage}
            />
            <div className={styles.statusIndicator}></div>
          </div>
          <div className={styles.userInfo}>
            <p className={styles.userName}>Seller Dashboard</p>
            <p className={styles.userRole}>
              {formData.fullName || "Loading..."}
            </p>
          </div>
        </div>

        <div className={styles.logoutSection}>
          <button onClick={handleLogout} className={styles.logoutBtn}>
            <LogOut size={18} />
            <span className={styles.navText}>Logout</span>
          </button>
        </div>
      </aside>

      <div className={styles.contentWrapper}>
        {/* Mobile menu button */}
        <button
          className={styles.menuButton}
          onClick={openSidebar}
          aria-label="Open menu"
        >
          <Menu size={20} />
        </button>

        <main className={styles.main}>
          <Outlet />
        </main>

        <footer className={styles.footer}>
          <div>
            © {new Date().getFullYear()} Seller Portal. All rights reserved.
          </div>
          <div className={styles.footerLinks}>
            <a href="#" className={styles.footerLink}>
              Privacy Policy
            </a>
            <a href="#" className={styles.footerLink}>
              Terms of Service
            </a>
            <a href="#" className={styles.footerLink}>
              Contact Support
            </a>
          </div>
        </footer>
      </div>
    </div>
  );
}
