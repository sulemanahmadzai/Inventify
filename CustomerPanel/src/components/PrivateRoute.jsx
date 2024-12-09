import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { Navigate } from "react-router-dom";

const PrivateRoute = ({ children, requiredRoles }) => {
  const { user, roles, loading } = useContext(AuthContext);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (user == null) {
    console.log("hello");
    return <Navigate to="/login" />;
  }

  // Check if user has any of the required roles
  if (requiredRoles && !roles.some((role) => requiredRoles.includes(role))) {
    return <div>You are not authorized to access this page.</div>;
  }

  return children;
};

export default PrivateRoute;
