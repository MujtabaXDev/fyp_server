require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const port = process.env.PORT || 8080;
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");

const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

// middleware
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://fyp-lovat-three.vercel.app"  // 👈 replace with your real Vercel URL
    ],
    credentials: true,
  }),
);
app.use(express.json());

//connect to mongoDB config
mongoose
  .connect("mongodb+srv://mujtabafarooqdev_db_user:Cafe12345@cluster0.u6hhlyf.mongodb.net/cafedb?retryWrites=true&w=majority&appName=Cluster0")
  .then(() => console.log("MongoDB connected..."));

// jwt authentication
app.post("/jwt", async (req, res) => {
  const user = req.body;
  const token = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: "1hr",
  });
  res.send({ token });
});

//   import routes here
const menuRoutes = require("./api/routes/menuRoutes");
const cartRoutes = require("./api/routes/cartRoutes");
const userRoutes = require("./api/routes/userRoutes");
const paymentRoutes = require("./api/routes/paymentRoutes");
app.use("/menu", menuRoutes);
app.use("/carts", cartRoutes);
app.use("/users", userRoutes);
app.use("/payments", paymentRoutes);
app.get("/health", (req, res) => {
  res.status(200).send("OK");
});
//stripe payment route
app.post("/create-payment-intent", async (req, res) => {
  const { price } = req.body;
  const amount = price * 100;

  // Create a PaymentIntent with the order amount and currency
  const paymentIntent = await stripe.paymentIntents.create({
    amount: amount,
    currency: "sgd",

    payment_method_types: ["card"],
  });

  res.send({
    clientSecret: paymentIntent.client_secret,
  });
});

app.get("/", (req, res) => {
  res.send("Hello Foodi Client Server!");
});

app.listen(port, '0.0.0.0', () => {
  console.log(`Example app listening on port ${port}`);
});
