import { Navigate } from "react-router-dom";
import PropTypes from "prop-types";

function ProtectedRoute({ children, allowedRoles }) {
  const user = JSON.parse(localStorage.getItem("user"));

  if (!user) {
    return <Navigate to="/unauthorized" />;
  }

  if (!allowedRoles.some((role) => user.roles.includes(role))) {
    return <Navigate to="/unauthorized" />;
  }

  return children;
}

ProtectedRoute.propTypes = {
  children: PropTypes.node.isRequired,
  allowedRoles: PropTypes.array.isRequired,
};

export default ProtectedRoute;
