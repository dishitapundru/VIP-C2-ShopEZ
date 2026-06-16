<div align="center">

# 🛍️ ShopEZ

### A Full-Stack Indian E-Commerce Web Application

**Built with the MERN Stack · Premium UI  · Admin Dashboard**

</div>

---

## 🧩 What is ShopEZ?

**ShopEZ** is a production-ready Indian e-commerce platform inspired by Amazon India, Flipkart, and Myntra. It features a premium UI, full user authentication, a powerful admin dashboard, smart cart & checkout flow — all built on the **MERN stack**.

---

## ✨ Key Highlights

- 🔐 **JWT Authentication** with role-based access (User & Admin)
- 🛒 **Full Cart & Checkout Flow** with cash-on-delivery support
- 📊 **Admin Analytics Dashboard** with live stats and charts
- 📦 **Full Product CRUD** with multi-image upload support
- 🎨 **Framer Motion** animations for a smooth, premium feel

---

## 🎨 Frontend

**Tech Stack**

| Tool | Purpose |
|---|---|
| **React 18** | UI framework |
| **Vite** | Fast build tool & dev server |
| **Tailwind CSS v4** | Utility-first styling |
| **Framer Motion** | Smooth animations & transitions |
| **Axios** | HTTP requests to backend API |
| **React Router v6** | Page navigation & routing |
| **Lucide React** | Icons (cart, heart, star, etc.) |
| **react-hot-toast** | Toast notification popups |
| **Chart.js / react-chartjs-2** | Analytics charts for Admin Dashboard |

---

### 🌐 Pages & Features

#### 🏠 Home Page
- **Hero Banner** — Full-width promotional banner
- **Shop by Category** — Quick access to Men, Women, Kids, Electronics & more
- **Flash Sales** — Highlights products with active discount prices
- **Trending Right Now** — Top-rated and featured products

#### 🛒 Products Page
- **Live Search** — Find items instantly as you type
- **Dynamic Filters** — Filter by Category and Gender
- **Sorting** — By Popular, New Arrivals, Price Low→High, Price High→Low

#### 📦 Product Details
- **Image Gallery** — Multiple high-resolution images per product
- **Detailed Info** — Specifications, Key Features, Brand, Stock status, and dynamic pricing
- **Actions** — Quantity controls, Add to Cart, Buy Now, and Wishlist toggle

#### 🛍️ Cart & Checkout
- **Cart** — Live order summary, quantity controls, and total calculation with delivery fee logic
- **Checkout** — Collects shipping address and places cash-on-delivery orders securely
- **Success Screen** — Confirmation page after a successful order

#### ❤️ Wishlist & 🔐 Authentication
- **Wishlist** — Save products for later
- **Login / Register** — Premium split-screen auth pages with JWT stored in `localStorage`; Admins are automatically redirected to the Dashboard on login


---

## 🛡️ Admin Panel

> Exclusively accessible to users with the `ADMIN` role.

**Admin Credentials**
```
Email:    admin@shopez.com
Password: Admin123
```

| Feature | Description |
|---|---|
| **Dashboard Analytics** | Live stats — Total Revenue, Orders, Users, Products |
| **Order Status Overview** | Pending, Delivered, and Cancelled counts at a glance |
| **Users Management** | View all registered users, their roles, and details |
| **Products Management** | Full CRUD — Add, Edit, or Delete products |
| **Multi-Image Upload** | Admins can upload multiple real images when adding products |
| **Orders Management** | Search, track, and update order statuses (e.g., Pending → Shipped) |

---

## ⚙️ Backend

**Tech Stack**

| Tool | Purpose |
|---|---|
| **Node.js + Express.js** | Web server & API routing |
| **MongoDB + Mongoose** | NoSQL database & object modeling |
| **JWT** | Secure token-based authentication |
| **bcryptjs** | Password hashing |
| **Multer** | Handling multipart/form-data for image uploads |

---

### 🗂️ Database Models

**`User.js`**
Stores `name`, `email`, hashed `password`, and `role` (`USER` or `ADMIN`).

**`Product.js`**
Stores `title`, `brand`, `category`, `gender`, `price`, `discountPrice`, `stock`, `description`, `features` (array), `specifications` (key-value), and `images` (array of URLs).

**`Order.js`**
Stores `user` reference, array of `products`, `shippingAddress`, `totalAmount`, and `status` (Pending, Confirmed, Shipped, Delivered, etc.).


---

## 🔁 How It All Works Together

```
1. 🌐 Browse   →  GET /api/products (all products loaded on homepage)
2. 🔍 Filter   →  GET /api/products?category=Men's%20Fashion
3. 🔐 Login    →  JWT returned → saved to localStorage → context updated
4. 🛒 Checkout →  POST /api/orders with JWT in Authorization header
5. 📋 Admin    →  Sees new order on Dashboard → updates status to "Shipped"
6. 🖼️ Upload   →  Admin uploads images via FormData → /api/upload saves files
                   → product created in MongoDB with image paths
```

---

## 🚀 Getting Started

```bash
# 1. Clone the repository
git clone https://github.com/your-username/shopez.git
cd shopez

# 2. Install backend dependencies
cd server && npm install

# 3. Install frontend dependencies
cd ../client && npm install

# 4. Add your environment variables
# Create a .env file in /server with:
# MONGO_URI=your_mongodb_connection_string
# JWT_SECRET=your_jwt_secret

# 5. Run the app
# In /server:
npm run dev

# In /client:
npm run dev
```

---

<div align="center">

Made with ❤️ · ShopEZ

</div>
