import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CartContext } from '../context/CartContext';

const Cart = () => {
  const { cart, updateCartItem, removeCartItem, cartLoading } = useContext(CartContext);
  const navigate = useNavigate();

  if (cartLoading) {
    return <div className="text-center py-5">Loading your cart...</div>;
  }

  if (!cart.items || cart.items.length === 0) {
    return (
      <div className="text-center py-5">
        <i className="bi bi-cart-x display-1 text-muted"></i>
        <h3 className="mt-3">Your Cart is Empty</h3>
        <p className="text-muted">Looks like you haven't added any products yet.</p>
        <Link to="/products" className="btn btn-primary mt-2">
          Start Shopping
        </Link>
      </div>
    );
  }

  return (
    <div>
      <h3 className="fw-bold mb-4">Shopping Cart ({cart.total_items} items)</h3>
      <div className="row g-4">
        {/* Cart Items Table */}
        <div className="col-12 col-lg-8">
          <div className="card shadow-sm border-0">
            <div className="table-responsive">
              <table className="table align-middle mb-0">
                <thead className="table-light">
                  <tr>
                    <th>Product</th>
                    <th>Price</th>
                    <th style={{ width: '140px' }}>Quantity</th>
                    <th>Subtotal</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {cart.items.map((item) => (
                    <tr key={item.id}>
                      <td>
                        <div className="d-flex align-items-center">
                          {item.product_image ? (
                            <img
                              src={`http://127.0.0.1:8000${item.product_image}`}
                              alt={item.product_name}
                              style={{ width: '50px', height: '50px', objectFit: 'contain' }}
                              className="me-3 rounded"
                            />
                          ) : (
                            <div
                              className="bg-light text-muted d-flex align-items-center justify-content-center me-3 rounded"
                              style={{ width: '50px', height: '50px', fontSize: '10px' }}
                            >
                              No Image
                            </div>
                          )}
                          <Link to={`/products/${item.product}`} className="text-decoration-none fw-semibold text-dark">
                            {item.product_name}
                          </Link>
                        </div>
                      </td>
                      <td>${parseFloat(item.product_price).toFixed(2)}</td>
                      <td>
                        <div className="input-group input-group-sm">
                          <button
                            className="btn btn-outline-secondary"
                            onClick={() => updateCartItem(item.id, item.quantity - 1)}
                            disabled={item.quantity <= 1}
                          >
                            -
                          </button>
                          <span className="form-control text-center bg-white">{item.quantity}</span>
                          <button
                            className="btn btn-outline-secondary"
                            onClick={() => updateCartItem(item.id, item.quantity + 1)}
                            disabled={item.quantity >= item.product_stock}
                          >
                            +
                          </button>
                        </div>
                      </td>
                      <td className="fw-bold text-primary">${parseFloat(item.subtotal).toFixed(2)}</td>
                      <td>
                        <button
                          onClick={() => removeCartItem(item.id)}
                          className="btn btn-outline-danger btn-sm"
                          title="Remove item"
                        >
                          <i className="bi bi-trash"></i>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Cart Summary */}
        <div className="col-12 col-lg-4">
          <div className="card shadow-sm border-0 p-4">
            <h5 className="fw-bold mb-3">Order Summary</h5>
            <div className="d-flex justify-content-between mb-2">
              <span className="text-muted">Total Items:</span>
              <span className="fw-semibold">{cart.total_items}</span>
            </div>
            <div className="d-flex justify-content-between mb-3">
              <span className="text-muted">Total Price:</span>
              <span className="fw-bold text-primary fs-5">${parseFloat(cart.total_price).toFixed(2)}</span>
            </div>
            <hr />
            <button
              onClick={() => navigate('/checkout')}
              className="btn btn-primary w-100 py-2 fw-semibold"
            >
              Proceed to Checkout
            </button>
            <Link to="/products" className="btn btn-outline-secondary w-100 mt-2">
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;