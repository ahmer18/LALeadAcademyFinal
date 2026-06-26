const { ObjectId } = require("mongodb");
const connectDB = require("../config/dbConnection");

const getCollection = async (name) => { const db = await connectDB(); return db.collection(name); };

// 1. Fetch all enrollments of a course
exports.getEnrollmentsByCourseId = async (req, res) => {
  try {
    const { courseId } = req.params;
    const enrollments = await (await getCollection("enrollments")).find({ courseId: courseId }).toArray();
    res.status(200).json({
      success: true,
      enrollments: enrollments || [],
    });
  } catch (err) {
    res.status(500).send({ message: "Internal server error" });
  }
};

// 2. Get specific enrollment status for a student
exports.getEnrollmentStatus = async (req, res) => {
  try {
    const { courseId } = req.params;
    const userEmail = req.user.email;
    const enrollment = await (await getCollection("enrollments")).findOne({ 
      courseId: new ObjectId(courseId), 
      email: userEmail 
    });
    res.status(200).json(enrollment || { completedModules: [] });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 3. Update student progress
exports.updateModuleProgress = async (req, res) => {
  try {
    const { courseId } = req.params;
    const { completedModuleOrder } = req.body;
    const userEmail = req.user.email;

    const filter = { courseId: new ObjectId(courseId), email: userEmail };
    const update = { $addToSet: { completedModules: parseInt(completedModuleOrder) } };

    const result = await (await getCollection("enrollments")).updateOne(filter, update);
    res.status(200).json({ success: true, message: "Progress saved!" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 4. FOR TEACHER: Get progress for all students (Fixes the crash)
exports.getCourseProgressForTeacher = async (req, res) => {
  try {
    const { courseId } = req.params;
    
    const course = await (await getCollection("courses")).findOne({ _id: new ObjectId(courseId) });
    if (!course) return res.status(404).json({ message: "Course not found" });
    
    const activeModuleOrders = course.modules?.map(m => m.order) || [];
    const totalModules = activeModuleOrders.length;
    const enrollments = await (await getCollection("enrollments")).find({ 
      courseId: new ObjectId(courseId) 
    }).toArray();

    const progressData = enrollments.map(enrol => {
      const completedModulesArray = enrol.completedModules || [];
      const validCompletedCount = completedModulesArray.filter(order => activeModuleOrders.includes(order)).length;
      
      let percent = totalModules > 0 ? Math.round((validCompletedCount / totalModules) * 100) : 0;
      if (percent > 100) percent = 100;
      
      return {
        studentEmail: enrol.email,
        studentName: enrol.name || "Student",
        completedCount: validCompletedCount,
        totalModules,
        progressPercent: percent,
        lastUpdated: enrol.createdAt
      };
    });

    res.status(200).json(progressData);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 5. Add Enrollment
exports.addEnrollment = async (req, res) => {
  try {
    const { paymentId, courseId, email, price, paymentStatus } = req.body;
    
    if (!paymentId) {
      return res.status(400).json({ message: "Payment ID is required" });
    }

    // Verify the payment intent exists and is successful
    const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentId);
    
    if (paymentIntent.status !== 'succeeded') {
      return res.status(400).json({ message: "Payment was not successful" });
    }

    // Ensure this paymentId hasn't been used before
    const existingEnrollment = await (await getCollection("enrollments")).findOne({ paymentId });
    if (existingEnrollment) {
      return res.status(400).json({ message: "Enrollment already exists for this payment" });
    }

    const enrollment = {
      courseId: new ObjectId(courseId),
      email,
      price,
      paymentId,
      paymentStatus: paymentIntent.status,
      createdAt: new Date(),
    };
    
    const result = await (await getCollection("enrollments")).insertOne(enrollment);
    res.status(200).json({ success: true, message: "Enrolled successfully", data: result });
  } catch (err) {
    res.status(500).send({ message: err.message || "Internal server error" });
  }
};

// 6. Stripe Payment Intent
exports.createPaymentIntent = async (req, res) => {
  const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
  const { courseId } = req.body;
  try {
    if (!courseId) {
      return res.status(400).send({ error: "courseId is required" });
    }
    
    const course = await (await getCollection("courses")).findOne({ _id: new ObjectId(courseId) });
    if (!course) {
      return res.status(404).send({ error: "Course not found" });
    }

    const amount = Number(course.price);
    
    if (isNaN(amount) || amount <= 0) {
      return res.status(400).send({ error: "Invalid course price" });
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100),
      currency: "usd",
      payment_method_types: ["card"],
    });
    res.send({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
};