// frontend/src/routes/router.jsx
import React, { Suspense, lazy } from "react";
import { createBrowserRouter } from "react-router";
import App from "../App";
import PrivateRoute from "./PrivateRoute";
import RoleBasedRoute from "./RoleBasedRoute";
import LoaderDotted from "../components/common/LoaderDotted";

// Helper to wrap lazy loaded components in Suspense
const lazyLoad = (LazyComponent) => (
  <Suspense fallback={<LoaderDotted />}>
    <LazyComponent />
  </Suspense>
);

// Lazy-loaded pages
const Home = lazy(() => import("../pages/Home"));
const About = lazy(() => import("../pages/About"));
const FAQ = lazy(() => import("../pages/Faq"));
const Courses = lazy(() => import("../pages/Courses"));
const Programmes = lazy(() => import("../pages/Programmes"));
const ProgrammeDetails = lazy(() => import("../pages/ProgrammeDetails"));
const Login = lazy(() => import("../pages/Login"));
const Signup = lazy(() => import("../pages/Signup"));
const BeTeacher = lazy(() => import("../pages/BeTeacher"));
const CourseDetails = lazy(() => import("../pages/student/CourseDetails"));
const StripeWrapper = lazy(() => import("../pages/student/StripeWrapper"));
const ModulePlayer = lazy(() => import("../pages/student/ModulePlayer"));
const Unauthorized = lazy(() => import("../pages/Unauthorized"));
const NotFound = lazy(() => import("../pages/NotFound"));

// Dashboard Pages
const DashBoard = lazy(() => import("../pages/common/Dashboard"));
const Profile = lazy(() => import("../pages/common/Profile"));
const CourseDash = lazy(() => import("../pages/common/CourseDash"));
const CourseAssignments = lazy(() => import("../pages/student/CourseAssignments"));
const AddCourse = lazy(() => import("../pages/teacher/AddCourse"));
const CourseSummery = lazy(() => import("../pages/teacher/CourseSummery"));
const ManageTeachers = lazy(() => import("../pages/admin/ManageTeachers"));
const ManageUsers = lazy(() => import("../pages/admin/ManageUsers"));

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        index: true,
        element: lazyLoad(Home),
      },
      {
        path: "/about",
        element: lazyLoad(About),
      },
      {
        path: "/faq",
        element: lazyLoad(FAQ),
      },
      {
        path: "/courses",
        element: lazyLoad(Courses),
      },
      {
        path: "/Programmes",
        element: lazyLoad(Programmes),
      },
      {
        path: "/Programmes/:id", 
        element: lazyLoad(ProgrammeDetails),
      },
      {
        path: "/login",
        element: lazyLoad(Login),
      },
      {
        path: "/signup",
        element: lazyLoad(Signup),
      },
      {
        path: "/become-teacher",
        element: (
          <PrivateRoute>
            {lazyLoad(BeTeacher)}
          </PrivateRoute>
        ),
      },
      {
        path: "/courses/:id",
        element: lazyLoad(CourseDetails),
      },
      {
        path: "/payment/:id",
        element: (
          <PrivateRoute>
            {lazyLoad(StripeWrapper)}
          </PrivateRoute>
        ),
      },
      {
        path: "course/:courseId/module/:order",
        element: lazyLoad(ModulePlayer)
      },
      {
        path: "/dashboard",
        element: (
          <PrivateRoute>
            {lazyLoad(DashBoard)}
          </PrivateRoute>
        ),
        children: [
          {
            index: true,
            element: lazyLoad(Profile),
          },
          {
            path: "profile",
            element: (
              <PrivateRoute>
                {lazyLoad(Profile)}
              </PrivateRoute>
            ),
          },
          {
            path: "courses",
            element: (
              <PrivateRoute>
                {lazyLoad(CourseDash)}
              </PrivateRoute>
            ),
          },
          {
            path: "assignments/:courseId",
            element: (
              <RoleBasedRoute allowedRoles={["student"]}>
                {lazyLoad(CourseAssignments)}
              </RoleBasedRoute>
            ),
          },
          {
            path: "courses/add",
            element: (
              <RoleBasedRoute allowedRoles={["teacher"]}>
                {lazyLoad(AddCourse)}
              </RoleBasedRoute>
            ),
          },
          {
            path: "courses/update/:id",
            element: (
              <RoleBasedRoute allowedRoles={["teacher"]}>
                {lazyLoad(AddCourse)}
              </RoleBasedRoute>
            ),
          },
          {
            path: "courses/:courseId",
            element: (
              <RoleBasedRoute allowedRoles={["teacher", "admin"]}>
                {lazyLoad(CourseSummery)}
              </RoleBasedRoute>
            ),
          },
          {
            path: "teachers",
            element: (
              <RoleBasedRoute allowedRoles={["admin"]}>
                {lazyLoad(ManageTeachers)}
              </RoleBasedRoute>
            ),
          },
          {
            path: "users",
            element: (
              <RoleBasedRoute allowedRoles={["admin"]}>
                {lazyLoad(ManageUsers)}
              </RoleBasedRoute>
            ),
          },
        ],
      },
      {
        path: "*",
        element: lazyLoad(NotFound),
      },
      {
        path: "unauthorized",
        element: lazyLoad(Unauthorized),
      },
    ],
  },
]);

export default router;
