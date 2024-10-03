# 🛒 MERN E-commerce System

This is a full-featured e-commerce platform built using the MERN stack (MongoDB, Express.js, React, Node.js). It includes user authentication, Stripe payment integration, Redis caching, analytics, and comprehensive admin features.

## 🚀 Features

-   🍪 Authentication: Secure JWT-based access/refresh token with cookies.
-   💳 Payment Integration: Stripe for seamless payment processing.
-   🧑‍💼🛍️ User Roles: Admin and customer roles with different permissions.
-   🚀 Redis Caching: Used for session and data caching to optimize performance.
-   📊 Analytics: Track sales, product performance, and user activities through an admin dashboard.
-   📦 Product Management: CRUD operations for managing products and categories.
-   🛒 Shopping Cart: Add products to cart and checkout with real-time updates.
-   🎟️ Coupons: Implemented discount system using coupons.
-   🧾 Order Management: Track order details, manage cart items, and view order history.
-   🎨 Responsive UI: Built with React, Tailwind CSS, and Zustand for state management.

## 🛠️ Tech Stack

-   ⚛️ Frontend: React, Tailwind CSS, Zustand, Axios
-   🖥️ Backend: Node.js, Express, MongoDB, Redis, Stripe, Cloudinary
-   🔑 Authentication: JWT (JSON Web Tokens)
-   💳 Payment: Stripe integration for checkout
-   📊 Analytics: Integrated admin analytics for tracking platform performance
-   🧑‍💻 Caching: Redis for session and data caching

## 🧩 Installation

**Prerequisites**

Ensure you have the following installed:

-   📦 Node.js
-   📜 Yarn or npm
-   🍃 MongoDB
-   💾 Redis

## Setup

### 1. Clone the repository:

```bash
git clone https://github.com/mhdZhHan/mern-e-commerce.git
```

### 2. Install dependencies: Navigate to the project root and run:

```bash
npm install
```

### 3. Set up `.env` file:

```env
PORT=5000
MONGO_URI=your_mongo_uri

UPSTASH_REDIS_URL=your_redis_url

ACCESS_TOKEN_SECRET=your_access_token_secret
REFRESH_TOKEN_SECRET=your_refresh_token_secret

CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

STRIPE_SECRET_KEY=your_stripe_secret_key
CLIENT_URL=http://localhost:5173
NODE_ENV=development
```

### 4. Set up MongoDB and Redis (if using Upstash):

-   Ensure you have a running instance of MongoDB (local or cloud-based).
-   If using Redis for caching, configure your Upstash Redis URL or set up a local Redis instance.

## Running the App Locally

### 1. Build the app:

```bash
npm run build
```

### 2. Start the app:

```bash
npm run start
```

The app will start on the port specified in the `.env` file (default is `5000`).

## 🎉 Key Features

### JWT Authentication with Cookies 🍪

Implemented a secure authentication system using JWT tokens (access & refresh) and cookies for session management.

### Stripe Integration 💳

Checkout and payment are seamlessly handled via Stripe, ensuring a smooth experience for users.

### Product and Order Management 📦🧾

Easily manage your product catalog and customer orders with an admin dashboard.

### Redis Integration 🚀

Redis is used for caching sessions, speeding up response times and improving overall system performance.
