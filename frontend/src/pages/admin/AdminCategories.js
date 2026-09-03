import React, { useState, useEffect } from 'react';
import axiosClient from '../../api/axiosClient';

const AdminCategories = () => {
  const [categories, setCategories] = useState([]);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchCats = async () => {
    try {
      const res = await axiosClient.get('/store/categories/');
      setCategories(res.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCats();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await axiosClient.post('/store/categories/', { name, description });
      setName('');
      setDescription('');
      fetchCats();
    } catch (err) {
      alert('Error creating category.');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete category? All linked products may be impacted.')) return;
    try {
      await axiosClient.delete(`/store/categories/${id}/`);
      fetchCats();
    } catch (err) {
      alert('Delete failed.');
    }
  };

  if (loading) return <div className="text-center py-5">Loading categories...</div>;

  return (
    <div>
      <h3 className="fw-bold mb-4">Category Management</h3>
      <div className="card shadow-sm border-0 p-4 mb-4">
        <h5 className="fw-bold mb-3">Add Category</h5>
        <form onSubmit={handleCreate}>
          <div className="row g-3">
            <div className="col-md-6">
              <input type="text" className="form-control" placeholder="Category Name" required value={name} onChange={(e) => setName(e.target.value)} />
            </div>
            <div className="col-md-6">
              <input type="text" className="form-control" placeholder="Description (Optional)" value={description} onChange={(e) => setDescription(e.target.value)} />
            </div>
            <div className="col-12">
              <button type="submit" className="btn btn-primary">Add Category</button>
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
              <th>Slug</th>
              <th>Products Count</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((c) => (
              <tr key={c.id}>
                <td>{c.id}</td>
                <td className="fw-semibold">{c.name}</td>
                <td>{c.slug}</td>
                <td>{c.products_count}</td>
                <td>
                  <button onClick={() => handleDelete(c.id)} className="btn btn-outline-danger btn-sm">
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

export default AdminCategories;