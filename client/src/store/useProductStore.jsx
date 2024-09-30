import { toast } from "react-hot-toast"
import { create } from "zustand"
import axios from "../lib/axios"

export const useProductStore = create((set, get) => ({
	products: [],
	loading: false,

	setProducts: (product) => set({ product }),

	fetchAllProducts: async () => {
		set({ loading: true })
		try {
			const response = await axios.get("/products")
			set({ products: response.data.products })
		} catch (error) {
			toast.error(
				error.response?.data?.error || "Failed to fetch products"
			)
		} finally {
			set({ loading: false })
		}
	},

	createProduct: async (productData) => {
		set({ loading: true })
		try {
			const response = await axios.post("/products", productData)
			set((prevState) => ({
				products: [...prevState.products, response.data],
			}))
		} catch (error) {
			toast.error(error.response?.data?.error || "Error creating product")
		} finally {
			set({ loading: false })
		}
	},

	toggleFeaturedProduct: async (productId) => {
		set({ loading: true })
		try {
			const response = await axios.patch(`/products/${productId}`)

			// update the isFeatured prop of the product
			set((prevProducts) => ({
				products: prevProducts.products.map((product) =>
					product._id === productId
						? { ...product, isFeatured: response.data.isFeatured }
						: product
				),
				loading: false,
			}))
		} catch (error) {
			toast.error(
				error.response?.data?.error || "Error toggle featured product"
			)
		} finally {
			set({ loading: false })
		}
	},
	deleteProduct: async (productId) => {
		set({ loading: true })
		try {
			await axios.delete(`/products/${productId}`)
			set((prevState) => ({
				products: prevState.products.filter(
					(product) => product._id !== productId
				),
			}))
		} catch (error) {
			toast.error(error.response?.data?.error || "Error deleting product")
		} finally {
			set({ loading: false })
		}
	},
}))
