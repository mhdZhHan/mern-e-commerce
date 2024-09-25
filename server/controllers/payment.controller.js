import Coupon from "../models/coupon.model.js"
import { stripe } from "../lib/stripe.js"

export const createCheckoutSession = async (req, res) => {
	try {
		const { products, couponCode } = req.body

		if (!Array.isArray(products) || products.length === 0) {
			return res
				.status(400)
				.json({ error: "Invalid or empty products array" })
		}

		let totalAmount = 0

		const lineItems = products.map((product) => {
			// stripe wants to sent in the formate of cents => $10 * 100 => $1000
			const amount = Math.round(product.price * 100)
			totalAmount += amount * product.quantity

			return {
				price_data: {
					currency: "usd",
					product_data: {
						name: product.name,
						image: [product.image],
					},
					unit_amount: amount,
				},
			}
		})

		let coupon = null
		if (couponCode) {
			coupon = await Coupon.findOne({
				code: couponCode,
				userId: req.user._id,
				isActive: true,
			})

			if (coupon) {
				totalAmount -= Math.round(
					(totalAmount * coupon.discountPercentage) / 100
				)
			}
		}

		const session = await stripe.checkout.sessions.create({
			payment_method_types: ["card"],
			line_items: lineItems,
			mode: "payment",
			success_url: `${process.env.CLIENT_URL}/purchase-success?session_id={CHECKOUT_SESSION_ID}`,
			cancel_url: `${process.env.CLIENT_URL}/purchase-cancel`,
			discounts: coupon
				? [
						{
							coupon: await createStripeCoupon(
								coupon.discountPercentage
							),
						},
				  ]
				: [],
			metadata: {
				user_id: req.user._id.toString(),
				couponCode: couponCode || "",
			},
		})

		// if user buying $200 ++
		if (totalAmount >= 20000) {
			await createNewCoupon(req.user._id)
		}

		res.status(200).json({
			id: session.id,
			totalAmount: totalAmount / 100, // convert into $
		})
	} catch (error) {}
}

// functions
async function createStripeCoupon(discountPercentage) {
	const coupon = await stripe.coupons.create({
		percent_off: discountPercentage,
		discounts: "once",
	})

	return coupon.id
}

async function createNewCoupon(userId) {
	const newCoupon = new Coupon({
		code: "GIFT" + Math.random().toString(36).substring(2, 8).toUpperCase(),
		discountPercentage: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
		userId: userId,
	})

	await newCoupon.save()

	return newCoupon
}
