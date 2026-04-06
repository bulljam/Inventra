# Inventory Management System

A full-stack inventory app for managing products, suppliers, purchases, sales, and high-level business analytics.

## Preview

### Dashboard
![Dashboard](frontend/src/assets/home.png)

### Products
![Products](frontend/src/assets/products.png)

### Analytics
![Analytics](frontend/src/assets/analytics.png)

## Highlights

- Product, supplier, purchase, and sales management
- Revenue and inventory analytics
- Role-based authentication
- Local image uploads
- Responsive React frontend with a Node/Express API

## Stack

- Frontend: React, Vite, Tailwind CSS, Framer Motion
- Backend: Node.js, Express, MongoDB, Mongoose

## Quick Start

1. Install dependencies:

```bash
cd backend
pnpm install

cd ../frontend
pnpm install
```

2. Create environment files from the examples:

- `backend/.env.example`
- `frontend/.env.example`

3. Start the backend:

```bash
cd backend
pnpm run dev
```

4. Start the frontend:

```bash
cd frontend
pnpm run dev
```

## Seed Data

Reset and seed the database with one command:

```bash
cd backend
pnpm run seed
```

## Scripts

### Backend

- `pnpm run dev`
- `pnpm start`
- `pnpm run seed`
- `pnpm run migrate-purchases`

### Frontend

- `pnpm run dev`
- `pnpm run build`
- `pnpm run preview`
- `pnpm run lint`

## Notes

- Backend uploads are stored in `backend/uploads/`
- The backend API runs on `http://localhost:3000` by default
- The frontend expects `VITE_API_BASE_URL` to point to the backend API
