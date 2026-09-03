import React, { useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

export const ProtectedRoute = () => {
  const { user, loading } = useContext(AuthContext);
  if (loading) return <div className="text-center p-5">Loading...</div>;
  return user ? <Outlet /> : <Navigate to="/login" replace />;
};

export const AdminRoute = () => {
  const { user, loading } = useContext(AuthContext);
  if (loading) return <div className="text-center p-5">Loading...</div>;
  return user?.is_staff ? <Outlet /> : <Navigate to="/" replace />;
};