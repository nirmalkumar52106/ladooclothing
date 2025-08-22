const mongoose = require("mongoose");

const BookingSchema = new mongoose.Schema(
  {
    tour: { type: mongoose.Schema.Types.ObjectId, ref: "TourPackage", required: true },
    members: { type: Number, required: false },     // total members
    travelDate: { type: Date, required: false },    // selected travel date
    pickupLocation: { type: String },              // optional pickup point
    specialRequest: { type: String },
    totalprice : Number,
    userlocate : String,
    adultcount : Number,
    childrencount :  Number,
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
