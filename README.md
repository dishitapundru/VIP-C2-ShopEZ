# ShopEZ - Premium MERN E-Commerce Platform

A fully functional, production-ready MERN stack e-commerce web application with modern UI/UX, built with React, Node.js, Express, and MongoDB.

## Features

- **Modern UI**: Glassmorphism, animations, responsive design.
- **Authentication**: JWT-based login/registration, role-based access.
- **Product Management**: Full CRUD operations.
- **Order Management**: Shopping cart, checkout, order history.
- **Admin Dashboard**: Manage products and orders.

## Tech Stack

- **Frontend**: React.js, React Router DOM, Tailwind CSS (v4), Framer Motion, Axios.
- **Backend**: Node.js, Express.js, MongoDB, Mongoose, JWT, bcryptjs.

## Setup Instructions

### 1. Clone the repository
```bash
git clone <your-repo-url>
cd "Shop E-Com"
```

### 2. Backend Setup
```bash
cd server
npm install
```
- Rename `.env.example` to `.env` and fill in your MongoDB connection string and JWT secret.
- Start the server:
```bash
npm run dev
```

### 3. Frontend Setup
Open a new terminal window:
```bash
cd client
npm install
npm run dev
```

## Deployment

This project is configured for easy deployment.

### Frontend (Vercel / Netlify)
- The `client` directory contains `vercel.json` for proper client-side routing on Vercel.
- Simply import the `client` folder into your Vercel or Netlify dashboard.
- Set the build command to `npm run build` and output directory to `dist`.

### Backend (Render / Railway)
- The root directory contains `render.yaml` for Render deployment.
- Simply connect your repository to Render, and it will automatically detect the configuration.
- Make sure to add `MONGO_URI` and `JWT_SECRET` in your hosting provider's environment variables dashboard.
