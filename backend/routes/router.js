const express = require("express");
const router = express.Router();

const verifyToken = require("../middlewares/verifyToken");
const verifyRole = require("../middlewares/verifyRole");

const userController = require("../controllers/userController");
const courseController = require("../controllers/courseController");
const enrollmentController = require("../controllers/enrollmentController");
const assignmentController = require("../controllers/assignmentController");
const feedbackController = require("../controllers/feedbackController");
const utilsController = require("../controllers/utilsController");

// ==========================================
// PUBLIC COURSE CACHE MIDDLEWARE (Optimized for 833ms fix)
// ==========================================
const courseCache = new Map();
const CACHE_TTL = 2 * 60 * 1000; // Cache data for 2 minutes

const cachePublicCourses = (req, res, next) => {
    const page = req.query.page || "1";
    const limit = req.query.limit || "9";
    const search = req.query.searchTerm || "";
    const cacheKey = `approved_p${page}_l${limit}_s_${search}`;

    if (courseCache.has(cacheKey)) {
        const cachedItem = courseCache.get(cacheKey);
        if (Date.now() - cachedItem.timestamp < CACHE_TTL) {
            return res.status(200).json(cachedItem.data);
        }
    }

    // Override BOTH res.json and res.send to ensure data is never swallowed
    const nativeJson = res.json;
    res.json = function (body) {
        if (res.statusCode === 200) {
            courseCache.set(cacheKey, { timestamp: Date.now(), data: body });
        }
        return nativeJson.call(this, body);
    };

    const nativeSend = res.send;
    res.send = function (body) {
        // If it's a stringified JSON body, track it too
        if (res.statusCode === 200 && typeof body === 'string') {
            try {
                courseCache.set(cacheKey, { timestamp: Date.now(), data: JSON.parse(body) });
            } catch (e) { }
        }
        return nativeSend.call(this, body);
    };

    next();
};

// --- Progress ---
router.patch('/update-progress/:courseId', verifyToken, enrollmentController.updateModuleProgress);
router.get("/enrollment-status/:courseId", verifyToken, enrollmentController.getEnrollmentStatus);

// --- Users ---
router.post("/users", userController.createNewUser);
router.get("/users/:email", userController.getUserByEmail);
router.patch("/users/update-profile", verifyToken, userController.updateUserProfile);
router.post("/be-teacher/:userEmail", verifyToken, userController.createNewTeacher);
router.get("/teachers", verifyToken, verifyRole(["admin"]), userController.getAllTeachers);
router.patch("/change-teacher-status/:id", verifyToken, verifyRole(["admin"]), userController.changeTeacherStatus);
router.get("/users", verifyToken, verifyRole(["admin"]), userController.searchUsers);
router.patch("/users/admin/:id", verifyToken, verifyRole(["admin"]), userController.makeAdmin);

// --- Courses ---
router.get("/courses/all", verifyToken, verifyRole(["admin"]), courseController.getAllCoursesAdmin);
router.patch("/courses/change-status/:id", verifyToken, verifyRole(["admin"]), courseController.changeCourseStatus);

// Teacher Section
router.get("/courses/teacher/:email", verifyToken, verifyRole(["teacher"]), courseController.getCoursesByTeacher);
router.post("/courses/add", verifyToken, verifyRole(["teacher"]), courseController.addCourse);
router.patch("/add-module/:id", verifyToken, verifyRole(["teacher"]), courseController.addModuleToCourse);
router.patch("/update-module/:id", verifyToken, verifyRole(["teacher"]), courseController.updateModuleInCourse);
router.patch("/delete-module/:id", verifyToken, verifyRole(["teacher"]), courseController.deleteModuleFromCourse);
router.patch("/courses/:id", verifyToken, verifyRole(["teacher"]), courseController.updateCourse);
router.delete("/courses/:id", verifyToken, verifyRole(["teacher"]), courseController.deleteCourse);
router.get("/instructor/course-progress/:courseId", verifyToken, verifyRole(["teacher"]), enrollmentController.getCourseProgressForTeacher);

// Public Section (Cache injected here)
router.get("/courses", cachePublicCourses, courseController.getApprovedCourses);
router.get("/courses/popular", courseController.getPopularCourses);
router.get("/courses/new", courseController.getNewCourses);
router.get("/courses/:id", courseController.getCourseById);
router.get("/courses/enrolled/:email", verifyToken, courseController.getEnrolledCourses);

// --- Enrollments ---
router.get("/enrollments/:courseId", enrollmentController.getEnrollmentsByCourseId);
router.post("/enrollments", enrollmentController.addEnrollment);
router.post("/create-payment-intent", enrollmentController.createPaymentIntent);

// --- Assignments ---
router.post("/assignments", verifyToken, verifyRole(["teacher"]), assignmentController.addAssignment);
router.get("/assignments/:courseId/:studentEmail", verifyToken, assignmentController.getAssignmentsByCourseAndStudent);
router.get("/assignments/:courseId", assignmentController.getAssignmentsByCourse);
router.get("/submissions/:courseId", verifyToken, assignmentController.getSubmissionsByCourse);
router.post("/submissions", verifyToken, assignmentController.addSubmission);

// --- Feedback ---
router.post("/feedbacks", verifyToken, verifyRole(["student"]), feedbackController.addFeedback);
router.get("/feedbacks", feedbackController.getFeedbacks);
router.patch("/feedbacks/:id", verifyToken, verifyRole(["student"]), feedbackController.updateFeedback);

// --- Utils ---
router.get("/get-ik-signature", utilsController.getIKSignature);
router.get("/statistics", utilsController.getStatistics);

module.exports = router;