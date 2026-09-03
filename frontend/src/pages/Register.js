import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axiosClient from '../api/axiosClient';

const Register = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirm_password: '',
    phone_number: '',
    address: '',
  });

  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    setSubmitting(true);

    if (formData.password !== formData.confirm_password) {
      setErrors({ confirm_password: ['Passwords do not match.'] });
      setSubmitting(false);
      return;
    }

    try {
      await axiosClient.post('/accounts/register/', formData);
      navigate('/login', {
        state: { message: 'Registration successful! Please login.' },
      });
    } catch (err) {
      console.error('Registration API Error:', err.response?.data || err.message);
      if (err.response?.data) {
        if (typeof err.response.data === 'object') {
          setErrors(err.response.data);
        } else {
          setErrors({ general: ['Registration failed. Server error.'] });
        }
      } else {
        setErrors({ general: ['Cannot connect to backend server. Make sure Django runserver is running.'] });
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="row justify-content-center">
      <div className="col-12 col-md-7 col-lg-6">
        <div className="card shadow-sm border-0 my-3">
          <div className="card-body p-4">
            <h3 className="card-title text-center mb-4 fw-bold">Create an Account</h3>

            {errors.general && (
              <div className="alert alert-danger py-2">{errors.general[0]}</div>
            )}
            {errors.non_field_errors && (
              <div className="alert alert-danger py-2">{errors.non_field_errors[0]}</div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label">Username</label>
                <input
                  type="text"
                  name="username"
                  className={`form-control ${errors.username ? 'is-invalid' : ''}`}
                  required
                  value={formData.username}
                  onChange={handleChange}
                />
                {errors.username && <div className="invalid-feedback">{errors.username[0]}</div>}
              </div>

              <div className="mb-3">
                <label className="form-label">Email Address</label>
                <input
                  type="email"
                  name="email"
                  className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                  required
                  value={formData.email}
                  onChange={handleChange}
                />
                {errors.email && <div className="invalid-feedback">{errors.email[0]}</div>}
              </div>

              <div className="row">
                <div className="col-md-6 mb-3">
                  <label className="form-label">Password</label>
                  <input
                    type="password"
                    name="password"
                    className={`form-control ${errors.password ? 'is-invalid' : ''}`}
                    required
                    value={formData.password}
                    onChange={handleChange}
                  />
                  {errors.password && <div className="invalid-feedback">{errors.password[0]}</div>}
                </div>
                <div className="col-md-6 mb-3">
                  <label className="form-label">Confirm Password</label>
                  <input
                    type="password"
                    name="confirm_password"
                    className={`form-control ${errors.confirm_password ? 'is-invalid' : ''}`}
                    required
                    value={formData.confirm_password}
                    onChange={handleChange}
                  />
                  {errors.confirm_password && (
                    <div className="invalid-feedback">{errors.confirm_password[0]}</div>
                  )}
                </div>
              </div>

              <div className="mb-3">
                <label className="form-label">Phone Number (Optional)</label>
                <input
                  type="text"
                  name="phone_number"
                  className="form-control"
                  value={formData.phone_number}
                  onChange={handleChange}
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Shipping Address (Optional)</label>
                <textarea
                  name="address"
                  rows="2"
                  className="form-control"
                  value={formData.address}
                  onChange={handleChange}
                ></textarea>
              </div>

              <button
                type="submit"
                className="btn btn-primary w-100 py-2 fw-semibold"
                disabled={submitting}
              >
                {submitting ? 'Registering...' : 'Register'}
              </button>
            </form>

            <div className="text-center mt-3">
              <small className="text-muted">
                Already registered?{' '}
                <Link to="/login" className="text-decoration-none">
                  Login here
                </Link>
              </small>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;