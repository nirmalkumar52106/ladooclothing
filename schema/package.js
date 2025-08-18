
const mongoose = require("mongoose");

const PriceSchema = new mongoose.Schema({
  adult: { type: Number, required: true },
  youth: { type: Number, required: true },
  children: { type: Number, required: true },
});

const TourPackageSchema = new mongoose.Schema({
  image: { type: String },  
  location: { type: String, required: true },
  packageTitle: { type: String, required: true },
  price: PriceSchema,
  image1: { type: String },
  image2: { type: String },
  image3: { type: String },
  image4: { type: String },
  youtubeLink: { type: String },
  destinationType: { type: String },
  memberSize: { type: Number },
  aboutPackage: { type: String },
  tripHighlight: { type: [String] },   // multiple highlights
  include: { type: [String] },         // list of included items
  exclude: { type: [String] },         // list of excluded items
  tourPlanMainHeading: { type: String },
}, { timestamps: true });

const Tour = mongoose.model("TourPackage", TourPackageSchema);
module.exports = Tour
