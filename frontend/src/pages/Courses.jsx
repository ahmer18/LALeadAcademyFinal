import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useState } from "react";
import ContentNotFound from "../components/common/ContentNotFound";
import HeadTag from "../components/common/HeadTag";
import LoaderDotted from "../components/common/LoaderDotted";
import CourseCard from "../components/common/CourseCard";
import { FaSearch } from "react-icons/fa";

// ✅ IMPORT STATIC IMAGES
import courseimage1 from "../assets/images/1.jpeg";
import courseimage2 from "../assets/images/2.jpeg";
import courseimage3 from "../assets/images/3.jpeg";

const fetchCourses = async ({ queryKey }) => {
  const [, { page, searchTerm }] = queryKey;
  const res = await axios.get(`${import.meta.env.VITE_BASE_URL}/courses`, {
    params: { page, limit: 9, searchTerm },
  });
  return res.data;
};

const AllCourses = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [inputTerm, setInputTerm] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const { data, isLoading } = useQuery({
    queryKey: ["courses", { page: currentPage, searchTerm }],
    queryFn: fetchCourses,
  });

  const handleSearch = () => {
    setSearchTerm(inputTerm);
    setCurrentPage(1);
  };

  // ✅ STATIC IMAGE MAPPING LOGIC
  const getStaticImage = (courseId, serverImage) => {
    if (courseId === "698f22e6257f6c85b07b084e") return courseimage3;
    if (courseId === "698f236a257f6c85b07b084f") return courseimage2;
    if (courseId === "698f23e5257f6c85b07b0850") return courseimage1;
    return serverImage;
  };

  if (isLoading) return <LoaderDotted />;

  return (
    <>
      <HeadTag title="All Courses | LA Lead Academy" />
      
      {/* 1. PREMIUM HEADER SECTION */}
      <div className="relative overflow-hidden w-full py-20 lg:py-28">
        <div className="absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-slate-50" />
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-100/50 rounded-full blur-[120px]" />
          <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-indigo-100/50 rounded-full blur-[120px]" />
          <div className="absolute inset-0 opacity-[0.03]" 
               style={{ backgroundImage: `radial-gradient(#4f46e5 0.5px, transparent 0.5px)`, backgroundSize: '30px 30px' }} />
        </div>

        <div className="max-w-7xl mx-auto px-6 text-center">
          <span className="inline-block px-4 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-bold uppercase tracking-widest mb-4">
            Our Catalog
          </span>
          <h2 className="text-5xl md:text-7xl font-black text-gray-900 mb-6 leading-tight">
            All <span className="text-blue-900">Courses</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-12">
            Professional leadership and educator training designed to transform your school's impact.
          </p>

          <div className="relative max-w-2xl mx-auto group">
            <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none">
              <FaSearch className="text-gray-400 group-focus-within:text-blue-600 transition-colors" />
            </div>
            <input
              type="text"
              placeholder="Search for your desired course"
              className="w-full pl-14 pr-32 py-5 rounded-2xl bg-white shadow-2xl shadow-blue-900/5 border-none outline-none focus:ring-2 focus:ring-blue-800 transition-all text-lg"
              value={inputTerm}
              onChange={(e) => setInputTerm(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            />
            <button
              onClick={handleSearch}
              className="absolute right-2 top-2 bottom-2 bg-blue-800 text-white px-8 rounded-xl font-bold hover:bg-blue-700 transition-all active:scale-95 shadow-lg shadow-blue-200"
            >
              Search
            </button>
          </div>
        </div>
      </div>

      {/* 2. COURSE GRID SECTION */}
      <div className="max-w-7xl mx-auto px-6 pb-24">
        {data.courses?.length === 0 ? (
          <ContentNotFound title="No Courses Found" />
        ) : (
          <div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
              {data.courses?.map((course) => (
                <CourseCard 
                  key={course._id} 
                  course={{
                    ...course,
                    image: getStaticImage(course._id, course.image) // Intercept image here
                  }} 
                />
              ))}
            </div>

            {/* 3. PREMIUM PAGINATION */}
            <div className="mt-20 flex justify-center items-center gap-4">
              <button
                disabled={currentPage === 1}
                onClick={() => {
                   setCurrentPage((p) => p - 1);
                   window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="px-6 py-3 rounded-xl bg-white border border-gray-200 font-bold text-gray-600 hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all shadow-sm"
              >
                « Previous
              </button>

              <div className="flex items-center bg-gray-100 px-6 py-3 rounded-xl font-bold text-gray-700">
                Page {currentPage} of {data.totalPages}
              </div>

              <button
                disabled={!data.hasNextPage}
                onClick={() => {
                  setCurrentPage((p) => p + 1);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="px-6 py-3 rounded-xl bg-white border border-gray-200 font-bold text-gray-600 hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all shadow-sm"
              >
                Next »
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default AllCourses;

/* ORIGINAL CODE COMMENTED OUT:

const AllCoursesOriginal = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [inputTerm, setInputTerm] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const { data, isLoading } = useQuery({
    queryKey: ["courses", { page: currentPage, searchTerm }],
    queryFn: fetchCourses,
  });

  const handleSearch = () => {
    setSearchTerm(inputTerm);
    setCurrentPage(1);
  };

  if (isLoading) return <LoaderDotted />;

  return (
    <>
      <HeadTag title="All Courses | LA Lead Academy" />
      
      <div className="relative overflow-hidden w-full py-20 lg:py-28">
        <div className="absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-slate-50" />
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-100/50 rounded-full blur-[120px]" />
          <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-indigo-100/50 rounded-full blur-[120px]" />
          <div className="absolute inset-0 opacity-[0.03]" 
               style={{ backgroundImage: `radial-gradient(#4f46e5 0.5px, transparent 0.5px)`, backgroundSize: '30px 30px' }} />
        </div>

        <div className="max-w-7xl mx-auto px-6 text-center">
          <span className="inline-block px-4 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-bold uppercase tracking-widest mb-4">
            Our Catalog
          </span>
          <h2 className="text-5xl md:text-7xl font-black text-gray-900 mb-6 leading-tight">
            All <span className="text-blue-900">Courses</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-12">
            Professional leadership and educator training designed to transform your school's impact.
          </p>

          <div className="relative max-w-2xl mx-auto group">
            <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none">
              <FaSearch className="text-gray-400 group-focus-within:text-blue-600 transition-colors" />
            </div>
            <input
              type="text"
              placeholder="Search for your desired course"
              className="w-full pl-14 pr-32 py-5 rounded-2xl bg-white shadow-2xl shadow-blue-900/5 border-none outline-none focus:ring-2 focus:ring-blue-800 transition-all text-lg"
              value={inputTerm}
              onChange={(e) => setInputTerm(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            />
            <button
              onClick={handleSearch}
              className="absolute right-2 top-2 bottom-2 bg-blue-800 text-white px-8 rounded-xl font-bold hover:bg-blue-700 transition-all active:scale-95 shadow-lg shadow-blue-200"
            >
              Search
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 pb-24">
        {data.courses?.length === 0 ? (
          <ContentNotFound title="No Courses Found" />
        ) : (
          <div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
              {data.courses?.map((course) => (
                <CourseCard key={course._id} course={course} />
              ))}
            </div>

            <div className="mt-20 flex justify-center items-center gap-4">
              <button
                disabled={currentPage === 1}
                onClick={() => {
                   setCurrentPage((p) => p - 1);
                   window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="px-6 py-3 rounded-xl bg-white border border-gray-200 font-bold text-gray-600 hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all shadow-sm"
              >
                « Previous
              </button>

              <div className="flex items-center bg-gray-100 px-6 py-3 rounded-xl font-bold text-gray-700">
                Page {currentPage} of {data.totalPages}
              </div>

              <button
                disabled={!data.hasNextPage}
                onClick={() => {
                  setCurrentPage((p) => p + 1);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="px-6 py-3 rounded-xl bg-white border border-gray-200 font-bold text-gray-600 hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all shadow-sm"
              >
                Next »
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
};
*/