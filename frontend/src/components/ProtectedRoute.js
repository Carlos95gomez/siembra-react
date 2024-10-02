import React from 'react';
import { Navigate } from 'react-router-dom';

function ProtectedRoute({ children, allowedRoles }) {
  const token = localStorage.getItem('token');
  const userRole = localStorage.getItem('userRole'); // Asegúrate de guardar el rol del usuario al iniciar sesión

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(userRole)) {
    // Puedes crear una página de "No autorizado" si lo prefieres
    return <Navigate to="/" replace />;
  }

  return children;
}

export default ProtectedRoute;