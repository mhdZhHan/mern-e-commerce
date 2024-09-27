import Order from "../models/order.model.js"
import Product from "../models/product.model.js"
import User from "../models/user.model.js"

export const getAnalytics = async (req, res) => {
	try {
		const analyticsData = await getAnalyticsData()

		const endDate = new Date()
		const startDate = new Date(endDate.getTime() - 7 * 24 * 60 * 60 * 1000)

		const dailySalesData = await getDailySalesData(startDate, endDate)

		res.status(200).json({ analyticsData, dailySalesData })
	} catch (error) {
		console.log("Error in getAnalytics controller")
		res.status(500).json({ message: "Server error", error: error?.message })
	}
}

async function getAnalyticsData() {
	const totalUsers = await User.countDocuments()
	const totalProducts = await Product.countDocuments()

	const salesData = await Order.aggregate([
		{
			$group: {
				_id: null, // it group all documents together
				totalSales: { $sum: 1 },
				totalRevenue: { $sum: "$totalAmount" },
			},
		},
	])

	const { totalSales, totalRevenue } = salesData[0] || {
		totalSales: 0,
		totalRevenue: 0,
	}

	return {
		users: totalUsers,
		products: totalProducts,
		totalSales,
		totalRevenue,
	}
}

async function getDailySalesData(startDate, endDate) {
	try {
		const dailySalesData = await Order.aggregate([
			{
				$match: {
					createdAt: {
						$gte: startDate,
						$lte: endDate,
					},
				},
			},

			{
				$group: {
					_id: {
						$dateToString: {
							format: "%y-%m-%d",
							date: "$createdAt",
						},
					},
					sales: { $sum: 1 },
					revenue: { $sum: "$totalAmount" },
				},
			},

			{
				$sort: { _id: 1 },
			},
		])

		const dateArray = getDatesInRange(startDate, endDate)
		// console.log(dateArray) // [2024-09-27, 2024-09-28]

		return dateArray.map((date) => {
			const foundData = dailySalesData.find((item) => item._id === date)

			return {
				date,
				sales: foundData?.sales || 0,
				revenue: foundData?.revenue || 0,
			}
		})
	} catch (error) {
		// console.log("Error in getDailySalesData function", error?.message)
		throw error
	}
}

function getDatesInRange(startDate, endDate) {
	const dates = []
	let currentDate = newDate(startDate)

	while (currentDate <= endDate) {
		dates.push(currentDate.toISOString().split("T")[0])
		currentDate.setDate(currentDate.getDate() + 1)
	}

	return dates
}
