import React from "react";
import { useNavigate } from "react-router-dom";

function ClientShop() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div className="client-shop">
      <h1>Client Shop</h1>
      <p>Welcome, Client! Browse and manage your products here.</p>
      <button onClick={handleLogout} className="logout-btn">
        Logout
      </button>
    </div>
  );
}

export default ClientShop;
