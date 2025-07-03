import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Product from "./product.js";

const app = express();
app.use(express.json());
dotenv.config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO);
    console.log("MongoDB connected successfully");
  } catch (error) {
    console.error("MongoDB connection failed:", error.message);
    process.exit(1);
  }
}

const port = 3000;

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.listen(port, () => {
  connectDB();
  console.log(`app listening at http://localhost:${port}`);
});

// core feature 1

// API Endpoint add Product
app.post('/products', async (req, res) => {
  try{
    const product = new Product(req.body);
    await product.save();
    res.status(201).json(product);
  }
  catch (error) {
    res.status(400).json({
      error: "Failed to create product",
      details: error.message
    });
  }
});


// API Endpoint get product by id
app.get('/products/:id', async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({
      error: "Invalid product ID",
      details: { id }
    });
  }
  try {
    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }
    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ error: "Server error", details: error.message });
  }
});