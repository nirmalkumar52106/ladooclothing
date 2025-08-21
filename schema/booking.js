const mongoose = require("mongoose");

const BookingSchema = new mongoose.Schema(
  {
    tour: { type: mongoose.Schema.Types.ObjectId, ref: "TourPackage", required: true }, // booked tour
    name: { type: String, required: true },        // customer name
    email: { type: String, required: true },       // customer email
    phone: { type: String, required: true },       // customer phone
    members: { type: Number, required: true },     // total members
    travelDate: { type: Date, required: true },    // selected travel date
    pickupLocation: { type: String },              // optional pickup point
    specialRequest: { type: String },   
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },           // optional message

    status: {
      type: String,
      enum: ["pending", "confirmed", "cancelled"],
      default: "pending",
    },
    paymentStatus: {
      type: String,
      enum: ["unpaid", "paid"],
      default: "unpaid",
    },
  },
  { timestamps: true }
);

const Booking = mongoose.model("Booking", BookingSchema);
module.exports = Booking;
