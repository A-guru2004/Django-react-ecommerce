import React, { useState, useEffect } from 'react';
import axiosClient from '../../api/axiosClient';

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    try {
      const res = await axiosClient.get('/orders/admin/all/');
      setOrders(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await axiosClient.patch(`/orders/admin/${orderId}/status/`, { status: newStatus });
      fetchOrders();
    } catch (err) {
      alert('Failed to update order status');
    }
  };

  if (loading) return <div className="text-center py-5">Loading orders...</div>;

  return (
    <div>
      <h3 className="fw-bold mb-4">Customer Orders Management</h3>
      <div className="table-responsive bg-white rounded shadow-sm">
        <table className="table align-middle mb-0">
          <thead className="table-light">
            <tr>
              <th>Order ID</th>
              <th>User</th>
              <th>Total</th>
              <th>Placed At</th>
              <th>Status</th>
              <th>Change Status</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((o) => (
              <tr key={o.id}>
                <td className="fw-bold">#{o.id}</td>
                <td>{o.user_email}</td>
                <td className="text-primary fw-semibold">${parseFloat(o.total_amount).toFixed(2)}</td>
                <td>{new Date(o.created_at).toLocaleDateString()}</td>
                <td><span className="badge bg-secondary">{o.status}</span></td>
                <td>
                  <select
                    className="form-select form-select-sm"
                    value={o.status}
                    onChange={(e) => handleStatusChange(o.id, e.target.value)}
                  >
                    <option value="Pending">Pending</option>
                    <option value="Processing">Processing</option>
                    <option value="Shipped">Shipped</option>
                    <option value="Delivered">Delivered</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminOrders;