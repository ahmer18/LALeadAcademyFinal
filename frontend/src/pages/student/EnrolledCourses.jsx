import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router";
import LoaderDotted from "../../components/common/LoaderDotted";
import useAuth from "../../hooks/useAuth";
import useAxiosSecure from "../../hooks/useAxiosSecure";

export default function EnrolledCouses() {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();

  const { data: enrolledCourses = [], isLoading } = useQuery({
    queryKey: ["enrolledCourses"],
    queryFn: async () => {
      const response = await axiosSecure.get(
        `/courses/enrolled/${user?.email}`
      );

      // console.log(response.data);
      return response.data.enrolledCourses;
    },
    enabled: user.accessToken !== null,
  });

  if (isLoading) return <LoaderDotted />;

  if (enrolledCourses.length === 0)
    return (
      <div className="h-screen p-10">
        <h2 className="text-2xl font-bold mb-2">Enrolled Courses</h2>
        <p className="text-xl">You are not enrolled in any course yet</p>
      </div>
    );

  return (
    <div
      className="min-h-screen p-6 md:p-10 bg-theme-gradient"

    >
      <div className="mb-12">
        <h1 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight mb-2">My Learning</h1>
        <p className="text-slate-500 font-medium uppercase tracking-[0.2em] text-[10px]">
          Continue where you left off in your enrolled courses
        </p>
        <div className="h-1 w-20 bg-blue-900 rounded-full mt-6" />
      </div>

      {enrolledCourses.length === 0 ? (
        <div className="bg-white rounded-[2rem] p-16 text-center border border-slate-100 shadow-sm max-w-2xl">
          <div className="w-20 h-20 rounded-full bg-slate-50 flex items-center justify-center mx-auto mb-6 text-3xl">📚</div>
          <h3 className="text-2xl font-black text-slate-800 mb-3">No active enrollments</h3>
          <p className="text-slate-500 font-medium">Explore our curriculum to find your first course and start your journey today.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {enrolledCourses.map((course) => (
            <div
              key={course._id}
              className="group bg-white rounded-[2rem] shadow-xl shadow-slate-200/40 border border-slate-100 overflow-hidden flex flex-col hover:scale-[1.02] transition-all duration-500"
            >
              <div className="relative h-48 overflow-hidden">
                <img
                  src={course.courseInfo.image}
                  alt={course.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>

              <div className="p-8 flex flex-col flex-1">
                <div className="inline-block px-3 py-1 bg-blue-50 text-blue-800 text-[10px] font-black uppercase tracking-widest rounded-full mb-4 w-fit">
                  Course Enrollment
                </div>
                <h2 className="text-xl font-black text-slate-900 mb-2 tracking-tight line-clamp-2">
                  {course.courseInfo.title}
                </h2>
                <p className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-8">
                  By <span className="text-blue-900">{course.instructor[0]?.displayName || "Lead Academy Instructor"}</span>
                </p>

                <Link
                  to={`/dashboard/assignments/${course.courseInfo._id}`}
                  className="mt-auto h-14 bg-blue-900 text-white rounded-2xl flex items-center justify-center font-black text-xs uppercase tracking-[0.2em] hover:bg-blue-800 shadow-lg shadow-blue-900/10 active:scale-[0.98] transition-all"
                >
                  Continue Learning →
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
