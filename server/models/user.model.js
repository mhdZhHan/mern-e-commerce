import mongoose from "mongoose"
import bcryptjs from "bcryptjs"

const userSchema = new mongoose.Schema(
	{
		name: {
			type: String,
			required: [true, "Name is required"],
		},
		email: {
			type: String,
			required: [true, "Email is required"],
			unique: true,
			lowercase: true,
			trim: true,
		},
		password: {
			type: String,
			required: [true, "Password is required"],
			minLength: [6, "Password must be at least 6 characters long"],
		},
		cartItems: [
			{
				quantity: {
					type: Number,
					default: 1,
				},
				product: {
					type: mongoose.Schema.Types.ObjectId,
					ref: "Product",
				},
			},
		],
		role: {
			type: String,
			enum: ["customer", "admin"],
			default: "customer",
		},
	},
	{ timestamps: true }
)

// pre-save hook to hash password before saving to database
userSchema.pre("save", async (next) => {
	if (!this.isModified("password")) return next

	try {
		const salt = await bcryptjs.salt(10)
		this.password = await bcryptjs.hash(this.password, salt)
		next()
	} catch (error) {
		next(error)
	}
})

// custom function for checking password
userSchema.methods.comparePassword = async function (password) {
	return bcryptjs.compare(password, this.password)
}

const User = mongoose.model("User", userSchema)

export default User
