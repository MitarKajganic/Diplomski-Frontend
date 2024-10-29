import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

interface ProtectedRouteProps {
  children: JSX.Element;
  roles?: string[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, roles }) => {
  const { user, token } = useContext(AuthContext);

  if (!token || !user) {
    return <Navigate to="*" replace />;
  }

  if (roles && !roles.includes(user.role)) {
    return <Navigate to="*" replace />;
  }

  return children;
};

export default ProtectedRoute;
