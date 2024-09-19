import express from "express"
import dotenv from "dotenv"
import cookieParser from "cookie-parser"

import { connectDb } from "./lib/db.js"

import authRoutes from "./routes/auth.route.js"
import productRoutes from "./routes/product.route.js"
import cartRoutes from "./routes/cart.route.js"
import couponsRoutes from "./routes/coupon.route.js"

dotenv.config()

const app = express()

// middlewares
app.use(express.json())
app.use(cookieParser()) // allow parse incoming cookies

// routes
app.use("/api/auth", authRoutes)
app.use("/api/products", productRoutes)
app.use("/api/cart", cartRoutes)
app.use("/api/coupons", couponsRoutes)

const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
	console.log(`Server is running on http://localhost:${PORT}`)
	connectDb()
})
