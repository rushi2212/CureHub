
import { Navigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

// const ProtectedRoute = ({ children, allowedRoles }) => {
//   const { user, loading } = useContext(AuthContext);

//   if (loading) return <p>Loading...</p>;
//   if (!user || !allowedRoles.includes(user.role)) return <Navigate to="/login" replace />;

//   return children;
// };
const ProtectedRoute = ({ children, allowedRoles }) => {
    const { user, loading } = useContext(AuthContext);
  
    console.log("ProtectedRoute - User:", user);
    console.log("Allowed Roles:", allowedRoles);
  
    if (loading) return <p>Loading...</p>;
  
    if (!user || !allowedRoles.includes(user.role)) {
      console.error("Access Denied - Redirecting to Login");
      return <Navigate to="/login" replace />;
    }
  
    return children;
  };

export default ProtectedRoute;
