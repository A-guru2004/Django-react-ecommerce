import React, { Component } from 'react';
import { Link } from 'react-router-dom';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('UI Crash Error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="container py-5 text-center">
          <div className="card shadow-sm border-0 p-5 mx-auto" style={{ maxWidth: '540px' }}>
            <i className="bi bi-exclamation-triangle-fill display-3 text-warning mb-3"></i>
            <h3 className="fw-bold">Something went wrong</h3>
            <p className="text-muted">
              An unexpected client-side error occurred. Please refresh or navigate back to the home page.
            </p>
            <div className="d-flex justify-content-center gap-2 mt-3">
              <button
                className="btn btn-primary"
                onClick={() => window.location.reload()}
              >
                Refresh Page
              </button>
              <Link to="/" className="btn btn-outline-secondary" onClick={() => this.setState({ hasError: false })}>
                Back to Home
              </Link>
            </div>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;