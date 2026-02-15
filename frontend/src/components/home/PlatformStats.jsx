import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import statsImage from "../../assets/images/stats.jpg";

export default function PlatformStats() {
  const { data: statistics = [] } = useQuery({
    queryKey: ["statistics"],
    queryFn: async () => {
      const response = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/statistics`
      );
      return response.data.data;
    },
  });

  return (
    <section className="relative min-h-screen w-full flex items-center justify-center snap-start snap-always overflow-hidden py-20">
      
      {/* 1. PREMIUM LIGHT BACKGROUND (Matching Hero) */}
      <div className="absolute inset-0 -z-10">
        {/* Base Light Background */}
        <div className="absolute inset-0 bg-[#f8fafc]" />

        {/* Soft Mesh Glows */}
        <div className="absolute -top-24 -left-24 w-[500px] h-[500px] bg-blue-200 rounded-full blur-[120px] opacity-60" />
        <div className="absolute -bottom-24 -right-24 w-[500px] h-[500px] bg-indigo-100 rounded-full blur-[120px] opacity-60" />

        {/* Subtle Dot Grid Pattern */}
        <div className="absolute inset-0 opacity-[0.04]"
          style={{ 
            backgroundImage: `radial-gradient(#4f46e5 0.5px, transparent 0.5px)`, 
            backgroundSize: '32px 32px' 
          }} 
        />
      </div>

      <div className="max-w-7xl mx-auto px-6 md:px-10 grid grid-cols-1 md:grid-cols-2 gap-16 items-center w-full relative z-10">
        
        {/* Left Side - Stats Content */}
        <div className="flex flex-col justify-center">
          <span className="text-blue-800 font-black uppercase tracking-[0.2em] text-sm mb-4">
            Our Global Impact
          </span>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-gray-900 mb-6 leading-tight tracking-tight">
            Unlock Your Potential with
            <span className="block text-blue-800">LA Lead Academy</span>
          </h2>
          <p className="text-gray-600 text-lg md:text-xl mb-12 font-medium max-w-lg">
            An AI-powered learning platform specifically designed to empower the next generation of teachers.
          </p>
          
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-8">
            <div className="flex flex-col">
              <h3 className="text-5xl md:text-6xl font-black text-gray-900">
                {(statistics?.totalUsers || 0) + 156}<span className="text-blue-800">+</span>
              </h3>
              <p className="font-bold text-gray-400 text-sm uppercase tracking-widest mt-2">Total Users</p>
            </div>
            
            <div className="hidden sm:block w-px h-16 bg-gray-200"></div>
            
            <div className="flex flex-col">
              <h3 className="text-5xl md:text-6xl font-black text-gray-900">
                {statistics?.totalCourses || 0}<span className="text-blue-800">+</span>
              </h3>
              <p className="font-bold text-gray-400 text-sm uppercase tracking-widest mt-2">Courses</p>
            </div>
            
            <div className="hidden sm:block w-px h-16 bg-gray-200"></div>
            
            <div className="flex flex-col">
              <h3 className="text-5xl md:text-6xl font-black text-gray-900">
                {(statistics?.totalEnrollments || 0) + 179}<span className="text-blue-800">+</span>
              </h3>
              <p className="font-bold text-gray-400 text-sm uppercase tracking-widest mt-2">
                Enrollments
              </p>
            </div>
          </div>
        </div>

        {/* Right Side - Image with Premium Frame */}
        <div className="flex justify-center items-center">
          <div className="relative group">
            {/* The outer glow matches the blue theme */}
            <div className="absolute -inset-6 bg-blue-500/10 rounded-full blur-3xl group-hover:bg-blue-500/20 transition-all duration-700"></div>
            
            {/* Decorative border frame */}
            <div className="absolute inset-0 border-2 border-blue-600/5 rounded-3xl translate-x-4 translate-y-4 -z-10"></div>
            
            <img
              src={statsImage}
              alt="Platform Stats"
              className="relative w-full max-w-md rounded-3xl shadow-2xl transform transition hover:scale-[1.01] duration-700 border border-white"
            />
          </div>
        </div>
      </div>
    </section>
  );
}