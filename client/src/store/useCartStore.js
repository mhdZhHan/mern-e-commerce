import { toast } from "react-hot-toast"
import { create } from "zustand"
import axios from "../lib/axios"

export const useCartStore = create((set, get) => ({
	cart: [],
	coupon: null,
	total: 0,
	subtotal: 0,

	getCartItems: async () => {
		try {
			const response = await axios.get("/cart")
			set({ cart: response.data })

			get().calculateTotals()
		} catch (error) {
			set({ cart: [] })
			console.log(error.response?.data?.message || "An error occurred")
		}
	},

	addToCart: async (product) => {
		try {
			await axios.post("/cart", { productId: product._id })
			toast.success("Product added to cart")

			set((prevState) => {
				const existingItem = prevState.cart.find(
					(item) => item._id === product._id
				)
				const newCart = existingItem
					? prevState.cart.map((item) =>
							item._id === product._id
								? { ...item, quantity: item.quantity + 1 }
								: item
					  )
					: [...prevState.cart, { ...product, quantity: 1 }]

				return { cart: newCart }
			})

			get().calculateTotals()
		} catch (error) {
			set({ cart: [] })
			toast.error(error.response?.data?.message || "Err adding to cart")
		}
	},

	removeFromCart: async (productId) => {
		await axios.delete("/cart", { data: { productId } })
		set((prevState) => ({
			cart: prevState.cart.filter((item) => item._id !== productId),
		}))
		get().calculateTotals()
	},

	updateQuantity: async (productId, quantity) => {
		if (quantity === 0) {
			get().removeFromCart(productId)
			return
		}

		axios.put(`cart/${productId}`, { quantity })
		set((prevState) => ({
			cart: prevState.cart.map((item) =>
				item._id === productId ? { ...item, quantity: quantity } : item
			),
		}))
		get().calculateTotals()
	},

	calculateTotals: () => {
		const { cart, coupon } = get()
		const subtotal = cart.reduce((sum, item) => sum + item.price)
		let total = subtotal

		if (coupon) {
			const discount = subtotal * (coupon.discountPercentage / 100)
			total = subtotal - discount
		}

		set({ subtotal, total })
	},
}))
