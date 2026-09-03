import React, { useState, useEffect, useCallback } from 'react';
import axiosClient from '../../api/axiosClient';

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
    name: '',
    category: '',
    price: '',
    stock: '',
    description: '',
    image: null,
  });
  const [msg, setMsg] = useState('');

  const loadData = useCallback(async () => {
    try {
      const [prodRes, catRes] = await Promise.all([
        axiosClient.get('/store/products/?page_size=100'),
        axiosClient.get('/store/categories/'),
      ]);
      setProducts(prodRes.data.results || []);
      setCategories(catRes.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleInputChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'image') {
      setForm({ ...form, image: files[0] });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleCreateProduct = async (e) => {
    e.preventDefault();
    setMsg('');
    const data = new FormData();
    data.append('name', form.name);
    data.append('category', form.category);
    data.append('price', form.price);
    data.append('stock', form.stock);
    data.append('description', form.description);
    if (form.image) {
      data.append('image', form.image);
    }

    try {
      await axiosClient.post('/store/products/', data, {
        headers: {
          'Content-Type': undefined, // Lets Axios/browser set multipart boundary automatically
        },
      });
      setMsg('Product added successfully!');
      setForm({ name: '', category: '', price: '', stock: '', description: '', image: null });
      loadData();
    } catch (err) {
      const errorMsg = err.response?.data ? JSON.stringify(err.response.data) : 'Failed to add product.';
      setMsg(`Error: ${errorMsg}`);
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    try {
      await axiosClient.delete(`/store/products/${id}/`);
      loadData();
    } catch (err) {
      alert('Delete failed.');
    }
  };

  if (loading) return <div className="text-center py-5">Loading products...</div>;

  return (
    <div>
      <h3 className="fw-bold mb-4">Product Management</h3>
      {msg && <div className="alert alert-info py-2">{msg}</div>}

      <div className="card shadow-sm border-0 p-4 mb-4">
        <h5 className="fw-bold mb-3">Add New Product</h5>
        <form onSubmit={handleCreateProduct}>
          <div className="row g-3">
            <div className="col-md-6">
              <label className="form-label">Name</label>
              <input type="text" name="name" className="form-control" required value={form.name} onChange={handleInputChange} />
            </div>
            <div className="col-md-6">
              <label className="form-label">Category</label>
              <select name="category" className="form-select" required value={form.category} onChange={handleInputChange}>
                <option value="">Select Category</option>
                {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
            <div className="col-md-4">
              <label className="form-label">Price ($)</label>
              <input type="number" step="0.01" name="price" className="form-control" required value={form.price} onChange={handleInputChange} />
            </div>
            <div className="col-md-4">
              <label className="form-label">Stock</label>
              <input type="number" name="stock" className="form-control" required value={form.stock} onChange={handleInputChange} />
            </div>
            <div className="col-md-4">
              <label className="form-label">Product Image</label>
              <input type="file" name="image" className="form-control" accept="image/*" onChange={handleInputChange} />
            </div>
            <div className="col-12">
              <label className="form-label">Description</label>
              <textarea name="description" rows="2" className="form-control" required value={form.description} onChange={handleInputChange}></textarea>
            </div>
            <div className="col-12">
              <button type="submit" className="btn btn-primary">Save Product</button>
            </div>
          </div>
        </form>
      </div>

      <div className="table-responsive bg-white rounded shadow-sm">
        <table className="table align-middle mb-0">
          <thead className="table-light">
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Category</th>
              <th>Price</th>
              <th>Stock</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p.id}>
                <td>{p.id}</td>
                <td className="fw-semibold">{p.name}</td>
                <td>{p.category_name}</td>
                <td>${parseFloat(p.price).toFixed(2)}</td>
                <td>{p.stock}</td>
                <td>
                  <button onClick={() => handleDelete(p.id)} className="btn btn-outline-danger btn-sm">
                    <i className="bi bi-trash"></i>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminProducts;