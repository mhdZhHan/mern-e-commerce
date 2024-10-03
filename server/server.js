import path from "node:path"
import express from "express"
import dotenv from "dotenv"
import cookieParser from "cookie-parser"
import cors from "cors"

import { connectDb } from "./lib/db.js"

import authRoutes from "./routes/auth.route.js"
import productRoutes from "./routes/product.route.js"
import cartRoutes from "./routes/cart.route.js"
import couponRoutes from "./routes/coupon.route.js"
import paymentRoutes from "./routes/payment.route.js"
import analyticsRoutes from "./routes/analytics.route.js"

dotenv.config()

const app = express()

const __dirname = path.resolve()

// middlewares
app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }))
app.use(express.json({ limit: "10mb" }))
app.use(cookieParser()) // allow parse incoming cookies

// routes
app.use("/api/auth", authRoutes)
app.use("/api/products", productRoutes)
app.use("/api/cart", cartRoutes)
app.use("/api/coupons", couponRoutes)
app.use("/api/payments", paymentRoutes)
app.use("/api/analytics", analyticsRoutes)

if (process.env.NODE_ENV === "production") {
	app.use(express.static(__dirname, "/client/dist"))

	app.get("*", (req, res) => {
		res.sendFile(path.resolve(__dirname, "client", "dist", "index.html"))
	})
}

const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
	console.log(`Server is running on http://localhost:${PORT}`)
	connectDb()
})
