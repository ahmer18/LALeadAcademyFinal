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
router.patch("/delete-module/:id", verifyToken, verifyRole(["teacher"]), courseController.deleteModuleFromCourse); // Single instance
router.patch("/courses/:id", verifyToken, verifyRole(["teacher"]), courseController.updateCourse);
router.delete("/courses/:id", verifyToken, verifyRole(["teacher"]), courseController.deleteCourse);
router.get("/instructor/course-progress/:courseId", verifyToken, verifyRole(["teacher"]), enrollmentController.getCourseProgressForTeacher);

// Public Section
router.get("/courses", courseController.getApprovedCourses);
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