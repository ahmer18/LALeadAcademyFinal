import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { useFeedback } from "../../providers/FeedbackProvider";
import Swal from "sweetalert2";
import { FaChalkboardTeacher, FaCheck, FaTimes } from "react-icons/fa";
import ContentNotFound from "../../components/common/ContentNotFound";
import LoaderSpinner from "../../components/common/LoaderSpinner";
import useAuth from "../../hooks/useAuth";
import useAxiosSecure from "../../hooks/useAxiosSecure";

const PendingTeachers = () => {
  const [page, setPage] = useState(1);
  const queryClient = useQueryClient();
  const axiosSecure = useAxiosSecure();
  const { showFeedback } = useFeedback();
  const { user } = useAuth();

  const { data, isLoading } = useQuery({
    queryKey: ["teachersData", page],
    queryFn: () => fetchTeachers(page),
    enabled: user.accessToken !== null,
  });

  const fetchTeachers = async (page = 1, limit = 10) => {
    const { data } = await axiosSecure.get(
      `/teachers?page=${page}&limit=${limit}`
    );
    return data;
  };

  const statusMutation = useMutation({
    mutationFn: async ({ id, status }) => {
      return await axiosSecure.patch(`/change-teacher-status/${id}`, {
        status,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["teachersData"]);
      showFeedback("Status updated successfully!", "success");
    },
    onError: () => {
      showFeedback("Failed to update status.", "error");
    },
  });

  const handleStatusChange = (id, status) => {
    Swal.fire({
      title: `${status === 'approved' ? 'Approve' : 'Reject'} Teacher?`,
      text: `Are you sure you want to ${status} this application?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: `Yes, ${status}`,
      confirmButtonColor: status === 'approved' ? '#059669' : '#dc2626',
      cancelButtonColor: '#94a3b8',
      shape: 'rounded-2xl'
    }).then((result) => {
      if (result.isConfirmed) {
        statusMutation.mutate({ id, status });
      }
    });
  };

  const handleNextPage = () => {
    if (data.hasNextPage) setPage((p) => p + 1);
  };

  const handlePrevPage = () => {
    if (page > 1) setPage((p) => p - 1);
  };

  if (isLoading) return <div className="min-h-screen flex items-center justify-center"><LoaderSpinner /></div>;

  return (
    <div className="p-6 md:p-10 bg-slate-50 min-h-screen">
      {/* Header Section */}
      <div className="mb-10">
        <h2 className="text-3xl font-black text-slate-900 flex items-center gap-3 tracking-tight">
          <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center text-blue-800">
            <FaChalkboardTeacher size={20} />
          </div>
          Teacher Applications
        </h2>
        <p className="text-slate-500 font-medium mt-2">Review pending requests to join the teaching faculty.</p>
      </div>

      {data?.teachers?.length === 0 ? (
        <div className="bg-white rounded-[2rem] p-16 text-center border border-slate-100 shadow-sm mt-8">
          <div className="w-20 h-20 rounded-full bg-slate-50 flex items-center justify-center mx-auto mb-6">
            <FaChalkboardTeacher className="text-slate-300 text-2xl" />
          </div>
          <h3 className="text-xl font-black text-slate-800 mb-2">No Applications Found</h3>
          <p className="text-slate-500 font-medium text-sm">There are currently no new teacher requests to review.</p>
        </div>
      ) : (
        <div className="bg-white rounded-[2rem] shadow-xl shadow-slate-200/40 border border-slate-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-100">
                  <th className="px-6 py-5 text-xs font-bold text-slate-400 uppercase tracking-widest whitespace-nowrap">Applicant</th>
                  <th className="px-6 py-5 text-xs font-bold text-slate-400 uppercase tracking-widest whitespace-nowrap">Professional Title</th>
                  <th className="px-6 py-5 text-xs font-bold text-slate-400 uppercase tracking-widest whitespace-nowrap">Experience</th>
                  <th className="px-6 py-5 text-xs font-bold text-slate-400 uppercase tracking-widest whitespace-nowrap">Category</th>
                  <th className="px-6 py-5 text-xs font-bold text-slate-400 uppercase tracking-widest whitespace-nowrap">Status</th>
                  <th className="px-6 py-5 text-xs font-bold text-slate-400 uppercase tracking-widest whitespace-nowrap text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {data?.teachers?.map((teacher) => (
                  <tr key={teacher._id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <img
                          src={teacher.photoURL || "https://randomuser.me/api/portraits/lego/1.jpg"}
                          alt="profile"
                          className="w-12 h-12 rounded-full object-cover border border-slate-200 shadow-sm"
                        />
                        <p className="font-bold text-slate-900 leading-none">{teacher.name}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-slate-600 font-medium">{teacher.title}</td>
                    <td className="px-6 py-4 text-slate-600 font-medium">{teacher.experience}</td>
                    <td className="px-6 py-4 text-slate-600 font-medium">{teacher.category}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold tracking-wide uppercase
                        ${teacher.status === 'approved' ? 'bg-emerald-50 text-emerald-700' :
                          teacher.status === 'rejected' ? 'bg-red-50 text-red-700' :
                          'bg-amber-50 text-amber-700'}`}
                      >
                        {teacher.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right space-x-2">
                      <button
                        title="Approve"
                        disabled={teacher.status === "approved" || teacher.status === "rejected"}
                        onClick={() => handleStatusChange(teacher._id, "approved")}
                        className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 hover:bg-emerald-500 hover:text-white disabled:opacity-30 disabled:hover:bg-emerald-50 disabled:hover:text-emerald-600 transition-all shadow-sm"
                      >
                        <FaCheck size={14} />
                      </button>
                      <button
                        title="Reject"
                        disabled={teacher.status === "approved" || teacher.status === "rejected"}
                        onClick={() => handleStatusChange(teacher._id, "rejected")}
                        className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-red-50 text-red-600 hover:bg-red-500 hover:text-white disabled:opacity-30 disabled:hover:bg-red-50 disabled:hover:text-red-600 transition-all shadow-sm"
                      >
                        <FaTimes size={14} />
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
              Page {page} of {data?.totalPages || 1}
            </span>
            <div className="flex gap-2">
              <button
                disabled={page === 1}
                onClick={handlePrevPage}
                className="px-5 py-2.5 rounded-xl text-sm font-bold bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-slate-900 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm"
              >
                Previous
              </button>
              <button
                disabled={!data?.hasNextPage}
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
};

export default PendingTeachers;
