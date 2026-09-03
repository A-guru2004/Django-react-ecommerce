import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axiosClient from '../api/axiosClient';
import { CartContext } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const { addToCart } = useContext(CartContext);

  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [feedback, setFeedback] = useState({ text: '', type: '' });

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        const res = await axiosClient.get(`/store/products/${id}/`);
        setProduct(res.data);
      } catch (err) {
        console.error('Error fetching product:', err);
        setFeedback({ text: 'Product not found.', type: 'danger' });
      } finally {
        setLoading(false);
      }
    };
    fetchDetail();
  }, [id]);

  const handleAddToCart = async () => {
    if (!user) {
      navigate('/login', { state: { from: { pathname: `/products/${id}` } } });
      return;
    }
    setAdding(true);
    setFeedback({ text: '', type: '' });
    try {
      await addToCart(product.id, quantity);
      setFeedback({ text: 'Product added to cart!', type: 'success' });
    } catch (err) {
      setFeedback({
        text: err.response?.data?.error || 'Failed to add item to cart.',
        type: 'danger',
      });
    } finally {
      setAdding(false);
    }
  };

  if (loading) return <div className="text-center py-5">Loading product details...</div>;
  if (!product) return <div className="alert alert-danger">Product could not be loaded.</div>;

  return (
    <div className="card shadow-sm border-0 p-4">
      <div className="row g-4">
        {/* Product Image */}
        <div className="col-12 col-md-5 d-flex align-items-center justify-content-center border-end">
          {product.image ? (
            <img
              src={`http://127.0.0.1:8000${product.image}`}
              alt={product.name}
              className="img-fluid rounded"
              style={{ maxHeight: '350px', objectFit: 'contain' }}
            />
          ) : (
            <div className="text-muted p-5 bg-light rounded text-center w-100">
              No Image Available
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="col-12 col-md-7">
          <span className="badge bg-secondary mb-2">{product.category_name}</span>
          <h2 className="fw-bold">{product.name}</h2>
          <h3 className="text-primary my-3">${parseFloat(product.price).toFixed(2)}</h3>

          <p className="text-muted">{product.description}</p>
          <hr />

          <div className="mb-3">
            <strong>Stock Status: </strong>
            {product.stock > 0 ? (
              <span className="text-success">{product.stock} available</span>
            ) : (
              <span className="text-danger">Out of stock</span>
            )}
          </div>

          {feedback.text && (
            <div className={`alert alert-${feedback.type} py-2`}>{feedback.text}</div>
          )}

          {product.stock > 0 && (
            <div className="d-flex align-items-center gap-3 mt-4">
              <div style={{ width: '100px' }}>
                <input
                  type="number"
                  className="form-control"
                  min="1"
                  max={product.stock}
                  value={quantity}
                  onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value || '1', 10)))}
                />
              </div>

              <button
                className="btn btn-primary px-4 py-2"
                onClick={handleAddToCart}
                disabled={adding}
              >
                <i className="bi bi-cart-plus me-2"></i>
                {adding ? 'Adding...' : 'Add to Cart'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;