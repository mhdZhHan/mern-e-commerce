import jwt from "jsonwebtoken"
import { redis } from "../lib/redis.js"

import User from "../models/user.model.js"

const generateToken = (userId) => {
	const accessToken = jwt.sign({ userId }, process.env.ACCESS_TOKEN_SECRET, {
		expiresIn: "15m",
	})

	const refreshToken = jwt.sign(
		{ userId },
		process.env.REFRESH_TOKEN_SECRET,
		{
			expiresIn: "7d",
		}
	)

	return { accessToken, refreshToken }
}

const storeRefreshToken = async (userId, refreshToken) => {
	/**
	 * Store the refresh token in Redis with a 7-day TTL (Time to Live).
	 * - Key: `refresh_token:${userId}`
	 * - Value: refreshToken
	 * - "EX": Set expiration time in seconds
	 * - TTL: 7 days (7 * 24 * 60 * 60 = 604,800 seconds)
	 */

	await redis.set(
		`refresh_token:${userId}`,
		refreshToken,
		"EX",
		7 * 24 * 60 * 60
	)
}

const setCookies = (res, accessToken, refreshToken) => {
	/**
	 * Set the access and refresh tokens as HTTP cookies.
	 * - httpOnly: Prevents client-side JavaScript from accessing the cookie (helps prevent XSS attacks).
	 * - secure: Ensures the cookie is only sent over HTTPS when in production mode.
	 * - sameSite: Strict policy to prevent CSRF attacks by not sending the cookie in cross-site requests.
	 * - maxAge: 15 minutes (15 * 60 * 1000 ms).
	 */

	res.cookie("accessToken", accessToken, {
		httpOnly: true,
		secure: process.env.NODE_ENV === "production",
		sameSite: "strict",
		maxAge: 15 * 60 * 1000, // 15 minutes
	})

	res.cookie("refreshToken", refreshToken, {
		httpOnly: true,
		secure: process.env.NODE_ENV === "production",
		sameSite: "strict",
		maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
	})
}

export const signup = async (req, res) => {
	const { email, password, name } = req.body

	try {
		const userExists = await User.findOne({ email })

		if (userExists) {
			return res.status(400).json({ message: "User already exists" })
		}

		const user = await User.create({ name, email, password })

		// authenticate
		const { accessToken, refreshToken } = generateToken(user._id)
		await storeRefreshToken(user._id, refreshToken)

		setCookies(res, accessToken, refreshToken)

		return res.status(201).json({
			user: {
				...user._doc,
				password: undefined,
			},
			message: "User created successfully",
		})
	} catch (error) {
		res.status(500).json({ message: error?.message })
	}
}

export const login = async (req, res) => {
	res.send("Hello world")
}

export const logout = async (req, res) => {
	try {
		const refreshToken = req.cookies.refreshToken

		if (refreshToken) {
			const decoded = jwt.verify(
				refreshToken,
				process.env.REFRESH_TOKEN_SECRET
			)
			await redis.del(`refresh_token:${decoded.userId}`)
		}

		res.clearCookie("accessToken")
		res.clearCookie("refreshToken")

		res.status(204).json({ message: "Logged out successfully" })
	} catch (error) {
		res.status(500).json({ message: "Server error", error: error.message })
	}
}
