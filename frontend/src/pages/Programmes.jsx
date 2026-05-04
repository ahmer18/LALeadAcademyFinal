import { useState } from "react";
import { Link } from "react-router";
import HeadTag from "../components/common/HeadTag";
import { FaSearch, FaClock, FaArrowRight } from "react-icons/fa";

// Import your static images
import courseimage1 from "../assets/images/1.jpeg";
import courseimage2 from "../assets/images/2.jpeg";
import courseimage3 from "../assets/images/3.jpeg";

// YOUR STATIC DATA (Keep this identical to your Details page)
const STATIC_PROGRAMMES = [
  {
    _id: "698f22e6257f6c85b07b084e",
    title: "Leading from Within",
    subtitle: "Strengthening your inner leadership for lasting impact.",
    duration: "5 hrs",
    image: courseimage3,
  },
  {
    _id: "698f236a257f6c85b07b084f",
    title: "Reimagining Effective Teaching Through Inquiry",
    subtitle: "Elevating practice through purposeful inquiry.",
    duration: "7 hrs",
    image: courseimage2,
  },
  {
    _id: "698f23e5257f6c85b07b0850",
    title: "Student Focus in the Digital Age",
    subtitle: "Restoring human depth in a digital world.",
    duration: "3 hrs",
    image: courseimage1,
  }
];

const Programmes = () => {
  const [searchTerm, setSearchTerm] = useState("");

  // Filter logic for the search bar
  const filteredProgrammes = STATIC_PROGRAMMES.filter(p => 
    p.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <HeadTag title="All Programmes | LA Lead Academy" />
      
      {/* HERO SECTION */}
      <div className="relative overflow-hidden w-full py-24 lg:py-32 bg-[#0a192f] text-white">
        {/* PREMIUM BACKGROUND ARCHITECTURE */}
        <div className="absolute inset-0 z-0">
          {/* Deep Ambient Glows */}
          <div className="absolute -top-24 -left-24 w-96 h-96 bg-blue-900/30 rounded-full blur-[100px] opacity-60" />
          <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-indigo-900/20 rounded-full blur-[100px] opacity-60" />
          
          {/* Subtle Architectural Grid */}
          <div className="absolute inset-0 opacity-[0.05]" 
            style={{ 
              backgroundImage: `linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)`,
              backgroundSize: '40px 40px'
            }} 
          />
        </div>

        <div className="max-w-7xl mx-auto px-6 text-center relative z-10">
          <h2 className="text-4xl md:text-8xl font-black mb-8 leading-none italic tracking-tighter">
            <span className="text-white opacity-90">Our </span>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-cyan-300 to-blue-500 animate-pulse"
              style={{ WebkitTextStroke: "0.5px rgba(255,255,255,0.2)", paintOrder: "stroke fill" }}>
              Programmes
            </span>
          </h2>
          <p className="text-xl text-slate-300 max-w-2xl mx-auto mb-12">
            Professional leadership and educator training designed for lasting impact.
          </p>

          {/* SEARCH BAR - ELITE DESIGN */}
          <div className="relative max-w-2xl mx-auto group">
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-cyan-500 rounded-[2rem] blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
            <div className="relative flex items-center bg-white rounded-[1.5rem] overflow-hidden shadow-2xl transition-all duration-300 border border-white/10">
              <div className="pl-6 flex items-center pointer-events-none">
                <FaSearch className="text-slate-400" />
              </div>
              <input
                type="text"
                placeholder="Search our signature programmes..."
                className="w-full px-6 py-5 bg-transparent text-slate-900 outline-none text-lg font-medium placeholder:text-slate-400"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </div>
      </div>

      {/* PROGRAMMES GRID */}
      <div className="max-w-7xl mx-auto px-6 py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProgrammes.map((prog) => (
            <Link 
              to={`/Programmes/${prog._id}`} 
              key={prog._id}
              className="group bg-white rounded-[32px] overflow-hidden border border-gray-100 shadow-sm hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 flex flex-col h-full"
            >
              <div className="relative h-64 overflow-hidden">
                <img 
                  src={prog.image} 
                  alt={prog.title} 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-black text-slate-900 flex items-center gap-1">
                  <FaClock /> {prog.duration}
                </div>
              </div>

              <div className="p-8 flex flex-col flex-grow">
                <h3 className="text-xl font-black text-slate-900 mb-3 group-hover:text-blue-700 transition-colors uppercase leading-tight">
                  {prog.title}
                </h3>
                <p className="text-slate-500 text-sm mb-6 line-clamp-2">
                  {prog.subtitle}
                </p>
                
                <div className="mt-auto pt-6 border-t border-slate-50 flex items-center justify-between">
                  <span className="text-[10px] font-black tracking-widest text-slate-400 uppercase">View Details</span>
                  <div className="bg-slate-900 text-white p-3 rounded-xl group-hover:bg-blue-700 group-hover:translate-x-1 transition-all">
                    <FaArrowRight size={12} />
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {filteredProgrammes.length === 0 && (
          <div className="text-center py-20">
            <p className="text-gray-500 text-xl font-medium">No programmes found matching your search.</p>
          </div>
        )}
      </div>
    </>
  );
};

export default Programmes;