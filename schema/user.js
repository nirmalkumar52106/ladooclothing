const mongoose = require("mongoose")

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  phone: String,
  isAdmin: { type: Boolean, default: false },
  isActive: { type: Boolean, default: true }  // ✅ new field for deactivate/activate
});



const User = mongoose.model("User", userSchema);
module.exports = User