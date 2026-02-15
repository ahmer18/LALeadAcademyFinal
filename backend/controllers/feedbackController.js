// controllers/feedbackController.js
const { ObjectId } = require("mongodb");
const connectDB = require("../config/dbConnection");

let feedbacksCollection;
let coursesCollection;

(async () => {
  const db = await connectDB();
  feedbacksCollection = db.collection("feedbacks");
  coursesCollection = db.collection("courses");
})();

// Helper: Calculate and update course rating based on all feedbacks
const updateCourseRating = async (courseId) => {
  try {
    const courseObjectId = ObjectId.isValid(courseId) ? new ObjectId(courseId) : courseId;
    
    // Get all feedbacks for this course
    const feedbacks = await feedbacksCollection.find({ courseId: courseObjectId }).toArray();
    
    if (feedbacks.length === 0) {
      // If no feedbacks, keep rating as is
      return;
    }
    
    // Calculate average rating
    const totalRating = feedbacks.reduce((sum, fb) => sum + (fb.rating || 0), 0);
    const averageRating = Math.round((totalRating / feedbacks.length) * 10) / 10; // Round to 1 decimal
    
    // Update course with new average rating
    await coursesCollection.updateOne(
      { _id: courseObjectId },
      { $set: { rating: averageRating } }
    );
    
    console.log(`Course ${courseId}: Rating updated to ${averageRating} (${feedbacks.length} feedbacks)`);
  } catch (err) {
    console.error("Error updating course rating:", err);
  }
};

// POST /feedbacks (Add a new feedback by Student)

const addFeedback = async (req, res) => {
  try {
    // Look for BOTH names just to be safe
    const { feedback, description, rating, courseId, studentEmail } = req.body;
    
    const feedbackData = {
      // Use feedback if it exists, otherwise use description
      feedback: feedback || description, 
      rating: Number(rating),
      courseId: ObjectId.isValid(courseId) ? new ObjectId(courseId) : courseId,
      studentEmail,
      createdAt: new Date(),
    };

    if (!feedbackData.feedback) {
      return res.status(400).json({ success: false, message: "Feedback text is required" });
    }

    const result = await feedbacksCollection.insertOne(feedbackData);
    
    // Update course rating dynamically based on all feedbacks
    await updateCourseRating(feedbackData.courseId);
    
    res.status(200).json({ success: true, message: "Feedback added!", data: result });
  } catch (err) {
    console.error("Add Feedback Error:", err);
    res.status(500).send({ message: "Internal server error", success: false });
  }
};

const getFeedbacks = async (req, res) => {
  try {
    const { courseId } = req.query;

    // If no courseId provided, return all feedbacks (for home page)
    if (!courseId) {
      const feedbacks = await feedbacksCollection.find({}).sort({ createdAt: -1 }).toArray();
      return res.status(200).json({
        success: true,
        feedbacks: feedbacks || [],
      });
    }

    const cleanId = courseId.trim();

    // Query for BOTH the string version and the ObjectId version
    const query = {
      $or: [
        { courseId: cleanId },
        { courseId: ObjectId.isValid(cleanId) ? new ObjectId(cleanId) : null }
      ].filter(q => q.courseId !== null)
    };

    const feedbacks = await feedbacksCollection.find(query).sort({ createdAt: -1 }).toArray();
    
    // Check your Terminal/Console - this tells us if the DB found it
    console.log(`Teacher Dashboard Request for ID: ${cleanId} | Found: ${feedbacks.length}`);

    res.status(200).json({
      success: true,
      feedbacks: feedbacks || [],
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// PATCH /feedbacks/:id (Update a feedback by Student)
const updateFeedback = async (req, res) => {
  const { id } = req.params;
  const { description, rating } = req.body;

  try {
    if (!ObjectId.isValid(id)) return res.status(400).json({ message: "Invalid ID" });

    // Get the feedback to find its courseId before updating
    const feedbackDoc = await feedbacksCollection.findOne({ _id: new ObjectId(id) });
    
    const result = await feedbacksCollection.updateOne(
      { _id: new ObjectId(id) },
      { 
        $set: { 
          feedback: description, // Keep the mapping consistent
          rating: Number(rating),
          updatedAt: new Date() 
        } 
      }
    );

    // Recalculate course rating after feedback update
    if (feedbackDoc && feedbackDoc.courseId) {
      await updateCourseRating(feedbackDoc.courseId);
    }

    res.status(200).json({ success: true, message: "Feedback updated!", data: result });
  } catch (err) {
    res.status(500).send({ message: "Internal server error", success: false });
  }
};

module.exports = {
  addFeedback,
  getFeedbacks,
  updateFeedback,
};
