import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axiosClient from '../../api/axiosClient';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await axiosClient.get('/accounts/admin/dashboard-stats/');
        setStats(res.data);
      } catch (err) {
        console.error('Error fetching admin stats:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) return <div className="text-center py-5">Loading Admin Dashboard...</div>;

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h3 className="fw-bold">Admin Dashboard</h3>
        <div className="d-flex gap-2">
          <Link to="/admin/products" className="btn btn-outline-primary btn-sm">Manage Products</Link>
          <Link to="/admin/categories" className="btn btn-outline-secondary btn-sm">Manage Categories</Link>
          <Link to="/admin/orders" className="btn btn-outline-success btn-sm">Manage Orders</Link>
        </div>
      </div>

      <div className="row g-4 mb-4">
        <div className="col-12 col-sm-6 col-lg-3">
          <div className="card shadow-sm border-0 bg-primary text-white p-3">
            <h6>Total Revenue</h6>
            <h3 className="fw-bold">${stats?.total_revenue?.toFixed(2) || '0.00'}</h3>
          </div>
        </div>
        <div className="col-12 col-sm-6 col-lg-3">
          <div className="card shadow-sm border-0 bg-success text-white p-3">
            <h6>Total Orders</h6>
            <h3 className="fw-bold">{stats?.total_orders || 0}</h3>
            <small>{stats?.delivered_orders || 0} Delivered</small>
          </div>
        </div>
        <div className="col-12 col-sm-6 col-lg-3">
          <div className="card shadow-sm border-0 bg-warning text-dark p-3">
            <h6>Pending Orders</h6>
            <h3 className="fw-bold">{stats?.pending_orders || 0}</h3>
            <small>Requires Attention</small>
          </div>
        </div>
        <div className="col-12 col-sm-6 col-lg-3">
          <div className="card shadow-sm border-0 bg-dark text-white p-3">
            <h6>Total Users / Products</h6>
            <h3 className="fw-bold">{stats?.total_users || 0} / {stats?.total_products || 0}</h3>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;