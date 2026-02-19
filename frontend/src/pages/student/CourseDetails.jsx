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
import courseimage1 from "../../assets/images/1.jpeg";
import courseimage2 from "../../assets/images/2.jpeg";
import courseimage3 from "../../assets/images/3.jpeg";

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

  // ✅ Image Mapping Logic
  const getStaticImage = (courseId) => {
    if (courseId === "698f22e6257f6c85b07b084e") return courseimage3;
    if (courseId === "698f236a257f6c85b07b084f") return courseimage2;
    if (courseId === "698f23e5257f6c85b07b0850") return courseimage1;
    return course.image;
  };

  return (
    <div className="min-h-screen bg-white pb-20">
      {/* 1. PREMIUM HERO HEADER */}
      <div className="relative overflow-hidden pt-24 pb-16 lg:pt-32 lg:pb-24">
        <div className="absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-slate-50" />
          <div className="absolute top-0 right-0 w-[600px] h-[400px] bg-blue-100/40 rounded-full blur-[120px]" />
          <div className="absolute bottom-0 left-0 w-[600px] h-[400px] bg-indigo-100/30 rounded-full blur-[120px]" />
        </div>

        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
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
                  <p className="text-[10px] uppercase text-gray-400 font-bold tracking-widest">Expert Instructor</p>
                  <p className="font-bold text-gray-900">{course.instructor?.displayName || "N/A"}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-white shadow-sm border border-gray-100 flex items-center justify-center">
                  <FaClock className="text-blue-900 text-xl" />
                </div>
                <div>
                  <p className="text-[10px] uppercase text-gray-400 font-bold tracking-widest">Course Duration</p>
                  <p className="font-bold text-gray-900">
                    {course._id === "698f236a257f6c85b07b084f" && "7 Hours"}
                    {course._id === "698f23e5257f6c85b07b0850" && "3 Hours"}
                    {course._id === "698f22e6257f6c85b07b084e" && "5 Hours"}
                    {!["698f236a257f6c85b07b084f", "698f23e5257f6c85b07b0850", "698f22e6257f6c85b07b084e"].includes(course._id) && "TBA"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="relative group">
            <div className="absolute -inset-4 bg-blue-600/5 rounded-[2.5rem] blur-2xl group-hover:bg-blue-600/10 transition-all duration-500" />
            <img
              /* src={course.image} */
              src={getStaticImage(course._id)} 
              alt={course.title}
              className="relative w-full h-[300px] lg:h-[450px] object-cover rounded-[2rem] shadow-2xl border-4 border-white"
            />
          </div>
        </div>
      </div>

      {/* 2. CONTENT GRID */}
      {/* Main Wrapper: flex and justify-center added to center the inner card */}
<div className="max-w-7xl mx-auto px-6 -mt-8 relative z-20 flex justify-center">
  
  {/* Inner Container: Changed grid to flex and restricted width so it's not too wide */}
  <div className="w-full max-w-4xl space-y-10">
    
    <div className="bg-white p-10 rounded-[2rem] shadow-[0_-10px_40px_-15px_rgba(0,0,0,0.1),0_20px_25px_-5px_rgba(0,0,0,0.1)] border border-gray-50">
      
      {/* Course Vision Header */}
      <h3 className="flex items-center justify-center gap-3 text-2xl font-black mb-8 text-gray-900 uppercase tracking-tight">
        <FaBookOpen className="text-blue-900" />
        Course Vision
      </h3>

      {/* Course Description */}
      <div className="prose prose-lg text-gray-600 mb-12 text-center">
        <p className="leading-relaxed whitespace-pre-line italic text-xl">
          {course.description}
        </p>
        <div className="w-16 h-1 bg-blue-900 mx-auto mt-6 rounded-full" />
      </div>

      {/* Learning Outcomes Header */}
      <h4 className="text-xl font-bold text-gray-900 mb-6 flex items-center justify-center gap-4">
        <span className="w-12 h-px bg-gray-200" />
        Learning Outcomes
        <span className="w-12 h-px bg-gray-200" />
      </h4>

      {outcomes.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {outcomes.map((item, i) => (
            <div key={i} className="flex items-start gap-4 p-5 bg-slate-50 rounded-2xl border border-transparent hover:border-blue-100 hover:bg-white transition-all group">
              <FaCheckCircle className="text-blue-900 mt-1 group-hover:scale-125 transition-transform" />
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
</div>
    </div>
  );
};

export default CourseDetails;