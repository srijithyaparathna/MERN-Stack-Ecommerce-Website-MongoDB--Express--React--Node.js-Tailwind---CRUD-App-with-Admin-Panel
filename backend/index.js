const express = require("express");
const app = express();
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
app.use(express.json());
app.use(cors());  // Ensure CORS is enabled globally

// Set up storage for multer
const storage = multer.diskStorage({
  destination: './upload/images', // Correct path
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
      success: 0,
      message: 'No file uploaded',
    });
  }
  res.json({
    success: 1,
    image_url: `http://localhost:${PORT}/images/${req.file.filename}`, // Corrected the port variable
  });
});

// Product Schema
const productSchema = new mongoose.Schema({
  id: {
    type: Number,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  new_price: {
    type: Number,
    required: true,
  },
  old_price: {
    type: Number,
    required: true,
  },
  dateAdded: {  // Renamed field to avoid conflict with Date object
    type: Date,
    default: Date.now,
  },
  available: {
    type: Boolean,
    default: true,
  }
});

// Create Product Model
const Product = mongoose.model("Product", productSchema);

// Add Product Route
app.post('/addproduct', async (req, res) => {
    try {
      let products = await Product.find({}).sort({ id: -1 }).exec();
      let id = products.length > 0 ? products[0].id + 1 : 1;
  
      const product = new Product({
        id: id,
        name: req.body.name,
        image: req.body.image,
        category: req.body.category,
        new_price: req.body.new_price,
        old_price: req.body.old_price
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



const fetchUser = async (req, res, next) => {
  const token = req.header('auth-token');
  if (!token) {
      return res.status(401).send({ errors: "Please authenticate using a valid login" });
  } else {
      try {
          const data = jwt.verify(token, 'secret_ecom'); // Added missing '='
          req.user = data.user;
          next();
      } catch (error) {
          return res.status(401).send({ errors: "Invalid token" }); // Added proper error response
      }
  }
};


// Adding products to cart
app.post("/addtocart", fetchUser, async (req, res) => {
  try {
      console.log("Added", req.body.itemId);
      let userData = await User.findById(req.user.id);
      
      // Ensure cartData is initialized
      if (!userData.cartData) {
          userData.cartData = {};
      }
      
      userData.cartData[req.body.itemId] = (userData.cartData[req.body.itemId] || 0) + 1;
      await userData.save(); // Save the updated user data
      res.send("Added");
  } catch (error) {
      console.error(error);
      res.status(500).send("Internal Server Error");
  }
});

app.post('/getcart', fetchUser, async (req, res) => {
  try {
      console.log('Get cart');
      const userData = await User.findById(req.user.id);

      // Check if user data and cartData exist
      if (!userData || !userData.cartData) {
          return res.status(404).json({ message: 'Cart is empty or user not found' });
      }

      res.json(userData.cartData);
  } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal Server Error' });
  }
});

// Removing products from cart
app.post("/removefromcart", fetchUser, async (req, res) => {
  try {
      console.log("Removed", req.body.itemId);
      let userData = await User.findById(req.user.id);
      
      // Ensure cartData is initialized
      if (!userData.cartData) {
          return res.status(400).send("Cart is empty");
      }

      if (userData.cartData[req.body.itemId] > 0) {
          userData.cartData[req.body.itemId] -= 1;

          // Remove item from cart if quantity is zero
          if (userData.cartData[req.body.itemId] === 0) {
              delete userData.cartData[req.body.itemId];
          }

          await userData.save(); // Save the updated user data
          res.send("Removed");
      } else {
          res.status(400).send("Item not in cart");
      }
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

// User Schema
const User = mongoose.model('User', {
  name: {
    type: String,
  },
  email: {
    type: String,
    unique: true,
  },
  password: {
    type: String,
  },
  carData: {
    type: Object,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

// Signup Route
app.post('/signup', async (req, res) => {
  try {
    let check = await User.findOne({ email: req.body.email });
    if (check) {
      return res.status(400).json({ success: false, errors: "Existing user found with the same email address" });
    }

    let cart = {};
    for (let i = 0; i < 300; i++) {
      cart[i] = 0;
    }

    // Hash the password before saving
    const hashedPassword = await bcrypt.hash(req.body.password, 10);

    const user = new User({
      name: req.body.username,
      email: req.body.email,
      password: hashedPassword,
      carData: cart,
    });

    await user.save();

    const data = { user: { id: user.id } };
    const token = jwt.sign(data, 'secret_ecom', { expiresIn: '1h' });

    res.status(200).json({ success: true, token });
  } catch (err) {
    res.status(500).json({ success: false, errors: "Internal server error" });
  }
});

app.get('/newcollections', async (req, res) => {
  try {
    // Fetch the latest 8 products by sorting in descending order of creation date (or another relevant field)
    let newcollection = await Product.find({}).sort({ createdAt: -1 }).limit(8);
    
    console.log("Newcollection Fetched");
    res.send(newcollection);
  } catch (err) {
    console.error("Error fetching new collection:", err);
    res.status(500).send("Error fetching new collection");
  }
});


// creating endpoint for popular products
app.get('/popularproducts', async (req, res) => {
  try {
    let products = await Product.find({ category: "men" }); // fixed 'catrgory' typo
    let popularproducts = products.slice(0, 4);
    console.log("Popular products fetched");
    res.send(popularproducts); // fixed missing parenthesis
  } catch (error) {
    console.error("Error fetching popular products:", error);
    res.status(500).send({ message: "Error fetching popular products" });
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
    const token = jwt.sign(data, 'secret_ecom', { expiresIn: '1h' });

    return res.status(200).json({ success: true, token });
  } catch (err) {
    return res.status(500).json({ success: false, errors: "Internal server error" });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
