import express from "express"
import dotenv from "dotenv"

import { connectDb } from "./lib/db.js"

import authRoutes from "./routes/auth.route.js"

dotenv.config()

const app = express()

const PORT = process.env.PORT || 5000

// routes
app.use("/api/auth", authRoutes)

app.listen(PORT, () => {
	console.log(`Server is running on http://localhost:${PORT}`)
	connectDb()
})
