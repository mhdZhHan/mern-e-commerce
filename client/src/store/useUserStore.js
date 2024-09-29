import { toast } from "react-hot-toast"
import { create } from "zustand"
import axios from "../lib/axios"

export const useUserStore = create((set, get) => ({
	user: null,
	loading: false,
	checkingAuth: true,

	signUp: async ({ name, email, password, confirmPassword }) => {
		set({ loading: true })

		if (password !== confirmPassword) {
			set({ loading: false })
			return toast.error("Password do not match")
		}

		try {
			const res = await axios.post("/auth/signup", {
				name,
				email,
				password,
			})
			set({ user: res.data })
		} catch (error) {
			toast.error(error.response.data.message || "An error occurred")
		} finally {
			set({ loading: false })
		}
	},

	login: async (email, password) => {
		set({ loading: true })

		try {
			const res = await axios.post("/auth/login", {
				email,
				password,
			})
			set({ user: res.data })
		} catch (error) {
			toast.error(error.response.data.message || "An error occurred")
		} finally {
			set({ loading: false })
		}
	},
}))
