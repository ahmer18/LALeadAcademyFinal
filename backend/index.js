require("dotenv").config();
const dns = require("dns");
// Set default result order to ipv4first to avoid potential IPv6 resolution issues
if (dns.setDefaultResultOrder) {
  dns.setDefaultResultOrder('ipv4first');
}
// Optionally set DNS servers if the system ones are failing SRV lookups
dns.setServers(['8.8.8.8', '8.8.4.4']); 

const express = require("express");
const cors = require("cors");
const router = require("./routes/router");
const mongoose = require("mongoose");
const enrollmentController = require("./controllers/enrollmentController");
const feedbackController = require("./controllers/feedbackController");
const verifyToken = require("./middlewares/verifyToken");

const app = express();

// Vercel uses dynamic porting, but we keep 5000 for local testing
const port = process.env.PORT || 5000;

// app.use(cors({
//   origin: [
//     "http://localhost:5173", 
//     "http://127.0.0.1:5173",
//     "https://lalead-academy-frontend.vercel.app",

//     "https://laleadacademy.com", 
//   "https://www.laleadacademy.com",
//   /\.vercel\.app$/ 
//   ],
//   credentials: true
// }));

// app.use(express.json());
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected Successfully"))
  .catch(err => console.log("❌ MongoDB Connection Error:", err));

app.use(cors({
  origin: ["http://localhost:5173", "http://127.0.0.1:5173", "https://lalead-academy-frontend.vercel.app"],
  credentials: true
}));

app.use(express.json());

// Routes added directly
app.patch('/update-progress/:courseId', verifyToken, enrollmentController.updateModuleProgress);
app.get("/enrollment-status/:courseId", verifyToken, enrollmentController.getEnrollmentStatus);
app.get("/feedbacks", feedbackController.getFeedbacks);

app.use("/", router);

app.get("/", (req, res) => {
  res.json({ message: "API Running" });
});

// Only run app.listen when NOT on Vercel (local development)
app.listen(port, () => {
  console.log(`✅ Server is running on port ${port}`);
});

// CRITICAL: Export the app for Vercel Serverless Functions
module.exports = app;