// models/User.js
const mongoose = require("mongoose");

const { Schema } = mongoose;

const PaymentMethodSchema = new Schema({
  type: { type: String, required: true }, // e.g., 'Credit Card', 'PayPal'
  details: { type: Schema.Types.Mixed, required: true }, // Card details or other
});

const PersonalDetailsSchema = new Schema({
  address: String,
  phoneNumber: String,
  // Add other personal details fields as needed
});

const UserSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    passwordHash: { type: String, required: true },
    role: {
      type: String,
      enum: ["customer", "manager", "admin"],
      default: "customer",
    },
    personalDetails: PersonalDetailsSchema,
    paymentMethods: [PaymentMethodSchema],
    accountStatus: {
      type: String,
      enum: ["active", "deactivated", "deleted"],
      default: "active",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", UserSchema);