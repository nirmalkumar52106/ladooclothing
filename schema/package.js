const mongoose = require("mongoose");

const PriceSchema = new mongoose.Schema({
  adult: { type: Number, required: true },
  youth: { type: Number, required: true },
  children: { type: Number, required: true },
});

// Tour Plan Schema (Day-wise accordion)
const TourPlanSchema = new mongoose.Schema({
  dayTitle: { type: String, required: true },       // e.g., "Day 1: Arrival in Manali"
  dayDescription: { type: String, required: true }, // e.g., "Welcome to Manali, transfer to hotel..."
});

const TourPackageSchema = new mongoose.Schema(
  {
    image: { type: String },
    location: { type: String, required: true },
    packageTitle: { type: String, required: true },
    duration: Number,
    price: PriceSchema,
    locationurl : String,
    image1: { type: String },
    image2: { type: String },
    image3: { type: String },
    image4: { type: String },
    youtubeLink: { type: String },
    destinationType: { type: String },
    memberSize: { type: Number },
    aboutPackage: { type: String },
    tripHighlight: { type: [String] }, // multiple highlights
    include: { type: [String] },       // list of included items
    exclude: { type: [String] },       // list of excluded items

    // Main Tour Plan Heading (e.g., "Tour Itinerary")
    tourPlanMainHeading: { type: String },

    // Day-wise Accordion Data
    tourPlan: [TourPlanSchema],

    // SEO
    metaTitle: { type: String },
    metaDescription: { type: String },
    metaKeywords: { type: [String] },
    slug: { type: String },
  },
  { timestamps: true }
);

TourPackageSchema.pre("save", function (next) {
  if (!this.slug && this.packageTitle) {
    this.slug = this.packageTitle
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "");
  }
  next();
});


const Tour = mongoose.model("TourPackage", TourPackageSchema);
module.exports = Tour;
