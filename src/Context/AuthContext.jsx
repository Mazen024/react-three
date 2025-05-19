import { createContext, useState, useEffect, useCallback } from "react";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";

// eslint-disable-next-line react-refresh/only-export-components
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState(null);
  const [isTokenRefreshing, setIsTokenRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const initializeAuth = () => {
      try {
        const storedUser = localStorage.getItem("user");
        const accessToken = localStorage.getItem("accessToken");
        const refreshToken = localStorage.getItem("refreshToken");

        if (storedUser && accessToken && refreshToken) {
          const parsedUser = JSON.parse(storedUser);
          setAuth(parsedUser);

          const publicRoutes = ["/", "/login", "/signup"];
          if (publicRoutes.includes(window.location.pathname)) {
            const role = parsedUser.roles;
            if (role === "ROLE_ADMIN") {
              navigate("/admin");
            } else if (role === "ROLE_USER") {
              navigate("/home");
            } else if (role === "ROLE_SELLER") {
              navigate("/seller-shop");
            }
          }
        } else {
          localStorage.removeItem("user");
          localStorage.removeItem("accessToken");
          localStorage.removeItem("refreshToken");
        }
      } catch (error) {
        console.error("Error initializing auth state:", error);
        localStorage.clear();
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, [navigate]);

  const login = useCallback(
    (userData) => {
      try {
        if (!userData || !userData.email || !userData.roles) {
          throw new Error("Invalid user data");
        }

        const authData = {
          email: userData.email,
          fullName: userData.fullName,
          roles: Array.isArray(userData.roles)
            ? userData.roles[0]
            : userData.roles,
        };

        setAuth(authData);
        localStorage.setItem("user", JSON.stringify(authData));
        localStorage.setItem("accessToken", userData.accessToken);
        localStorage.setItem("refreshToken", userData.refreshToken);

        // Navigate based on role
        const role = authData.roles;
        if (role === "ROLE_USER") {
          navigate("/home");
        } else if (role === "ROLE_ADMIN") {
          navigate("/admin");
        } else if (role === "ROLE_SELLER") {
          navigate("/seller-shop");
        } else {
          navigate("/home");
        }
      } catch (error) {
        console.error("Login error:", error);
      }
    },
    [navigate]
  );

  const updateTokens = useCallback((tokens) => {
    if (!tokens || !tokens.accessToken || !tokens.refreshToken) {
      console.error("Invalid tokens for update");
      return;
    }

    setAuth((prev) =>
      prev ? { ...prev, accessToken: tokens.accessToken } : prev
    );

    localStorage.setItem("accessToken", tokens.accessToken);
    localStorage.setItem("refreshToken", tokens.refreshToken);
  }, []);

  const logout = useCallback(() => {
    setAuth(null);
    localStorage.removeItem("user");
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    navigate("/login", { replace: true });
  }, [navigate]);

  const value = {
    auth,
    login,
    logout,
    setAuth,
    updateTokens,
    isTokenRefreshing,
    setIsTokenRefreshing,
    isAuthenticated: !!auth,
    loading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
