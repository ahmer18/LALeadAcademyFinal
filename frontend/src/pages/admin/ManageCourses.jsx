import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Link } from "react-router";
import { useFeedback } from "../../providers/FeedbackProvider";
import Swal from "sweetalert2";
import { FaBookOpen, FaCheck, FaTimes, FaChartBar } from "react-icons/fa";
import ContentNotFound from "../../components/common/ContentNotFound";
import LoaderSpinner from "../../components/common/LoaderSpinner";
import useAuth from "../../hooks/useAuth";
import useAxiosSecure from "../../hooks/useAxiosSecure";

export default function AllCourses() {
  const queryClient = useQueryClient();
  const axiosSecure = useAxiosSecure();
  const { showFeedback } = useFeedback();
  const [currentPage, setCurrentPage] = useState(1);
  const { user } = useAuth();

  const { data: coursesData = [], isLoading } = useQuery({
    queryKey: ["courses", { page: currentPage }],
    queryFn: async () => {
      const res = await axiosSecure.get(
        `${import.meta.env.VITE_BASE_URL}/courses/all`,
        {
          params: { page: currentPage, limit: 10 },
        }
      );
      return res.data;
    },
    enabled: user.accessToken !== null,
  });

  const updateStatus = useMutation({
    mutationFn: async ({ id, status }) => {
      await axiosSecure.patch(`/courses/change-status/${id}`, {
        status,
      });
    },
    onSuccess: () => {
      showFeedback("Status updated", "success");
      queryClient.invalidateQueries(["courses"]);
    },
    onError: (error) => {
      showFeedback("Failed to update status", "error");
      console.log(error);
    },
  });

  const handleStatusChange = (id, status) => {
    Swal.fire({
      title: `${status === 'approved' ? 'Approve' : 'Reject'} Course?`,
      text: `Are you sure you want to ${status} this course?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: `Yes, ${status}`,
      confirmButtonColor: status === 'approved' ? '#059669' : '#dc2626',
      cancelButtonColor: '#94a3b8',
      shape: 'rounded-2xl'
    }).then((result) => {
      if (result.isConfirmed) {
        updateStatus.mutate({ id, status });
      }
    });
  };

  const handleNextPage = () => {
    if (coursesData.hasNextPage) {
      setCurrentPage((prevPage) => prevPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prevPage) => prevPage - 1);
    }
  };

  if (isLoading) return <div className="min-h-screen flex items-center justify-center"><LoaderSpinner /></div>;

  return (
    <div className="p-6 md:p-10 bg-slate-50 min-h-screen">
      {/* Header Section */}
      <div className="mb-10">
        <h2 className="text-3xl font-black text-slate-900 flex items-center gap-3 tracking-tight">
          <div className="w-12 h-12 rounded-xl bg-cyan-100 flex items-center justify-center text-cyan-800">
            <FaBookOpen size={20} />
          </div>
          Course Management
        </h2>
        <p className="text-slate-500 font-medium mt-2">Oversee all platform courses, approve drafts, and track progress.</p>
      </div>

      {coursesData?.courses?.length === 0 ? (
        <div className="bg-white rounded-[2rem] p-16 text-center border border-slate-100 shadow-sm mt-8">
          <div className="w-20 h-20 rounded-full bg-slate-50 flex items-center justify-center mx-auto mb-6">
            <FaBookOpen className="text-slate-300 text-2xl" />
          </div>
          <h3 className="text-xl font-black text-slate-800 mb-2">No Courses Found</h3>
          <p className="text-slate-500 font-medium text-sm">No courses have been submitted to the platform yet.</p>
        </div>
      ) : (
        <div className="bg-white rounded-[2rem] shadow-xl shadow-slate-200/40 border border-slate-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-100">
                  <th className="px-6 py-5 text-xs font-bold text-slate-400 uppercase tracking-widest whitespace-nowrap">Course Details</th>
                  <th className="px-6 py-5 text-xs font-bold text-slate-400 uppercase tracking-widest whitespace-nowrap">Instructor</th>
                  <th className="px-6 py-5 text-xs font-bold text-slate-400 uppercase tracking-widest whitespace-nowrap">Status</th>
                  {/* <th className="px-6 py-5 text-xs font-bold text-slate-400 uppercase tracking-widest whitespace-nowrap text-center">Progress</th> */}
                  <th className="px-6 py-5 text-xs font-bold text-slate-400 uppercase tracking-widest whitespace-nowrap text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {coursesData.courses.map((course) => (
                  <tr key={course._id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <img
                          src={course.image || "https://placehold.co/600x400/e2e8f0/475569?text=Course"}
                          alt="Course thumbnail"
                          className="w-16 h-12 rounded-lg object-cover border border-slate-200 shadow-sm"
                        />
                        <p className="font-bold text-slate-900 leading-none max-w-[200px] truncate" title={course.title}>
                          {course.title}
                        </p>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-slate-600 font-medium text-sm">{course.instructorEmail}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold tracking-wide uppercase
                        ${course.status === 'approved' ? 'bg-emerald-50 text-emerald-700' :
                          course.status === 'rejected' ? 'bg-red-50 text-red-700' :
                            'bg-amber-50 text-amber-700'}`}
                      >
                        {course.status}
                      </span>
                    </td>
                    {/* <td className="px-6 py-4 text-center">
                      <Link
                        to={`/dashboard/courses/${course._id}`}
                        onClick={(e) => course.status === "pending" && e.preventDefault()}
                        className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-xl font-bold text-xs uppercase tracking-wide transition-all shadow-sm
                          ${course.status === "pending"
                            ? "bg-slate-100 text-slate-400 cursor-not-allowed"
                            : "bg-blue-50 text-blue-700 hover:bg-blue-500 hover:text-white"
                          }`}
                      >
                        <FaChartBar size={12} /> View
                      </Link>
                    </td> */}
                    <td className="px-6 py-4 text-right space-x-2">
                      <button
                        title="Approve"
                        disabled={course.status === "approved" || course.status === "rejected"}
                        onClick={() => handleStatusChange(course._id, "approved")}
                        className="inline-flex items-center justify-center w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 hover:bg-emerald-500 hover:text-white disabled:opacity-30 disabled:hover:bg-emerald-50 disabled:hover:text-emerald-600 transition-all shadow-sm"
                      >
                        <FaCheck size={12} />
                      </button>
                      <button
                        title="Reject"
                        disabled={course.status === "approved" || course.status === "rejected"}
                        onClick={() => handleStatusChange(course._id, "rejected")}
                        className="inline-flex items-center justify-center w-8 h-8 rounded-xl bg-red-50 text-red-600 hover:bg-red-500 hover:text-white disabled:opacity-30 disabled:hover:bg-red-50 disabled:hover:text-red-600 transition-all shadow-sm"
                      >
                        <FaTimes size={12} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Premium Pagination */}
          <div className="px-6 py-6 border-t border-slate-100 flex items-center justify-between bg-slate-50/50">
            <span className="text-sm font-bold text-slate-400">
              Page {currentPage} of {coursesData.totalPages || 1}
            </span>
            <div className="flex gap-2">
              <button
                disabled={currentPage === 1}
                onClick={handlePrevPage}
                className="px-5 py-2.5 rounded-xl text-sm font-bold bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-slate-900 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm"
              >
                Previous
              </button>
              <button
                disabled={!coursesData.hasNextPage}
                onClick={handleNextPage}
                className="px-5 py-2.5 rounded-xl text-sm font-bold bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-slate-900 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
