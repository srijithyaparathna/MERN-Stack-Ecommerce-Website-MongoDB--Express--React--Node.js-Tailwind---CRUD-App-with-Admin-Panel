const express = require("express");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const path = require("path");
const cors = require("cors");
const bcrypt = require("bcrypt");
const connectDB = require('./config/db');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Connect to the database
connectDB();

const PORT = process.env.PORT || 5000;

// Middlewares
const app = express();
app.use(express.json());
app.use(cors()); // Ensure CORS is enabled globally

// Set up storage for multer
const storage = multer.diskStorage({
  destination: './upload/images',
  filename: (req, file, cb) => {
    cb(null, `${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`);
  }
});

// Initialize multer upload
const upload = multer({ storage: storage });

// Serve uploaded images statically
app.use('/images', express.static('upload/images'));

// Upload endpoint
app.post('/upload', upload.single('product'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({
      success: false,
      message: 'No file uploaded',
    });
  }
  res.json({
    success: true,
    image_url: `http://localhost:${PORT}/images/${req.file.filename}`,
  });
});

// Product Schema
const productSchema = new mongoose.Schema({
  id: { type: Number, required: true },
  name: { type: String, required: true },
  image: { type: String, required: true },
  category: { type: String, required: true },
  new_price: { type: Number, required: true },
  old_price: { type: Number, required: true },
  dateAdded: { type: Date, default: Date.now },
  available: { type: Boolean, default: true },
});

// Create Product Model
const Product = mongoose.model("Product", productSchema);

// User Schema
const userSchema = new mongoose.Schema({
  name: { type: String },
  email: { type: String, unique: true },
  password: { type: String },
  cartData: { type: Object, default: {} },
  date: { type: Date, default: Date.now },
});

// Create User Model
const User = mongoose.model('User', userSchema);

// Fetch User Middleware
const fetchUser = async (req, res, next) => {
  const token = req.header('auth-token');
  if (!token) {
    return res.status(401).json({ errors: "Please authenticate using a valid login" });
  }
  try {
    const data = jwt.verify(token, process.env.JWT_SECRET || 'secret_ecom');
    req.user = data.user;
    next();
  } catch (error) {
    return res.status(401).json({ errors: "Invalid token" });
  }
};

// Add Product Route
app.post('/addproduct', async (req, res) => {
  try {
    let products = await Product.find({}).sort({ id: -1 }).exec();
    let id = products.length > 0 ? products[0].id + 1 : 1;

    const product = new Product({
      id,
      name: req.body.name,
      image: req.body.image,
      category: req.body.category,
      new_price: req.body.new_price,
      old_price: req.body.old_price,
    });

    await product.save();

    res.status(201).json({
      success: true,
      message: 'Product added successfully',
      product
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to add product',
      error: error.message
    });
  }
});

// Add to Cart
app.post("/addtocart", fetchUser, async (req, res) => {
  try {
    let userData = await User.findById(req.user.id);
    
    if (!userData.cartData) {
      userData.cartData = {};
    }

    userData.cartData[req.body.itemId] = (userData.cartData[req.body.itemId] || 0) + 1;
    await userData.save();
    res.send("Added");
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

// Get Cart
app.post('/getcart', fetchUser, async (req, res) => {
  try {
    const userData = await User.findById(req.user.id);

    if (!userData || !userData.cartData) {
      return res.status(404).json({ message: 'Cart is empty or user not found' });
    }

    res.json(userData.cartData);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// Remove from Cart
app.post("/removefromcart", fetchUser, async (req, res) => {
  try {
    let userData = await User.findById(req.user.id);

    if (!userData.cartData || !userData.cartData[req.body.itemId]) {
      return res.status(400).send("Item not in cart");
    }

    userData.cartData[req.body.itemId] -= 1;

    if (userData.cartData[req.body.itemId] === 0) {
      delete userData.cartData[req.body.itemId];
    }

    await userData.save();
    res.send("Removed");
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

// Remove Product Route
app.post('/removeproduct', async (req, res) => {
  try {
    const result = await Product.findOneAndDelete({ id: req.body.id });

    if (result) {
      res.json({
        success: true,
        message: 'Product removed successfully',
        id: req.body.id
      });
    } else {
      res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to remove product',
      error: error.message
    });
  }
});

// Get All Products Route
app.get('/allproducts', async (req, res) => {
  try {
    let products = await Product.find({});

    if (products.length > 0) {
      res.json(products);
    } else {
      res.status(404).json({
        success: false,
        message: 'No products found'
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch products',
      error: error.message
    });
  }
});

// Signup Route
app.post('/signup', async (req, res) => {
  try {
    let check = await User.findOne({ email: req.body.email });
    if (check) {
      return res.status(400).json({ success: false, errors: "Existing user found with the same email address" });
    }

    const hashedPassword = await bcrypt.hash(req.body.password, 10);

    const user = new User({
      name: req.body.username,
      email: req.body.email,
      password: hashedPassword,
    });

    await user.save();

    const data = { user: { id: user.id } };
    const token = jwt.sign(data, process.env.JWT_SECRET || 'secret_ecom', { expiresIn: '1h' });

    res.status(200).json({ success: true, token });
  } catch (err) {
    res.status(500).json({ success: false, errors: "Internal server error" });
  }
});

// Login Route
app.post('/login', async (req, res) => {
  try {
    let user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res.status(400).json({ success: false, errors: "Wrong email address" });
    }

    const passMatch = await bcrypt.compare(req.body.password, user.password);
    if (!passMatch) {
      return res.status(401).json({ success: false, errors: "Wrong password" });
    }

    const data = { user: { id: user.id } };
    const token = jwt.sign(data, process.env.JWT_SECRET || 'secret_ecom', { expiresIn: '1h' });

    return res.status(200).json({ success: true, token });
  } catch (err) {
    return res.status(500).json({ success: false, errors: "Internal server error" });
  }
});

// New Collections Route
app.get('/newcollections', async (req, res) => {
  try {
    let newCollection = await Product.find({}).sort({ dateAdded: 1 }).limit(-8);
    if (newCollection.length > 0) {
      return res.status(200).json(newCollection);
    }
    return res.status(404).json({ message: 'No new collections found' });
  } catch (error) {
    return res.status(500).json({ error: 'Internal server error' });
  }
});


app.get('/popularproducts', async (req, res) => {
  try {
    // Fetch up to 4 products from the database
    let products = await Product.find().limit(4); 
    console.log("Popular products fetched successfully");
    res.status(200).json(products); // Send the products as a JSON response with status 200
  } catch (error) {
    console.error("Error fetching popular products:", error);
    res.status(500).json({ message: "Server error, unable to fetch popular products." }); // Handle any server errors
  }
});


// Start Server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
