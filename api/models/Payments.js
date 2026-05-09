const mongoose = require("mongoose");
const { Schema } = mongoose;

const paymentSchema = new Schema({
  transactionId: String,
  email: String,
  price: Number,
  deliveryAddress: {
    type: String,
    required: false,
  },
  phone: {
    type: String,
    required: false,
  },
  quantity: Number,
 
  itemName: Array,
  cartItems: Array,
  menuItems: Array,
  status: {
    type: String,
    enum: [
      "Pending",
      "Preparing",
      "Out for Delivery",
      "Delivered",
      "Cancelled",
    ],
    default: "Pending",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Payment = mongoose.model("Payment", paymentSchema);
module.exports = Payment;
