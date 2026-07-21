import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useNavigate, useParams } from "react-router";
import {
  FaUsers,
  FaStar,
  FaUserTie,
  FaClock,
  FaCheckCircle,
  FaBookOpen,
  FaShieldAlt,
} from "react-icons/fa";
import LoaderSpinner from "../../components/common/LoaderSpinner";
import useAuth from "../../hooks/useAuth";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import { HiSparkles } from "react-icons/hi2";

const CourseDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();

  const { data: course = null, isLoading } = useQuery({
    queryKey: ["course", id],
    queryFn: async () => {
      const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/courses/${id}`);
      return response.data.course;
    },
  });

  const { data: enrollment = null, isLoading: isStatusLoading } = useQuery({
    queryKey: ["enrollment-status", id, user?.email],
    queryFn: async () => {
      const response = await axiosSecure.get(`/enrollment-status/${id}`);
      return response.data;
    },
    enabled: !!user?.email && !!id,
  });

  const isEnrolled = !!enrollment?.email;
  const isStaff = user?.role === "teacher" || user?.role === "admin";

  const handlePay = () => {
    navigate(`/payment/${id}`);
  };

  if (isLoading) return <LoaderSpinner />;
  if (!course) return <div className="text-center py-20 text-xl font-semibold">Course not found</div>;

  return (
    <div className="min-h-screen pb-20">

      {/* 1. HERO SECTION: TITLE ON LEFT, IMAGE INDEPENDENT ON RIGHT */}
      <div className="relative overflow-hidden pt-24 pb-16 lg:pt-32 lg:pb-40 z-0">
        <div className="absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-slate-50" />
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-100/50 rounded-full blur-[120px]" />
          <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-indigo-100/50 rounded-full blur-[120px]" />
          <div className="absolute inset-0 opacity-[0.03]"
            style={{ backgroundImage: `radial-gradient(#4f46e5 0.5px, transparent 0.5px)`, backgroundSize: '30px 30px' }} />
        </div>

        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left: Title & Info */}
          <div>
            <span className="inline-block px-4 py-1 bg-blue-900 text-white rounded-full text-[10px] font-black uppercase tracking-[0.2em] mb-6 shadow-lg shadow-blue-300">
              Professional Certification
            </span>
            <h1 className="text-4xl md:text-6xl font-black text-gray-900 mb-8 leading-tight tracking-tight">
              {course.title}
            </h1>

            <div className="flex flex-wrap gap-8">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-white shadow-sm border border-gray-100 flex items-center justify-center">
                  <FaUserTie className="text-blue-900 text-xl" />
                </div>
                <div>
                  <p className="text-[10px] uppercase text-gray-400 font-bold tracking-widest">Instructor</p>
                  <p className="font-bold text-gray-900">{course.instructor?.displayName || "Lead Faculty"}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-amber-50 rounded-xl border border-amber-100">
                <FaStar className="text-amber-500" />
                <span className="font-bold text-amber-900">{course.rating || "4.9"}</span>
              </div>
            </div>
          </div>

          {/* Right: Independent Course Image */}
          <div className="relative group justify-self-center lg:justify-self-end w-full max-w-md">
            <div className="absolute -inset-4 bg-blue-600/5 rounded-[2.5rem] blur-2xl group-hover:bg-blue-600/10 transition-all duration-500" />
            <img
              src={course.image}
              alt={course.title}
              className="relative w-full h-[300px] lg:h-[400px] object-cover rounded-[2rem] shadow-2xl border-4 border-white"
            />
          </div>
        </div>
      </div>

      {/* 2. CONTENT SECTION: PRICE CARD BENEATH THE HERO */}
      <div className="max-w-7xl mx-auto px-6 -mt-20 relative z-20">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">

          {/* LEFT: UNIFIED COURSE OVERVIEW CARD */}
          <div className="lg:col-span-2">
            <div className="bg-white p-10 lg:p-12 rounded-[2.5rem] shadow-xl border border-gray-50 h-full">

              {/* 1. Course Vision Section */}
              <div className="mb-10">
                <h3 className="flex items-center gap-3 text-2xl font-black mb-6 text-gray-900 uppercase tracking-tight">
                  <FaBookOpen className="text-blue-900" />
                  Course Vision
                </h3>
                <p className="text-xl text-gray-600 leading-relaxed italic whitespace-pre-line">
                  {course.description}
                </p>
              </div>

              {/* Horizontal Divider */}
              <div className="border-t border-gray-100 my-10" />



              {/* Horizontal Divider */}
              <div className="border-t border-gray-100 my-10" />

              {/* 3. Learning Outcomes Section */}
              <div>
                <h4 className="text-xl font-bold text-gray-900 mb-8 flex items-center gap-3">

                  Learning Outcomes:
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {(course.outcomes || []).map((item, i) => (
                    <div
                      key={i}
                      className="flex items-start gap-4 p-5 bg-slate-50 rounded-2xl border border-transparent hover:border-blue-100 hover:bg-white transition-all group"
                    >
                      <FaCheckCircle className="text-blue-900 mt-1 group-hover:scale-110 transition-transform shrink-0" />
                      <span className="text-gray-700 font-semibold leading-snug">{item}</span>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </div>
          {/* RIGHT: PRICE & ACTION CARD (BENEATH THE IMAGE AREA) */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-[2.5rem] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.15)] border border-gray-100 p-8 sticky top-28">
              <div className="mb-8">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest text-emerald-600 bg-emerald-50 border border-emerald-300 animate-pulse shadow-[0_0_12px_rgba(16,185,129,0.4)] hover:shadow-[0_0_22px_rgba(16,185,129,0.7)] transition-shadow duration-300">
                  Big Discounted Price!
                </span>
                <div className="flex items-end gap-2 mt-3">
                  <span className="text-5xl font-black text-gray-900">${course.price || "199"}</span>
                  {course.originalPrice && (
                    <span className="text-gray-400 font-bold mb-2 line-through opacity-50">${course.originalPrice}</span>
                  )}
                </div>
              </div>

              <button
                onClick={handlePay}
                disabled={isEnrolled || isStaff}
                className={`w-full py-5 rounded-2xl font-black text-lg shadow-xl transition-all mb-8 ${isEnrolled || isStaff
                  ? isStaff ? "bg-amber-50 text-amber-600 cursor-not-allowed border border-amber-200" : "bg-gray-100 text-gray-400 cursor-not-allowed shadow-none border border-gray-200"
                  : "bg-blue-900 text-white shadow-blue-200 hover:bg-blue-800 active:scale-[0.98]"
                  }`}
              >
                {isEnrolled ? "Already Enrolled" : isStaff ? "You are not a Student" : "Enroll Now"}
              </button>

              <div className="space-y-5 border-t border-gray-50 pt-8">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-3 text-gray-500 font-bold uppercase tracking-wider">
                    <FaClock className="text-blue-900 font-normal" /> Duration
                  </div>
                  <span className="font-black text-gray-900">{course.duration || "TBA"}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-3 text-gray-500 font-bold uppercase tracking-wider">
                    <FaUsers className="text-blue-900" /> Enrolled
                  </div>
                  <span className="font-black text-gray-900 text-sm">
                    {(course.totalEnrolled || 0) + 178} Students
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-3 text-gray-500 font-bold uppercase tracking-wider">
                    <FaShieldAlt className="text-blue-900" /> Security
                  </div>
                  <span className="font-black text-gray-900">Encrypted Payment</span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default CourseDetails;