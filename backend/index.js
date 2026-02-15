require("dotenv").config();
const express = require("express");
const cors = require("cors");
const router = require("./routes/router");
const enrollmentController = require("./controllers/enrollmentController");
const feedbackController = require("./controllers/feedbackController");
const verifyToken = require("./middlewares/verifyToken");

const app = express();

// Vercel uses dynamic porting, but we keep 5000 for local testing
const port = process.env.PORT || 5000; 

app.use(cors({
  origin: [
    "http://localhost:5173", 
    "http://127.0.0.1:5173",
    "https://laleadacademy-final.vercel.app", // Replace with your actual Vercel frontend URL
    "https://laleadacademy.com", 
  "https://www.laleadacademy.com", // Add your GoDaddy domain here once connected
  ],
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
if (process.env.NODE_ENV !== 'production') {
  app.listen(port, () => {
    console.log(`✅ Server is running on port ${port}`);
  });
}

// CRITICAL: Export the app for Vercel Serverless Functions
module.exports = app;