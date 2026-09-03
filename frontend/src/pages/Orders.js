import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axiosClient from '../api/axiosClient';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await axiosClient.get('/orders/');
        setOrders(res.data);
      } catch (err) {
        console.error('Error fetching orders:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Delivered':
        return 'bg-success';
      case 'Shipped':
        return 'bg-primary';
      case 'Processing':
        return 'bg-info text-dark';
      case 'Cancelled':
        return 'bg-danger';
      default:
        return 'bg-warning text-dark';
    }
  };

  if (loading) return <div className="text-center py-5">Loading your orders...</div>;

  return (
    <div>
      <h3 className="fw-bold mb-4">My Order History</h3>

      {orders.length === 0 ? (
        <div className="text-center py-5">
          <i className="bi bi-box-seam display-1 text-muted"></i>
          <h4 className="mt-3">No orders placed yet</h4>
          <p className="text-muted">Explore our catalog and place your first order.</p>
          <Link to="/products" className="btn btn-primary mt-2">
            Browse Products
          </Link>
        </div>
      ) : (
        <div className="table-responsive">
          <table className="table table-hover align-middle shadow-sm bg-white rounded">
            <thead className="table-light">
              <tr>
                <th>Order ID</th>
                <th>Date</th>
                <th>Items</th>
                <th>Total</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((ord) => (
                <tr key={ord.id}>
                  <td className="fw-semibold">#{ord.id}</td>
                  <td>{new Date(ord.created_at).toLocaleDateString()}</td>
                  <td>{ord.items.length} item(s)</td>
                  <td className="fw-bold text-primary">${parseFloat(ord.total_amount).toFixed(2)}</td>
                  <td>
                    <span className={`badge ${getStatusBadge(ord.status)}`}>{ord.status}</span>
                  </td>
                  <td>
                    <Link to={`/orders/${ord.id}`} className="btn btn-outline-primary btn-sm">
                      View Details
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Orders;