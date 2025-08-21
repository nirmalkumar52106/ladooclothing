const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const Tour = require("./schema/package");
const Booking = require("./schema/booking");


const app = express();
app.use(cors(origin = "*"));
app.use(express.json());

// === Connect MongoDB ===
mongoose.connect("mongodb+srv://kumarnirmal52106:Dk5Ys59mDh1kEb9o@cluster0.9dptf2l.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  family  : 4,
})
.then(() => console.log("✅ MongoDB Connected"))
.catch((err) => console.error("❌ MongoDB Error:", err));

app.get("/" , (req,res)=>{
res.send("Hello")
})

// === Models ===
const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  phone : String,
  isAdmin: { type: Boolean, default: false },
});
const User = mongoose.model("User", userSchema);

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

// === User Auth Routes ===
app.post("/api/auth/register", async (req, res) => {
  try {
    const { name, email, password , phone} = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ name, email, password: hashedPassword , phone});
    await user.save();
    res.status(200).json({ message: "User registered successfully" });
  } catch (err) {
    res.status(400).json({ error: "Registration failed", details: err.message });
  }
});

app.get("/api/auth/users", async (req, res) => {
  try {
    const users = await User.find(); 
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch users", details: err.message });
  }
});

app.post("/api/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // check if user exists
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ error: "User not found" });

    // check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ error: "Invalid credentials" });

    // create JWT
    const token = jwt.sign(
      { userId: user._id, isAdmin: user.isAdmin || false },
      process.env.JWT_SECRET || "ladoogopal123443",
      { expiresIn: "1d" } // 1 day expiry
    );

    // send token + user info
    res.status(200).json({
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        isAdmin: user.isAdmin || false,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Login failed" });
  }
});


const verifyToken = async (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1]; // format: "Bearer token"
  if (!token) return res.status(401).json({ message: "Access denied" });

  try {
    const decoded = jwt.verify(token, 'ladoogopal123443' );
    req.user = decoded; 
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid token" });
  }
};

// route to get user profile
// ✅ Profile with Bookings
app.get("/api/auth/profile", verifyToken, async (req, res) => {
  try {
    // find user without password
    const user = await User.findById(req.user.userId).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });

    // fetch user bookings
    const bookings = await Booking.find({ user: req.user.userId })
      .populate("tour", "packageTitle location price duration image") // tour details
      .sort({ createdAt: -1 });

    res.json({
      user,
      bookings,
    });
  } catch (err) {
    console.error("Profile fetch error:", err);
    res.status(500).json({ message: "Failed to fetch profile" });
  }
});


// === Product Routes ===
app.post("/api/products/add", async (req, res) => {
  try {
    const product = new Product(req.body);
    await product.save();
    res.status(200).json({ message: "Product added successfully" });
  } catch (err) {
    res.status(500).json({ error: "Error adding product" });
  }
});

app.get("/api/products/all", async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch products" });
  }
});

app.get('/api/productsbyurl/:slugurl', async (req, res) => {
  try {
    const slug = req.params.slugurl;
    const product = await Product.findOne({ slugurl: slug });

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.json(product);
  } catch (error) {
    console.error('Error fetching product:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

app.get("/api/products/all/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    res.json(product);
  } catch (err) {
    res.status(500).json({ error: "Product not found" });
  }
});

// === Order Routes ===
app.post("/api/orders/create", async (req, res) => {
  try {
    const order = new Order(req.body); 
    await order.save();
    res.json({ message: "Order placed successfully" });
  } catch (err) {
    res.status(500).json({ error: "Failed to place order" });
  }
});

app.get("/api/orders/user/:id", async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.params.id });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch orders" });
  }
});



//tour backend
app.post("/package/add/new", async (req, res) => {
  try {
    const packageData = new Tour(req.body);
    await packageData.save();
    res.status(201).json({ success: true, message: "Package added successfully", data: packageData });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// app.post(
//   "/package/add/new",
//   upload.fields([
//     { name: "image", maxCount: 1 },
//     { name: "image1", maxCount: 1 },
//     { name: "image2", maxCount: 1 },
//     { name: "image3", maxCount: 1 },
//     { name: "image4", maxCount: 1 },
//   ]),
//   async (req, res) => {
//     try {
//       const newTour = new Tour({
//         ...req.body,
//         image: req.files?.image ? req.files.image[0].path : null,
//         image1: req.files?.image1 ? req.files.image1[0].path : null,
//         image2: req.files?.image2 ? req.files.image2[0].path : null,
//         image3: req.files?.image3 ? req.files.image3[0].path : null,
//         image4: req.files?.image4 ? req.files.image4[0].path : null,
//       });

//       await newTour.save();
//       res.json({ success: true, data: newTour });
//     } catch (err) {
//       res.status(500).json({ success: false, error: err.message });
//     }
//   }
// );


app.get("/tours", async (req, res) => {
  try {
    const packages = await Tour.find({});
    res.json({ success: true, data: packages });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});


app.get("/findtours/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const package = await Tour.findById(id);

    if (!package) {
      return res.status(404).json({ success: false, message: "Tour not found" });
    }

    res.json({ success: true, data: package });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
})



app.delete("/tours/:id", async (req, res) => {
  try {
    await Tour.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: "Package deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

app.patch("/tours/:id", async (req, res) => {
  try {
    const updatedPackage = await Tour.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ success: true, message: "Package updated successfully", data: updatedPackage });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});




app.get("/tours/:slug", async (req, res) => {
  try {
    const packageData = await Tour.findOne({ slug: req.params.slug });
    if (!packageData) {
      return res.status(404).json({ success: false, message: "Package not found" });
    }
    res.json({ success: true, data: packageData });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

//booking
app.post("/package/booking", async (req, res) => {
  try { 
    const booking = new Booking(req.body);
    await booking.save();
    res.status(201).json({ success: true, data: booking });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

//allbooking
app.get("/allbookings", async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate("tour", "packageTitle location price duration image destinationType") // Tour ka data
      .populate("user", "name email phone") // User ka data (sirf name aur email le rahe hain)
      .sort({ createdAt: -1 }); // Latest bookings pehle

    res.json({ success: true, data: bookings });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

//get by id booking
app.get("/allbookings/:id", async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id).populate("tour");
    if (!booking) return res.status(404).json({ success: false, message: "Booking not found" });
    res.json({ success: true, data: booking });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

//update booking
app.patch("/updatebooking/:id", async (req, res) => {
  try {
    const booking = await Booking.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!booking) return res.status(404).json({ success: false, message: "Booking not found" });
    res.json({ success: true, data: booking });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

//delete booking
app.delete("/deletebooking/:id", async (req, res) => {
  try {
    const booking = await Booking.findByIdAndDelete(req.params.id);
    if (!booking) return res.status(404).json({ success: false, message: "Booking not found" });
    res.json({ success: true, message: "Booking deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

app.get("/user/:userId", async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.params.userId }).populate("tour");
    res.json({ success: true, data: bookings });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});


app.get("/dashboard/bookings", async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate("user", "name email phone") // user details
      .populate("tour", "packageTitle location price duration image") // tour details
      .sort({ createdAt: -1 });

    res.json(bookings);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch bookings", details: err.message });
  }
});


app.put("/api/bookings/:id/status", async (req, res) => {
  try {
    const { status } = req.body; // new status from frontend
    if (!["Pending", "Confirmed", "Cancelled"].includes(status)) {
      return res.status(400).json({ error: "Invalid status value" });
    }

    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    )
      .populate("user", "name email")
      .populate("tour", "packageTitle location");

    if (!booking) return res.status(404).json({ error: "Booking not found" });

    res.json({ message: "Booking status updated", booking });
  } catch (err) {
    res.status(500).json({ error: "Failed to update booking", details: err.message });
  }
});


// === Start Server ===
const PORT =  5000;
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
