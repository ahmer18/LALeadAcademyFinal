require("dotenv").config();
const express = require("express");
const cors = require("cors");
const router = require("./routes/router");
const enrollmentController = require("./controllers/enrollmentController"); // Import this here
const feedbackController = require("./controllers/feedbackController");
const verifyToken = require("./middlewares/verifyToken");

const app = express();
const port = 5000;

app.use(cors({
  origin: ["http://localhost:5173", "http://127.0.0.1:5173"],
  credentials: true
}));
app.use(express.json());

// --- ADD THIS DIRECTLY HERE ---
app.patch('/update-progress/:courseId', verifyToken, enrollmentController.updateModuleProgress);
app.get("/enrollment-status/:courseId", verifyToken, enrollmentController.getEnrollmentStatus);
app.get("/feedbacks", feedbackController.getFeedbacks);

// ------------------------------

app.use("/", router);

app.get("/", (req, res) => {
  res.json({ message: "API Running" });
});

app.listen(port, () => {
  console.log(`✅ Server is running on port ${port}`);
});