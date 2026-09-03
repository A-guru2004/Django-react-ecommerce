import React, { useState, useContext, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axiosClient from '../api/axiosClient';
import { CartContext } from '../context/CartContext';

const Checkout = () => {
  const { cart, fetchCart } = useContext(CartContext);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    shipping_address: '',
    shipping_phone: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const res = await axiosClient.get('/accounts/profile/');
        setFormData({
          shipping_address: res.data.address || '',
          shipping_phone: res.data.phone_number || '',
        });
      } catch (err) {
        console.error('Error pre-filling checkout form:', err);
      }
    };
    fetchUserData();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    setError('');

    const phoneRegex = /^[0-9+\s-]{8,15}$/;
    if (!phoneRegex.test(formData.shipping_phone.trim())) {
      setError('Please enter a valid phone number (8-15 digits).');
      return;
    }

    if (formData.shipping_address.trim().length < 10) {
      setError('Please enter a complete address (minimum 10 characters).');
      return;
    }

    setSubmitting(true);
    try {
      const res = await axiosClient.post('/orders/', {
        shipping_address: formData.shipping_address.trim(),
        shipping_phone: formData.shipping_phone.trim(),
      });
      await fetchCart();
      navigate(`/orders/${res.data.id}`, {
        state: { message: 'Your order has been placed successfully!' },
      });
    } catch (err) {
      setError(
        err.response?.data?.error ||
        err.response?.data?.detail ||
        'Failed to place order. Check stock availability.'
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (!cart.items || cart.items.length === 0) {
    return (
      <div className="alert alert-warning text-center py-4">
        Your cart is empty. Please add items to your cart before proceeding to checkout.
        <div className="mt-3">
          <Link to="/products" className="btn btn-primary btn-sm">Browse Products</Link>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h3 className="fw-bold mb-4">Checkout</h3>

      {error && <div className="alert alert-danger py-2">{error}</div>}

      <div className="row g-4">
        <div className="col-12 col-lg-7">
          <div className="card shadow-sm border-0 p-4">
            <h5 className="fw-bold mb-3">Shipping Information</h5>
            <form onSubmit={handlePlaceOrder}>
              <div className="mb-3">
                <label className="form-label">Phone Number *</label>
                <input
                  type="tel"
                  name="shipping_phone"
                  className="form-control"
                  required
                  placeholder="e.g. 9876543210"
                  value={formData.shipping_phone}
                  onChange={handleChange}
                />
                <small className="text-muted">Must be between 8 and 15 digits.</small>
              </div>

              <div className="mb-3">
                <label className="form-label">Shipping Address *</label>
                <textarea
                  name="shipping_address"
                  rows="4"
                  className="form-control"
                  required
                  placeholder="Door number, street, city, state, postal code"
                  value={formData.shipping_address}
                  onChange={handleChange}
                ></textarea>
              </div>

              <button
                type="submit"
                className="btn btn-primary w-100 py-2 fw-semibold mt-2"
                disabled={submitting}
              >
                {submitting ? 'Placing Order...' : 'Confirm & Place Order'}
              </button>
            </form>
          </div>
        </div>

        <div className="col-12 col-lg-5">
          <div className="card shadow-sm border-0 p-4">
            <h5 className="fw-bold mb-3">Order Items ({cart.total_items})</h5>
            <ul className="list-group list-group-flush mb-3">
              {cart.items.map((item) => (
                <li key={item.id} className="list-group-item d-flex justify-content-between align-items-center px-0">
                  <div>
                    <h6 className="my-0 text-truncate" style={{ maxWidth: '200px' }}>{item.product_name}</h6>
                    <small className="text-muted">Qty: {item.quantity}</small>
                  </div>
                  <span className="fw-semibold">${parseFloat(item.subtotal).toFixed(2)}</span>
                </li>
              ))}
            </ul>
            <div className="d-flex justify-content-between pt-2 border-top">
              <strong>Grand Total</strong>
              <strong className="text-primary fs-5">${parseFloat(cart.total_price).toFixed(2)}</strong>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;