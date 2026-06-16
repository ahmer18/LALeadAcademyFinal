const { ObjectId } = require("mongodb");
const connectDB = require("../config/dbConnection");

const getCollection = async (name) => { const db = await connectDB(); return db.collection(name); };

// ------------------- CONTROLLER FUNCTIONS -------------------

// Get all courses (Admin)
exports.getAllCoursesAdmin = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  try {
    const totalCourses = await (await getCollection("courses")).countDocuments();
    const totalPages = Math.ceil(totalCourses / limit);

    const courses = await (await getCollection("courses"))
      .find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .toArray();

    res.status(200).json({
      success: true,
      message: "Courses fetched successfully",
      currentPage: page,
      courses,
      totalCourses,
      totalPages,
      hasNextPage: page < totalPages,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Failed to load courses",
      error: err.message,
    });
  }
};

exports.deleteModuleFromCourse = async (req, res) => {
  try {
    const { id } = req.params;
    const { order } = req.body;
    if (!order) return res.status(400).send({ message: "Module order is required" });

    const result = await (await getCollection("courses")).updateOne(
      { _id: new ObjectId(id) },
      { $pull: { modules: { order: parseInt(order) } } }
    );

    if (result.modifiedCount > 0) {
      res.send({ success: true, message: "Module removed successfully" });
    } else {
      res.status(404).send({ success: false, message: "Module not found" });
    }
  } catch (error) {
    res.status(500).send({ message: "Internal Server Error", error });
  }
};

// Get approved courses with search + pagination (Users)
exports.getApprovedCourses = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 9;
  const search = req.query.searchTerm || "";
  const skip = (page - 1) * limit;

  const pipeline = [
    { $match: { status: "approved" } },
    { $skip: skip },
    { $limit: limit },
    {
      $lookup: {
        from: "users",
        localField: "instructorEmail",
        foreignField: "email",
        as: "instructor",
      },
    },
    {
      $lookup: {
        from: "enrollments",
        localField: "_id",
        foreignField: "courseId",
        as: "enrollments",
      },
    },
    { $addFields: { totalEnrollments: { $size: "$enrollments" } } },
  ];

  if (search) {
    pipeline.unshift({ $match: { title: { $regex: search, $options: "i" } } });
  }

  try {
    let totalCourses = await (await getCollection("courses")).countDocuments({
      status: "approved",
      ...(search && { title: { $regex: search, $options: "i" } }),
    });

    const totalPages = Math.ceil(totalCourses / limit);
    const courses = await (await getCollection("courses")).aggregate(pipeline).toArray();

    res.status(200).json({
      success: true,
      message: "Courses fetched successfully",
      currentPage: page,
      courses,
      totalCourses,
      totalPages,
      hasNextPage: page < totalPages,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Failed to load approved courses",
      error: err.message,
    });
  }
};

// Get courses by teacher email
exports.getCoursesByTeacher = async (req, res) => {
  const email = req.params.email;
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 9;
  const skip = (page - 1) * limit;
  const query = { instructorEmail: email };

  try {
    const totalCourses = await (await getCollection("courses")).countDocuments(query);
    const totalPages = Math.ceil(totalCourses / limit);

    const result = await (await getCollection("courses"))
      .find(query)
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 })
      .toArray();

    res.status(200).json({
      success: true,
      message: "Courses fetched successfully",
      courses: result,
      currentPage: page,
      totalCourses,
      totalPages,
      hasNextPage: page < totalPages,
    });
  } catch {
    res.status(500).send({ message: "Failed to load courses" });
  }
};

// Popular Courses
exports.getPopularCourses = async (req, res) => {
  try {
    const pipeline = [
      { $match: { status: "approved" } },
      {
        $lookup: {
          from: "users",
          localField: "instructorEmail",
          foreignField: "email",
          as: "instructor",
        },
      },
      {
        $lookup: {
          from: "enrollments",
          localField: "_id",
          foreignField: "courseId",
          as: "enrollments",
        },
      },
      { $addFields: { totalEnrollments: { $size: "$enrollments" } } },
      { $sort: { totalEnrollments: -1 } },
      { $limit: 6 },
    ];

    const popularCourses = await (await getCollection("courses"))
      .aggregate(pipeline)
      .toArray();
    res.status(200).json({
      success: true,
      message: "Popular courses fetched successfully",
      courses: popularCourses,
    });
  } catch {
    res.status(500).send({ message: "Failed to load popular courses" });
  }
};

// New Courses
exports.getNewCourses = async (req, res) => {
  try {
    const pipeline = [
      { $match: { status: "approved" } },
      { $sort: { createdAt: -1 } },
      { $limit: 6 },
      {
        $lookup: {
          from: "users",
          localField: "instructorEmail",
          foreignField: "email",
          as: "instructor",
        },
      },
      {
        $lookup: {
          from: "enrollments",
          localField: "_id",
          foreignField: "courseId",
          as: "enrollments",
        },
      },
      { $addFields: { totalEnrollments: { $size: "$enrollments" } } },
    ];

    const newCourses = await (await getCollection("courses")).aggregate(pipeline).toArray();
    res.status(200).json({
      success: true,
      message: "New courses fetched successfully",
      courses: newCourses,
    });
  } catch {
    res.status(500).send({ message: "Failed to load new courses" });
  }
};

// Get single course by ID
exports.getCourseById = async (req, res) => {
  const id = req.params.id;
  try {
    const pipeline = [
      { $match: { _id: new ObjectId(id) } },
      {
        $lookup: {
          from: "users",
          localField: "instructorEmail",
          foreignField: "email",
          as: "instructor",
        },
      },
      {
        $lookup: {
          from: "enrollments",
          localField: "_id",
          foreignField: "courseId",
          as: "enrollments",
        },
      },
      { $unwind: "$instructor" },
      { $addFields: { totalEnrollments: { $size: "$enrollments" } } },
    ];

    const result = await (await getCollection("courses")).aggregate(pipeline).toArray();
    if (!result.length)
      return res
        .status(404)
        .json({ success: false, message: "Course not found" });

    res.status(200).json({
      success: true,
      message: "Course fetched successfully",
      course: result[0],
    });
  } catch {
    res.status(500).send({ message: "Failed to load course" });
  }
};

// Add new course
exports.addCourse = async (req, res) => {
  try {
    const course = {
      ...req.body,
      status: "pending",
      createdAt: new Date(),
    };

    const result = await (await getCollection("courses")).insertOne(course);
    res.status(200).json({
      success: true,
      message: "Course added successfully",
      data: result,
    });
  } catch {
    res.status(500).send({ message: "Internal server error" });
  }
};

// Add a specific module to an existing course - now supports blocks array
exports.addModuleToCourse = async (req, res) => {
  const id = req.params.id;
  const { title, order, blocks, completionMessage } = req.body;

  const newModule = {
    title,
    order: parseInt(order),
    blocks: Array.isArray(blocks) ? blocks : [],
    completionMessage: completionMessage || "",
    createdAt: new Date()
  };

  try {
    const filter = { _id: new ObjectId(id) };
    // Use $push to add the new module to the modules array in MongoDB
    const update = {
      $push: {
        modules: {
          $each: [newModule],
          $sort: { order: 1 } // Automatically keeps modules 1, 2, 3... in order
        }
      }
    };

    const result = await (await getCollection("courses")).updateOne(filter, update);

    res.status(200).json({
      success: true,
      message: `Module added successfully with ${newModule.blocks.length} blocks`,
      data: result,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Update a specific module in an existing course
exports.updateModuleInCourse = async (req, res) => {
  const id = req.params.id;
  const { oldOrder, title, order, blocks, completionMessage } = req.body;

  const updatedModule = {
    title,
    order: parseInt(order),
    blocks: Array.isArray(blocks) ? blocks : [],
    completionMessage: completionMessage || "",
    updatedAt: new Date()
  };

  try {
    const filter = { _id: new ObjectId(id), "modules.order": parseInt(oldOrder) };
    const update = {
      $set: {
        "modules.$": updatedModule
      }
    };

    const result = await (await getCollection("courses")).updateOne(filter, update);

    if (result.matchedCount === 0) {
      return res.status(404).json({ success: false, message: "Module not found" });
    }

    // Re-sort modules by order after updating
    await (await getCollection("courses")).updateOne(
      { _id: new ObjectId(id) },
      {
        $push: {
          modules: {
            $each: [],
            $sort: { order: 1 }
          }
        }
      }
    );

    res.status(200).json({
      success: true,
      message: "Module updated successfully",
      data: result,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Change course status
exports.changeCourseStatus = async (req, res) => {
  const { status } = req.body;
  const id = req.params.id;
  const filter = { _id: new ObjectId(id) };
  const doc = { $set: { status } };

  try {
    const result = await (await getCollection("courses")).updateOne(filter, doc);
    res.status(200).json({
      success: true,
      message: "Course status updated",
      data: result,
    });
  } catch {
    res.status(500).send({ message: "Failed to update course status" });
  }
};

// Delete a course
exports.deleteCourse = async (req, res) => {
  const id = req.params.id;
  const filter = { _id: new ObjectId(id) };

  try {
    const result = await (await getCollection("courses")).deleteOne(filter);
    res.status(200).json({
      success: true,
      message: "Course deleted successfully",
      data: result,
    });
  } catch {
    res.status(500).send({ message: "Failed to delete course" });
  }
};

// Update a course
exports.updateCourse = async (req, res) => {
  const id = req.params.id;
  const filter = { _id: new ObjectId(id) };
  const doc = { $set: req.body };

  try {
    const result = await (await getCollection("courses")).updateOne(filter, doc);
    res.status(200).json({
      success: true,
      message: "Course updated successfully",
      data: result,
    });
  } catch {
    res.status(500).send({ message: "Failed to update course" });
  }
};

// Enrolled courses by email
exports.getEnrolledCourses = async (req, res) => {
  const { email } = req.params;

  try {
    const pipeline = [
      { $match: { email } },
      {
        $lookup: {
          from: "courses",
          localField: "courseId",
          foreignField: "_id",
          as: "courseInfo",
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "courseInfo.instructorEmail",
          foreignField: "email",
          as: "instructor",
        },
      },
      { $unwind: "$courseInfo" },
      { $sort: { createdAt: -1 } },
    ];

    const enrolledCourses = await (await getCollection("enrollments"))
      .aggregate(pipeline)
      .toArray();
    res.status(200).json({
      success: true,
      message: "Enrolled courses fetched successfully",
      enrolledCourses,
    });
  } catch {
    res.status(500).json({
      success: false,
      message: "Failed to fetch enrolled courses",
    });
  }
};




