import React, { useState, useEffect } from 'react';
import { useParams, Link, useLocation } from 'react-router-dom';
import axiosClient from '../api/axiosClient';

const OrderDetail = () => {
  const { id } = useParams();
  const location = useLocation();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrderDetail = async () => {
      try {
        const res = await axiosClient.get(`/orders/${id}/`);
        setOrder(res.data);
      } catch (err) {
        console.error('Error fetching order details:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrderDetail();
  }, [id]);

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

  if (loading) return <div className="text-center py-5">Loading order details...</div>;
  if (!order) return <div className="alert alert-danger">Order details not found.</div>;

  return (
    <div>
      {location.state?.message && (
        <div className="alert alert-success py-3 mb-4">
          <i className="bi bi-check-circle-fill me-2"></i>
          {location.state.message}
        </div>
      )}

      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h3 className="fw-bold mb-0">Order #{order.id}</h3>
          <small className="text-muted">
            Placed on {new Date(order.created_at).toLocaleString()}
          </small>
        </div>
        <span className={`badge fs-6 ${getStatusBadge(order.status)}`}>{order.status}</span>
      </div>

      <div className="row g-4">
        {/* Order Items */}
        <div className="col-12 col-lg-8">
          <div className="card shadow-sm border-0">
            <div className="table-responsive">
              <table className="table align-middle mb-0">
                <thead className="table-light">
                  <tr>
                    <th>Product</th>
                    <th>Price</th>
                    <th>Qty</th>
                    <th>Subtotal</th>
                  </tr>
                </thead>
                <tbody>
                  {order.items.map((item) => (
                    <tr key={item.id}>
                      <td>
                        <div className="d-flex align-items-center">
                          {item.product_image ? (
                            <img
                              src={`http://127.0.0.1:8000${item.product_image}`}
                              alt={item.product_name}
                              style={{ width: '45px', height: '45px', objectFit: 'contain' }}
                              className="me-3 rounded"
                            />
                          ) : (
                            <div
                              className="bg-light text-muted d-flex align-items-center justify-content-center me-3 rounded"
                              style={{ width: '45px', height: '45px', fontSize: '9px' }}
                            >
                              No Image
                            </div>
                          )}
                          <span className="fw-semibold">{item.product_name}</span>
                        </div>
                      </td>
                      <td>${parseFloat(item.price).toFixed(2)}</td>
                      <td>{item.quantity}</td>
                      <td className="fw-bold text-primary">
                        ${(parseFloat(item.price) * item.quantity).toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Shipping & Payment Summary */}
        <div className="col-12 col-lg-4">
          <div className="card shadow-sm border-0 p-4 mb-3">
            <h5 className="fw-bold mb-3">Delivery Information</h5>
            <p className="mb-1 text-muted small">Recipient Contact:</p>
            <p className="fw-semibold mb-3">{order.shipping_phone}</p>

            <p className="mb-1 text-muted small">Shipping Address:</p>
            <p className="fw-semibold mb-0" style={{ whiteSpace: 'pre-line' }}>
              {order.shipping_address}
            </p>
          </div>

          <div className="card shadow-sm border-0 p-4">
            <h5 className="fw-bold mb-3">Payment Summary</h5>
            <div className="d-flex justify-content-between mb-2">
              <span className="text-muted">Total Amount:</span>
              <span className="fw-bold text-primary fs-5">
                ${parseFloat(order.total_amount).toFixed(2)}
              </span>
            </div>
            <Link to="/orders" className="btn btn-outline-secondary w-100 mt-3">
              Back to My Orders
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetail;