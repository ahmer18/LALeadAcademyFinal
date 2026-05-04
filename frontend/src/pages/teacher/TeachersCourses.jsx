// src/pages/teacher/TeachersCourses.jsx
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { useNavigate, Link } from "react-router";
import { useFeedback } from "../../providers/FeedbackProvider";
import Swal from "sweetalert2";
import LoaderDotted from "../../components/common/LoaderDotted";
import useAuth from "../../hooks/useAuth";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import { FaTrash, FaEdit } from "react-icons/fa";

export default function TeachersCourses() {
  const [page, setPage] = useState(1);
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const axiosSecure = useAxiosSecure();
  const { showFeedback } = useFeedback();

  const { data, isLoading, refetch } = useQuery({
    queryKey: ["my-courses", user.email],
    queryFn: async () => {
      const res = await axiosSecure.get(
        `/courses/teacher/${user.email}?page=${page}&limit=9`
      );
      return res.data;
    },
    enabled: user.accessToken !== null,
  });

  const deleteMutation = useMutation({
    mutationFn: async (id) => {
      console.log(id);

      const res = await axiosSecure.delete(`/courses/${id}`);
      return res.data;
    },
    onSuccess: () => {
      showFeedback("Course deleted", "success");
      queryClient.invalidateQueries(["my-courses", user.email]);
    },
    onError: (err) => {
      showFeedback("Failed to delete course", "error");
      console.error(err);
    },
  });

  const handleDelete = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "This action cannot be undone!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#1e3a8a", // blue-900
      cancelButtonColor: "#cbd5e1", // slate-300
      background: "#ffffff",
      customClass: {
        popup: "rounded-[2rem]",
        confirmButton: "rounded-xl px-6 py-3 font-black uppercase tracking-widest text-[10px]",
        cancelButton: "rounded-xl px-6 py-3 font-black uppercase tracking-widest text-[10px]"
      }
    }).then((result) => {
      if (result.isConfirmed) {
        deleteMutation.mutate(id);
      }
    });
  };


  const handleNextPage = () => {
    if (data.hasNextPage) {
      setPage((prevPage) => prevPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (page > 1) {
      setPage((prevPage) => prevPage - 1);
    }
  };

  if (isLoading) return <LoaderDotted />;
  return (
    <>
      <div className="p-4 md:p-8">
        <h2 className="text-3xl font-black text-slate-900 tracking-tight mb-8">My Courses</h2>

        {data.courses?.length === 0 ? (
          <p>You haven't added any courses yet.</p>
        ) : (
          <div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {data.courses?.map((course) => (
                <div
                  key={course._id}
                  className="bg-white rounded-[2rem] border border-slate-100 shadow-xl shadow-slate-200/40 overflow-hidden group hover:-translate-y-1 transition-all duration-300 flex flex-col h-full"
                >
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={course.image}
                      alt="Course"
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute top-4 right-4">
                      <span
                        className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg ${course.status === "approved"
                            ? "bg-emerald-500 text-white"
                            : course.status === "rejected"
                              ? "bg-rose-500 text-white"
                              : "bg-amber-400 text-white"
                          }`}
                      >
                        {course.status}
                      </span>
                    </div>
                  </div>
                  <div className="p-6 flex flex-col flex-1">
                    <div className="flex-1">
                      <h3 className="text-xl font-black text-slate-900 tracking-tight leading-tight mb-2 min-h-[3.5rem] line-clamp-2">
                        {course.title}
                      </h3>

                      <div className="flex items-center justify-between mt-4 pb-4 border-b border-slate-50">
                        <div className="flex flex-col">
                          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Enrollment Fee</span>
                          <span className="text-lg font-black text-blue-900 tracking-tighter">${course.price}</span>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2 mt-6">
                      <Link
                        to={`update/${course._id}`}
                        className="py-2.5 bg-slate-50 text-slate-600 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-blue-50 hover:text-blue-700 transition-all border border-slate-100 flex items-center justify-center gap-2"
                      >
                        <FaEdit size={12} /> Update
                      </Link>
                      <button
                        onClick={() => handleDelete(course._id)}
                        className="py-2.5 bg-rose-50 text-rose-600 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-rose-100 transition-all border border-rose-100/50 flex items-center justify-center gap-2"
                      >
                        <FaTrash size={12} /> Delete
                      </button>

                      {course.status === "approved" ? (
                        <Link
                          to={`${course._id}`}
                          className="col-span-2 py-3 bg-blue-900 text-white rounded-xl text-xs font-black uppercase tracking-[0.1em] hover:bg-blue-800 transition-all shadow-lg shadow-blue-900/20 text-center mt-2"
                        >
                          See Curriculum Details
                        </Link>
                      ) : (
                        <button className="col-span-2 py-3 bg-slate-100 text-slate-400 rounded-xl text-xs font-black uppercase tracking-[0.2em] cursor-not-allowed mt-2">
                          Pending Approval
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination Controls */}
            <div className="mt-16 flex justify-center gap-4">
              <button
                disabled={page === 1}
                onClick={handlePrevPage}
                className="btn btn-primary"
              >
                Previous
              </button>
              <div className="px-4 py-1 border border-gray-300 rounded">
                Page: {page} of {data.totalPages}
              </div>
              <button
                disabled={!data.hasNextPage}
                onClick={handleNextPage}
                className="btn btn-primary"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
