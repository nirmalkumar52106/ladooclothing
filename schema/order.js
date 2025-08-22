
const mongoose = require("mongoose")

const orderSchema = new mongoose.Schema({
  userId: String,
  items: [
    {
      productId: String,
      quantity: Number,
    },
  ],
  address: String,
  totalAmount: Number,
  paymentMethod: { type: String, default: "COD" },
  status: { type: String, default: "Pending" },
  createdAt: { type: Date, default: Date.now },
});


const Order = mongoose.model("Order", orderSchema);
module.exports = Order