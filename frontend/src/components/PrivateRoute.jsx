import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ children }) => {
  const isAuthenticated = !!localStorage.getItem('token'); // Verifica si hay un token guardado

  return isAuthenticated ? children : <Navigate to="/" replace />;
};

export default PrivateRoute;
