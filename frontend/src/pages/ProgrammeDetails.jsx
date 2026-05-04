import { useParams, Link } from "react-router";
import { FaClock, FaCheckCircle, FaArrowLeft, FaStar, FaUsers, FaPlayCircle, FaWhatsapp } from "react-icons/fa";
import HeadTag from "../components/common/HeadTag";
import { useQuery } from "@tanstack/react-query";
import useAuth from "../hooks/useAuth";
import useAxiosSecure from "../hooks/useAxiosSecure";

// Static images
import courseimage1 from "../assets/images/1.jpeg";
import courseimage2 from "../assets/images/2.jpeg";
import courseimage3 from "../assets/images/3.jpeg";

const STATIC_PROGRAMMES = [
  {
    _id: "698f22e6257f6c85b07b084e",
    title: "Leading from Within",
    subtitle: "Strengthening your inner leadership for lasting impact.",
    duration: "5 hrs",
    image: courseimage3,
    rating: 4.9,
    students: 1240,
    price: 199,
    description: "This programme focuses on the internal journey of a leader, helping you align your personal values with your professional impact.",
    outcomes: ["Develop self-awareness", "Build resilient teams", "Lead with authentic purpose"]
  },
  {
    _id: "698f236a257f6c85b07b084f",
    title: "Reimagining Effective Teaching Through Inquiry",
    subtitle: "Elevating practice through purposeful inquiry.",
    duration: "7 hrs",
    image: courseimage2,
    rating: 4.8,
    students: 850,
    price: 249,
    description: "Transform your classroom into a hub of curiosity and critical thinking using our inquiry-based framework.",
    outcomes: ["Master inquiry techniques", "Enhance student engagement", "Design reflective lesson plans"]
  },
  {
    _id: "698f23e5257f6c85b07b0850",
    title: "Student Focus in the Digital Age",
    subtitle: "Restoring human depth in a digital world.",
    duration: "3 hrs",
    image: courseimage1,
    rating: 5.0,
    students: 2100,
    price: 149,
    description: "Balance technology and human connection to ensure students remain focused and emotionally grounded.",
    outcomes: ["Digital wellness strategies", "Deep-focus classroom design", "Human-centric tech integration"]
  }
];

const ProgrammeDetails = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();
  
  const programme = STATIC_PROGRAMMES.find((p) => p._id === id);

  const { data: enrollment = null, isLoading: isStatusLoading } = useQuery({
    queryKey: ["enrollment-status", id, user?.email],
    queryFn: async () => {
      const response = await axiosSecure.get(`/enrollment-status/${id}`);
      return response.data;
    },
    enabled: !!user?.email && !!id,
  });

  const isEnrolled = !!enrollment?.email;
  const isStudent = user?.role === "student" || !user; // Allow "Enroll Now" if not logged in or if is student
  const isStaff = user?.role === "teacher" || user?.role === "admin";

  if (!programme) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <h2 className="text-xl font-bold">Programme not found</h2>
      </div>
    );
  }

  return (
    <div className="bg-[#FAF9F6] min-h-screen">
      <HeadTag title={`${programme.title} | LA Lead Academy`} />

      {/* PREMIUM HEADER SECTION */}
      <div className="relative overflow-hidden w-full pt-32 pb-32 bg-[#0a192f] text-white">
        {/* PREMIUM BACKGROUND ARCHITECTURE */}
        <div className="absolute inset-0 z-0">
          <div className="absolute -top-24 -left-24 w-96 h-96 bg-blue-900/30 rounded-full blur-[100px] opacity-60" />
          <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-indigo-900/20 rounded-full blur-[100px] opacity-60" />
          <div className="absolute inset-0 opacity-[0.05]"
            style={{
              backgroundImage: `linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)`,
              backgroundSize: '40px 40px'
            }}
          />
        </div>

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <Link to="/Programmes" className="inline-flex items-center gap-2 text-blue-400 mb-10 text-xs font-black uppercase tracking-widest hover:text-white transition-all group">
            <div className="p-2 bg-white/5 rounded-lg group-hover:bg-blue-600 transition-all">
              <FaArrowLeft size={10} />
            </div>
            Back to All Programmes
          </Link>

          <div className="grid lg:grid-cols-3 gap-12 items-center">
            <div className="lg:col-span-2">
              <h1 className="text-4xl md:text-7xl font-black mb-6 md:mb-8 leading-[1.1] italic tracking-tighter">
                <span className="text-white opacity-90">{programme.title} </span>
              </h1>
              <p className="text-xl text-slate-300 mb-10 max-w-2xl font-medium leading-relaxed">{programme.subtitle}</p>

              <div className="flex flex-wrap gap-8 items-center text-s font-black uppercase tracking-widest">
                <div className="flex items-center gap-2 text-amber-400 bg-white/5 px-4 py-2 rounded-full border border-white/10">
                  <FaStar /> {programme.rating} RATING
                </div>
                <div className="flex items-center gap-2 text-slate-300">
                  <FaUsers className="text-blue-400" /> {programme.students} STUDENTS
                </div>
                <div className="flex items-center gap-2 text-slate-300">
                  <FaClock className="text-blue-400" /> {programme.duration}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CONTENT & SIDEBAR */}
      <div className="max-w-7xl mx-auto px-6 -mt-10 md:-mt-20 pb-20 relative z-20">
        <div className="grid lg:grid-cols-3 gap-12">

          {/* MAIN CONTENT */}
          <div className="lg:col-span-2 pt-16">
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
              <h2 className="text-3xl font-black text-[#1B365D] mb-6">About this programme</h2>
              <p className="text-gray-600 text-lg leading-relaxed mb-10">{programme.description}</p>

              <h3 className="text-2xl font-bold text-[#1B365D] mb-6">What you'll learn</h3>
              <div className="grid md:grid-cols-2 gap-4">
                {programme.outcomes.map((item, i) => (
                  <div key={i} className="flex items-start gap-3 p-4 bg-gray-50 rounded-xl">
                    <FaCheckCircle className="text-green-500 mt-1 shrink-0" />
                    <span className="text-gray-700 font-medium">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* SIDEBAR - THE "INVESTMENT" UI */}
          <div className="lg:-mt-40">
            <div className="bg-white rounded-[32px] overflow-hidden shadow-2xl shadow-blue-900/10 border border-gray-100 lg:sticky lg:top-28">
              <div className="relative group cursor-pointer">
                <img src={programme.image} alt="Preview" className="w-full h-48 object-cover" />
                {/* <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-all flex items-center justify-center">
                  <FaPlayCircle size={50} className="text-white opacity-80" />
                </div> */}
              </div>

              <div className="p-8">
                <div className="mb-6">
                  <span className="text-xs font-black text-gray-400 uppercase tracking-widest block mb-1">Total Investment</span>
                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl font-black text-[#1B365D]">£{programme.price}</span>
                    <span className="text-gray-400 line-through text-lg">£{programme.price + 100}</span>
                  </div>
                </div>

                {isEnrolled ? (
                  <button
                    disabled
                    className="w-full bg-gray-100 text-gray-400 py-4 rounded-2xl font-black text-lg cursor-not-allowed border border-gray-200 mb-4 flex items-center justify-center gap-2"
                  >
                    Already Enrolled
                  </button>
                ) : isStaff ? (
                  <button
                    disabled
                    className="w-full bg-amber-50 text-amber-600 py-4 rounded-2xl font-black text-sm cursor-not-allowed border border-amber-200 mb-4 flex items-center justify-center gap-2 uppercase tracking-widest"
                  >
                    You are not a Student
                  </button>
                ) : (
                  <a
                    href="https://wa.me/905346053958"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full bg-[#25D366] text-white py-4 rounded-2xl font-black text-lg hover:bg-[#128C7E] transition-all shadow-xl shadow-green-100 mb-4 flex items-center justify-center gap-2"
                  >
                    <FaWhatsapp size={24} />
                    Enroll Now
                  </a>
                )}

                {/* <p className="text-center text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                  30-Day Money-Back Guarantee
                </p> */}

                <div className="mt-8 pt-8 border-t border-gray-100">
                  <h4 className="font-bold text-[#1B365D] mb-4">This programme includes:</h4>
                  <ul className="space-y-3 text-sm text-gray-600 font-medium">
                    <li className="flex items-center gap-3">✅ Learning Modules</li>
                    <li className="flex items-center gap-3">✅ Lifetime Learning</li>
                    <li className="flex items-center gap-3">✅ Professional Certificate</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default ProgrammeDetails;