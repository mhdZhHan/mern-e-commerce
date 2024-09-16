import express from "express"
import dotenv from "dotenv"
import cookieParser from "cookie-parser"

import { connectDb } from "./lib/db.js"

import authRoutes from "./routes/auth.route.js"

dotenv.config()

const app = express()

// middlewares
app.use(express.json())
app.use(cookieParser()) // allow parse incoming cookies

// routes
app.use("/api/auth", authRoutes)

const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
	console.log(`Server is running on http://localhost:${PORT}`)
	connectDb()
})
