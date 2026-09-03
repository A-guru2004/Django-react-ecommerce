import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axiosClient from '../api/axiosClient';
import { MOCK_PRODUCTS } from '../data/mockProducts';

const Home = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isDemoMode, setIsDemoMode] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [prodRes, catRes] = await Promise.all([
          axiosClient.get('/store/products/?page=1'),
          axiosClient.get('/store/categories/'),
        ]);
        setFeaturedProducts(prodRes.data.results ? prodRes.data.results.slice(0, 4) : []);
        setCategories(catRes.data || []);
      } catch (err) {
        console.warn('Backend unavailable. Activating demo prototype mode.');
        setIsDemoMode(true);
        // Backend கிடைக்காததால் Mock Data தானாகவே லோட் ஆகிறது:
        setFeaturedProducts(MOCK_PRODUCTS.slice(0, 4));
        setCategories([
          { id: 1, name: 'Electronics', products_count: 3 },
          { id: 2, name: 'Fashion', products_count: 1 },
          { id: 3, name: 'Home & Office', products_count: 1 }
        ]);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div>
      {/* Demo Prototype Indicator */}
      {isDemoMode && (
        <div className="alert alert-primary py-2 text-center my-2 shadow-sm">
          ⚡ <strong>Interactive Prototype:</strong> Running client-side preview with sample catalog.
        </div>
      )}

      {/* Hero Banner with Dark Overlay & High-Res Background */}
      <div 
      className="p-5 mb-5 rounded-4 text-center text-white shadow-lg position-relative overflow-hidden"
       style={{
      backgroundImage: `linear-gradient(rgba(15, 23, 42, 0.75), rgba(15, 23, 42, 0.75)), url('https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1600&q=80')`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      padding: '80px 20px'
      }}
     >
  <span className="badge bg-primary px-3 py-2 rounded-pill text-uppercase tracking-wide mb-3">
    Summer Collection 2026
  </span>
  <h1 className="display-4 fw-extrabold mb-3">Shop the Latest Tech & Essentials</h1>
  <p className="lead text-light-50 mx-auto mb-4" style={{ maxWidth: '650px', opacity: 0.9 }}>
    Discover top-tier electronics, sleek desk accessories, and modern lifestyle essentials curated for you.
  </p>
  <Link to="/products" className="btn btn-primary btn-lg px-5 py-3 fw-bold rounded-pill shadow">
    Explore Collection <i className="bi bi-arrow-right ms-2"></i>
  </Link>
</div>
 

      {/* Categories Bar */}
      {categories.length > 0 && (
        <div className="mb-5">
          <h4 className="fw-bold mb-3">Shop by Category</h4>
          <div className="d-flex flex-wrap gap-2">
            {categories.map((cat) => (
              <Link
                key={cat.id}
                to={`/products?category=${cat.id}`}
                className="btn btn-outline-secondary"
              >
                {cat.name} ({cat.products_count})
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Featured Products */}
      <div>
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h4 className="fw-bold">Latest Arrivals</h4>
          <Link to="/products" className="text-decoration-none">
            View All <i className="bi bi-arrow-right"></i>
          </Link>
        </div>

        {loading ? (
          <div className="text-center py-5">Loading products...</div>
        ) : featuredProducts.length === 0 ? (
          <div className="alert alert-info">No products found. Add some from Django Admin.</div>
        ) : (
          <div className="row row-cols-1 row-cols-sm-2 row-cols-md-4 g-4">
            {featuredProducts.map((p) => {
              // Image URL fix: Online images (http/https) vs Local Django media paths
              const imageUrl = p.image 
                ? (p.image.startsWith('http') ? p.image : `http://127.0.0.1:8000${p.image}`)
                : null;

              return (
                <div key={p.id} className="col">
                  <div className="card h-100 shadow-sm border-0">
                    {imageUrl ? (
                      <img
                        src={imageUrl}
                        className="card-img-top p-3"
                        alt={p.name}
                        style={{ height: '180px', objectFit: 'contain' }}
                      />
                    ) : (
                      <div
                        className="bg-light d-flex align-items-center justify-content-center text-muted"
                        style={{ height: '180px' }}
                      >
                        No Image
                      </div>
                    )}
                    <div className="card-body d-flex flex-column">
                      <span className="text-muted small mb-1">
                        {p.category_name || p.category?.name || 'General'}
                      </span>
                      <h6 className="card-title fw-bold text-truncate">{p.name}</h6>
                      <h5 className="text-primary mt-auto">${parseFloat(p.price).toFixed(2)}</h5>
                      <Link to={`/products/${p.id}`} className="btn btn-outline-primary btn-sm mt-2">
                        View Details
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;