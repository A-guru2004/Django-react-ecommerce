import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import axiosClient from '../api/axiosClient';
import { MOCK_PRODUCTS } from '../data/mockProducts';

const Products = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);

  // Filter & Search states from URL search params
  const categoryParam = searchParams.get('category') || '';
  const searchParam = searchParams.get('search') || '';
  const orderingParam = searchParams.get('ordering') || '-created_at';
  const pageParam = parseInt(searchParams.get('page') || '1', 10);

  const [searchInput, setSearchInput] = useState(searchParam);

  const fetchCategories = async () => {
    try {
      const res = await axiosClient.get('/store/categories/');
      setCategories(res.data || []);
    } catch (err) {
      setProducts(MOCK_PRODUCTS);
    }
  };

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (categoryParam) params.append('category', categoryParam);
      if (searchParam) params.append('search', searchParam);
      if (orderingParam) params.append('ordering', orderingParam);
      params.append('page', pageParam);

      const res = await axiosClient.get(`/store/products/?${params.toString()}`);
      setProducts(res.data.results || []);
      setTotalCount(res.data.count || 0);
    } catch (err) {
      console.error('Error fetching products:', err);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, [categoryParam, searchParam, orderingParam, pageParam]);

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const handleCategoryChange = (e) => {
    const val = e.target.value;
    const newParams = new URLSearchParams(searchParams);
    if (val) newParams.set('category', val);
    else newParams.delete('category');
    newParams.set('page', '1');
    setSearchParams(newParams);
  };

  const handleOrderingChange = (e) => {
    const val = e.target.value;
    const newParams = new URLSearchParams(searchParams);
    newParams.set('ordering', val);
    newParams.set('page', '1');
    setSearchParams(newParams);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const newParams = new URLSearchParams(searchParams);
    if (searchInput.trim()) newParams.set('search', searchInput.trim());
    else newParams.delete('search');
    newParams.set('page', '1');
    setSearchParams(newParams);
  };

  const handleClearFilters = () => {
    setSearchInput('');
    setSearchParams({});
  };

  const handlePageChange = (newPage) => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set('page', newPage);
    setSearchParams(newParams);
  };

  const totalPages = Math.ceil(totalCount / 8);

  return (
    <div>
      <h3 className="fw-bold mb-4">Product Catalog</h3>

      {/* Filter and Search Bar */}
      <div className="card shadow-sm border-0 mb-4 p-3 bg-white">
        <div className="row g-2 align-items-center">
          <div className="col-12 col-md-4">
            <form onSubmit={handleSearchSubmit} className="d-flex">
              <input
                type="text"
                className="form-control me-2"
                placeholder="Search products..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
              />
              <button className="btn btn-outline-primary" type="submit">
                <i className="bi bi-search"></i>
              </button>
            </form>
          </div>

          <div className="col-6 col-md-3">
            <select
              className="form-select"
              value={categoryParam}
              onChange={handleCategoryChange}
            >
              <option value="">All Categories</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <div className="col-6 col-md-3">
            <select
              className="form-select"
              value={orderingParam}
              onChange={handleOrderingChange}
            >
              <option value="-created_at">Latest First</option>
              <option value="price">Price: Low to High</option>
              <option value="-price">Price: High to Low</option>
              <option value="name">Name: A to Z</option>
            </select>
          </div>

          <div className="col-12 col-md-2">
            <button
              onClick={handleClearFilters}
              className="btn btn-outline-secondary w-100"
            >
              Reset Filters
            </button>
          </div>
        </div>
      </div>

      {/* Product Grid */}
      {loading ? (
        <div className="text-center py-5">Loading catalog...</div>
      ) : products.length === 0 ? (
        <div className="alert alert-warning">No products matched your criteria.</div>
      ) : (
        <>
          <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 g-4">
            {products.map((p) => (
              <div key={p.id} className="col">
                <div className="card h-100 shadow-sm border-0">
                  {p.image ? (
                    <img
                      src={`http://127.0.0.1:8000${p.image}`}
                      className="card-img-top p-3"
                      alt={p.name}
                      style={{ height: '200px', objectFit: 'contain' }}
                    />
                  ) : (
                    <div
                      className="bg-light d-flex align-items-center justify-content-center text-muted"
                      style={{ height: '200px' }}
                    >
                      No Image
                    </div>
                  )}
                  <div className="card-body d-flex flex-column">
                    <span className="text-muted small">{p.category_name}</span>
                    <h6 className="card-title fw-bold text-truncate mt-1">{p.name}</h6>
                    <h5 className="text-primary my-2">${parseFloat(p.price).toFixed(2)}</h5>
                    <p className="text-muted small text-truncate">{p.description}</p>
                    <Link
                      to={`/products/${p.id}`}
                      className="btn btn-outline-primary btn-sm mt-auto"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <nav className="mt-4">
              <ul className="pagination justify-content-center">
                <li className={`page-item ${pageParam <= 1 ? 'disabled' : ''}`}>
                  <button
                    className="page-link"
                    onClick={() => handlePageChange(pageParam - 1)}
                  >
                    Previous
                  </button>
                </li>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((num) => (
                  <li
                    key={num}
                    className={`page-item ${num === pageParam ? 'active' : ''}`}
                  >
                    <button
                      className="page-link"
                      onClick={() => handlePageChange(num)}
                    >
                      {num}
                    </button>
                  </li>
                ))}
                <li className={`page-item ${pageParam >= totalPages ? 'disabled' : ''}`}>
                  <button
                    className="page-link"
                    onClick={() => handlePageChange(pageParam + 1)}
                  >
                    Next
                  </button>
                </li>
              </ul>
            </nav>
          )}
        </>
      )}
    </div>
  );
};

export default Products;