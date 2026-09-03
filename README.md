# Full-Stack E-Commerce Web Application

A full-stack, responsive E-Commerce platform built with React.js, Django REST Framework, and PostgreSQL.

## Features

### Customer
- JWT-based authentication (Register, Login, Token Refresh)
- Product browsing with search, category filtering, and price sorting
- Server-side pagination
- Cart management (Add, update quantity, remove)
- Checkout workflow with automated stock decrement
- User order history and order detail tracking
- User profile update

### Admin
- Dedicated admin dashboard with revenue, order, and user metrics
- Product CRUD operations with image support
- Category management
- Order fulfillment status management (Pending, Processing, Shipped, Delivered, Cancelled)

## Tech Stack
- **Frontend**: React.js, React Router v6, Axios, Bootstrap 5, Bootstrap Icons
- **Backend**: Python, Django, Django REST Framework, SimpleJWT, django-cors-headers
- **Database**: PostgreSQL
- **Storage**: Django Media storage for product images

## Project Setup

### 1. Backend Setup
```bash
cd backend
python -m venv venv
# Windows:
venv\Scripts\activate
# macOS/Linux:
# source venv/bin/activate

pip install -r requirements.txt