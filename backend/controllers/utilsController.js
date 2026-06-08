const ImageKit = require("imagekit");
const connectDB = require("../config/dbConnection");

const getCollection = async (name) => { const db = await connectDB(); return db.collection(name); };

// GET ImageKit signature
const getIKSignature = async (req, res) => {
  try {
    const imagekit = new ImageKit({
      publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
      privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
      urlEndpoint: "https://ik.imagekit.io/jakariya",
    });

    const authParams = imagekit.getAuthenticationParameters();
    res.status(200).json(authParams);
  } catch (err) {
    console.error("Error generating ImageKit signature:", err);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// GET statistics (users, courses, enrollments)
const getStatistics = async (req, res) => {
  try {
    const totalUsers = await (await getCollection("users")).estimatedDocumentCount();
    const totalCourses = await (await getCollection("courses")).countDocuments({ status: "approved" });
    const totalEnrollments =
      await (await getCollection("enrollments")).estimatedDocumentCount();

    res.status(200).json({
      success: true,
      message: "Statistics fetched successfully",
      data: {
        totalUsers,
        totalCourses,
        totalEnrollments,
      },
    });
  } catch (err) {
    console.error("Error fetching statistics:", err);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

module.exports = {
  getIKSignature,
  getStatistics,
};
