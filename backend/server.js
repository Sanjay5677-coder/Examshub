const express = require("express");
const Razorpay = require("razorpay");
const cors = require("cors");
const path = require("path");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Razorpay keys (apni keys dalna)
const razorpay = new Razorpay({
  key_id: "rzp_live_R9vO4222DeaOxA",
  key_secret: "1M3I5rpBltEjrSEA8zgbD1B9",
});

// Static frontend serve karna
app.use(express.static(path.join(__dirname, "public")));

// Order create API
app.post("/create-order", async (req, res) => {
  const { amount } = req.body;

  const options = {
    amount: amount * 100, // INR → paise
    currency: "INR",
    receipt: "receipt_" + Date.now(),
  };

  try {
    const order = await razorpay.orders.create(options);
    res.json(order);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error creating order");
  }
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});
