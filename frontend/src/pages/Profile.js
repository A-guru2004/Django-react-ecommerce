import React, { useState, useEffect } from 'react';
import axiosClient from '../api/axiosClient';

const Profile = () => {
  const [profile, setProfile] = useState({
    username: '',
    email: '',
    phone_number: '',
    address: '',
    created_at: '',
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axiosClient.get('/accounts/profile/');
        setProfile({
          username: res.data.username || '',
          email: res.data.email || '',
          phone_number: res.data.phone_number || '',
          address: res.data.address || '',
          created_at: res.data.created_at || '',
        });
      } catch {
        setMessage({ text: 'Failed to load profile details.', type: 'danger' });
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage({ text: '', type: '' });
    try {
      const res = await axiosClient.put('/accounts/profile/', {
        username: profile.username,
        phone_number: profile.phone_number,
        address: profile.address,
      });
      setProfile((prev) => ({ ...prev, ...res.data }));
      setMessage({ text: 'Profile updated successfully!', type: 'success' });
    } catch {
      setMessage({ text: 'Failed to update profile.', type: 'danger' });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="text-center py-5">Loading profile...</div>;
  }

  return (
    <div className="row justify-content-center">
      <div className="col-12 col-md-8 col-lg-6">
        <div className="card shadow-sm border-0 mt-3">
          <div className="card-body p-4">
            <h3 className="card-title fw-bold mb-3">User Profile</h3>

            {message.text && (
              <div className={`alert alert-${message.type} py-2`}>{message.text}</div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label">Email (Immutable)</label>
                <input
                  type="email"
                  className="form-control bg-light"
                  value={profile.email}
                  disabled
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Username</label>
                <input
                  type="text"
                  name="username"
                  className="form-control"
                  required
                  value={profile.username}
                  onChange={handleChange}
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Phone Number</label>
                <input
                  type="text"
                  name="phone_number"
                  className="form-control"
                  value={profile.phone_number}
                  onChange={handleChange}
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Shipping Address</label>
                <textarea
                  name="address"
                  rows="3"
                  className="form-control"
                  value={profile.address}
                  onChange={handleChange}
                ></textarea>
              </div>

              <div className="mb-3 text-muted">
                <small>
                  Member since: {new Date(profile.created_at).toLocaleDateString()}
                </small>
              </div>

              <button
                type="submit"
                className="btn btn-primary w-100 py-2 fw-semibold"
                disabled={saving}
              >
                {saving ? 'Updating...' : 'Save Profile Changes'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;