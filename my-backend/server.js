const express = require("express");
const mongoose = require("mongoose");
const authRoutes = require("./routes/auth"); // Assuming you have a route file

const app = express();
const PORT = 5500;
const cors = require("cors");
app.use(
  cors({
    origin: "*", // Or specify exact IP like 'http://192.168.0.55:19006'
  })
); // This allows requests from all origins

// Middleware
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.get("/", (req, res) => {
  res.send("Server is working!");
});
// MongoDB Connection
mongoose
  .connect("mongodb://127.0.0.1:27017/auth-db", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.error("MongoDB Error:", err));

// Start Server (this is where you add 0.0.0.0)
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on http://0.0.0.0:${PORT}`);
});
