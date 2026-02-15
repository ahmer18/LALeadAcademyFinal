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
import { toast } from "react-toastify";

// ✅ STATIC OUTCOMES
const COURSE_OUTCOMES = {
  "698f22e6257f6c85b07b084e": [
    "Strategic decision-making under pressure",
    "Knowing when to act and when to delay decisions",
    "Developing leadership presence, discretion, and clarity",
  ],
  "698f236a257f6c85b07b084f": [
    "Inquiry-driven classroom strategies",
    "Deeper student understanding beyond surface learning",
    "Practical teaching frameworks for modern classrooms",
  ],
  "698f23e5257f6c85b07b0850": [
    "Understanding digital distraction and learning",
    "Classroom strategies to improve focus",
    "Building healthy learning habits",
  ],
};

const CourseDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data: course = null, isLoading } = useQuery({
    queryKey: ["course", id],
    queryFn: async () => {
      const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/courses/${id}`);
      return response.data.course;
    },
  });

  const handlePay = () => {
    toast.info("Enrollment is coming soon! We are currently finalizing the course content.", {
      position: "top-center",
      autoClose: 5000,
      theme: "colored",
    });
  };

  if (isLoading) return <LoaderSpinner />;
  if (!course) return <div className="text-center py-20 text-xl font-semibold">Course not found</div>;

  const outcomes = COURSE_OUTCOMES[course._id] || [];

  return (
    <div className="min-h-screen bg-white pb-20">
      {/* 1. PREMIUM HERO HEADER */}
      <div className="relative overflow-hidden pt-24 pb-16 lg:pt-32 lg:pb-24">
        {/* Background Mesh Logic */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-slate-50" />
          <div className="absolute top-0 right-0 w-[600px] h-[400px] bg-blue-100/40 rounded-full blur-[120px]" />
          <div className="absolute bottom-0 left-0 w-[600px] h-[400px] bg-indigo-100/30 rounded-full blur-[120px]" />
        </div>

        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <span className="inline-block px-4 py-1 bg-blue-600 text-white rounded-full text-[10px] font-black uppercase tracking-[0.2em] mb-6 shadow-lg shadow-blue-200">
              Professional Certification
            </span>
            <h1 className="text-4xl md:text-6xl font-black text-gray-900 mb-8 leading-tight tracking-tight">
              {course.title}
            </h1>
            
            <div className="flex flex-wrap gap-8">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-white shadow-sm border border-gray-100 flex items-center justify-center">
                  <FaUserTie className="text-blue-600 text-xl" />
                </div>
                <div>
                  <p className="text-[10px] uppercase text-gray-400 font-bold tracking-widest">Expert Instructor</p>
                  <p className="font-bold text-gray-900">{course.instructor?.displayName || "N/A"}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-white shadow-sm border border-gray-100 flex items-center justify-center">
                  <FaStar className="text-yellow-500 text-xl" />
                </div>
                <div>
                  <p className="text-[10px] uppercase text-gray-400 font-bold tracking-widest">Course Rating</p>
                  <p className="font-bold text-gray-900">{course.rating} / 5.0</p>
                </div>
              </div>
            </div>
          </div>

          <div className="relative group">
            <div className="absolute -inset-4 bg-blue-600/5 rounded-[2.5rem] blur-2xl group-hover:bg-blue-600/10 transition-all duration-500" />
            <img
              src={course.image}
              alt={course.title}
              className="relative w-full h-[300px] lg:h-[450px] object-cover rounded-[2rem] shadow-2xl border-4 border-white"
            />
          </div>
        </div>
      </div>

      {/* 2. CONTENT GRID */}
      <div className="max-w-7xl mx-auto px-6 -mt-8 relative z-20">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* LEFT SIDE: DETAILS */}
          <div className="lg:col-span-2 space-y-10">
            <div className="bg-white p-10 rounded-[2rem] shadow-xl shadow-slate-200/50 border border-gray-50">
              <h3 className="flex items-center gap-3 text-2xl font-black mb-8 text-gray-900 uppercase tracking-tight">
                <FaBookOpen className="text-blue-600" />
                Course Vision
              </h3>

              <div className="prose prose-lg text-gray-600 mb-12">
                <p className="leading-relaxed whitespace-pre-line border-l-4 border-blue-600 pl-8 italic text-xl">
                  {course.description}
                </p>
              </div>

              <h4 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <span className="w-8 h-px bg-blue-600" />
                Learning Outcomes
              </h4>

              {outcomes.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {outcomes.map((item, i) => (
                    <div key={i} className="flex items-start gap-4 p-5 bg-slate-50 rounded-2xl border border-transparent hover:border-blue-100 hover:bg-white transition-all group">
                      <FaCheckCircle className="text-blue-600 mt-1 group-hover:scale-125 transition-transform" />
                      <span className="text-gray-700 font-semibold leading-snug">{item}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-8 border-2 border-dashed border-gray-100 rounded-3xl text-center text-gray-400 italic">
                  Advanced outcomes curriculum being finalized.
                </div>
              )}
            </div>
          </div>

          {/* RIGHT SIDE: PRICING CARD */}
          <div className="lg:col-span-1">
            <div className="bg-[#0a192f] p-10 rounded-[2.5rem] text-white sticky top-28 shadow-2xl shadow-blue-900/20 overflow-hidden relative">
              {/* Subtle mesh inside the card */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/20 rounded-full blur-3xl" />
              
              <div className="relative z-10">
                <div className="flex items-baseline gap-3 mb-1">
                  <span className="text-5xl font-black text-white">${course.price}</span>
                  <span className="text-blue-300/40 line-through text-lg">$120</span>
                </div>
                <p className="text-blue-400 text-xs font-black uppercase tracking-widest mb-10">
                  Limited Time Launch Offer
                </p>

                <div className="space-y-6 mb-10">
                  <div className="flex justify-between items-center py-3 border-b border-white/10">
                    <span className="text-blue-100/60 text-sm font-medium">Global Learners</span>
                    <span className="font-bold flex items-center gap-2"><FaUsers className="text-blue-400" /> {(course.enrollments?.length || 0) + 179}+</span>
                  </div>
                  <div className="flex justify-between items-center py-3 border-b border-white/10">
                    <span className="text-blue-100/60 text-sm font-medium">Access Period</span>
                    <span className="font-bold flex items-center gap-2"><FaClock className="text-blue-400" /> Lifetime</span>
                  </div>
                  <div className="flex justify-between items-center py-3 border-b border-white/10">
                    <span className="text-blue-100/60 text-sm font-medium">Modules</span>
                    <span className="font-bold flex items-center gap-2"> 9</span>
                  </div>
                  <div className="flex justify-between items-center py-3">
                    <span className="text-blue-100/60 text-sm font-medium">Certification</span>
                    <span className="font-bold flex items-center gap-2"><FaShieldAlt className="text-blue-400" /> Yes</span>
                  </div>
                </div>

                <button
                  onClick={handlePay}
                  className="w-full bg-white text-blue-900 py-5 rounded-2xl font-black text-lg hover:bg-blue-50 transition-all shadow-xl active:scale-[0.98] mb-4"
                >
                  Enroll Now
                </button>
                <p className="text-center text-[10px] text-blue-100/40 font-bold uppercase tracking-widest">
                  Secure Checkout • 100% Satisfaction
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseDetails;