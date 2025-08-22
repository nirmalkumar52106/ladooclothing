const mongoose = require("mongoose")

const productSchema = new mongoose.Schema({
  title: String,
  description: String,
  price: Number,
  size: String,
  image: String,
  category: String,
  metatile : String,
  metadescription : String,
  metakeyword :  String,
  slugurl :  String,
  createdAt: { type: Date, default: Date.now },
});


const Product = mongoose.model("Product", productSchema);
module.exports = Product