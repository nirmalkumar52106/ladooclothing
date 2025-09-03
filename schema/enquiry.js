const mongoose = require("mongoose")

const enquirySchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  mobile: { type: String, required: true },
  location: { type: String },
  comment: { type: String },
  date: { type: Date, default: Date.now }  // ✅ Custom Date field
}, { timestamps: true });


const TourEnquiry = mongoose.model("GoodLuckEnquiry", orderSchema);
module.exports = TourEnquiry