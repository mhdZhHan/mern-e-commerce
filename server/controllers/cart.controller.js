export const getCartProducts = async (req, res) => {
	try {
	} catch (error) {
		console.log("Error in getCartProducts controller", error?.message)
		res.status(500).json({ message: "Server error", error: error?.message })
	}
}

export const addToCart = async (req, res) => {
	try {
	} catch (error) {
		console.log("Error in addToCart controller", error?.message)
		res.status(500).json({ message: "Server error", error: error?.message })
	}
}

export const removeAllFromCart = async (req, res) => {
	try {
	} catch (error) {
		console.log("Error in removeAllFromCart controller", error?.message)
		res.status(500).json({ message: "Server error", error: error?.message })
	}
}

export const updateQuantity = async (req, res) => {
	try {
	} catch (error) {
		console.log("Error in updateQuantity controller", error?.message)
		res.status(500).json({ message: "Server error", error: error?.message })
	}
}
