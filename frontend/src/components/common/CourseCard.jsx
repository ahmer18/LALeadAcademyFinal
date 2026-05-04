import { Link } from "react-router";

const CourseCard = ({ course }) => {
  // 1. Determine the path based on whether it's a Programme or a Course
  const detailPath = course.isProgramme ? `/Programmes/${course._id}` : `/courses/${course._id}`;

  return (
    <Link
      to={detailPath}
      className="bg-white rounded-2xl overflow-hidden border border-gray-100 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_20px_40px_rgba(79,70,229,0.1)] flex flex-col text-left cursor-pointer h-full group"
    >
      {/* Image */}
      <div className="relative w-full h-48 bg-gray-100 overflow-hidden">
        <img
          src={course.image}
          alt={course.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
      </div>

      {/* Content */}
      <div className="p-5 flex-grow flex flex-col justify-between">
        <div>
          <h3 className="text-2xl font-bold text-gray-900 mb-2 leading-tight group-hover:text-blue-600 transition-colors">
            {course.title}
          </h3>
          <p className="text-sm text-gray-500 mb-4 font-medium flex items-center gap-1">
            <span className="opacity-70">by</span> {course.instructor?.[0]?.displayName || "Lead Academy"}
          </p>

          {/* 2. DYNAMIC STATS (Only shows for Courses, hidden for Programmes) */}
          {!course.isProgramme && (
            <div className="flex flex-wrap items-center gap-3 text-sm mb-4">
              <span className="flex items-center gap-1 bg-amber-50 text-amber-600 px-2 py-0.5 rounded-md font-bold">
                ⭐ {course.rating?.toFixed(1) || "4.9"}
              </span>
              <span className="text-gray-400 font-medium">
                {course.totalEnrollments || 0} students
              </span>
              <span className="bg-blue-50 text-blue-700 px-2 py-0.5 rounded-md font-bold text-[10px] uppercase">
                {course.duration || `${course.modules?.length || 0} Modules`}
              </span>
            </div>
          )}
        </div>

        {/* Price and Action */}
        <div className="mt-auto pt-4 border-t border-gray-100 flex justify-between items-center">
          {/* 3. PRICE (Only shows for Courses) */}
          {!course.isProgramme ? (
            <div>
              <span className="block text-[10px] text-gray-400 uppercase font-bold tracking-widest leading-none mb-1">Investment</span>
              <span className="text-2xl font-black text-gray-900">
                £{course.price}
              </span>
            </div>
          ) : (
            <div /> // Empty div to maintain flex spacing for Programmes
          )}
          
          <span className="bg-blue-800 text-white px-5 py-2 rounded-xl text-sm font-bold shadow-lg shadow-blue-100 group-hover:bg-blue-700 group-hover:shadow-blue-200 transition-all">
            View Details
          </span>
        </div>
      </div>
    </Link>
  );
};

export default CourseCard;