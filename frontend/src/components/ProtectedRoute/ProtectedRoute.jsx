import { useSelector } from 'react-redux';
import { Navigate, Outlet } from 'react-router-dom';
import { authSelector } from '../../selectors';

export const ProtectedRoute = () => {
  const {error, loading, isAuthenticated} = useSelector(authSelector);

  if (loading) {
    return <div>Loading...</div>;
  }

  return isAuthenticated ? <Outlet /> : <Navigate to="/login" />;
};
