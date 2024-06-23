const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const userRouter = require("./routes/user");
const authRouter = require("./routes/auth");
const productRouter = require("./routes/product");
const cartRouter = require("./routes/cart");
const orderRouter = require("./routes/order");
const stripeRouter = require("./routes/stripe");

dotenv.config();

const app = express();
app.use(express.json());

mongoose.connect(process.env.MONGO_URL).then(() => {
    console.log("DB Connection Established !");
}).catch((err) => {
    console.log(err)
});

app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);
app.use("/api/products", productRouter);
app.use("/api/carts", cartRouter);
app.use("/api/orders", orderRouter);
app.use("/api/checkout", stripeRouter);

app.listen(process.env.PORT || 5000, () => {
    console.log(`Backend server is running at ${process.env.PORT} !!`);
});