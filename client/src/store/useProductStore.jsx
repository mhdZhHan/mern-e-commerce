import { toast } from "react-hot-toast"
import { create } from "zustand"
import axios from "../lib/axios"

export const useProductStore = create((set, get) => ({
	products: [],
	loading: false,

	setProducts: (product) => set({ product }),

	createProduct: async (productData) => {
		set({ loading: true })
		try {
			const response = await axios.post("/products", productData)
			set((prevState) => ({
				products: [...prevState.products, response.data],
			}))
		} catch (error) {
			toast.error(error.response?.data?.error || "An error occurred")
		} finally {
			set({ loading: false })
		}
	},
}))
