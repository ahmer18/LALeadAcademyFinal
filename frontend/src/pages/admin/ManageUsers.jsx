import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { useFeedback } from "../../providers/FeedbackProvider";
import Swal from "sweetalert2";
import { FaSearch, FaUserShield, FaUsers } from "react-icons/fa";
import LoaderSpinner from "../../components/common/LoaderSpinner";
import useAuth from "../../hooks/useAuth";
import useAxiosSecure from "../../hooks/useAxiosSecure";

export default function AllUsers() {
  const [search, setSearch] = useState("");
  const queryClient = useQueryClient();
  const axiosSecure = useAxiosSecure();
  const { showFeedback } = useFeedback();
  const [page, setPage] = useState(1);
  const { user } = useAuth();

  const { data = {}, isLoading } = useQuery({
    queryKey: ["users", { page, search }],
    queryFn: async () => {
      const res = await axiosSecure.get(`/users?search=${search}&page=${page}`);
      return res.data;
    },
    onError: () => console.error("Failed to fetch users"),
    enabled: user.accessToken !== null,
  });

  const makeAdmin = useMutation({
    mutationFn: async (id) => {
      return await axiosSecure.patch(`/users/admin/${id}`);
    },
    onSuccess: () => {
      showFeedback("User promoted to admin", "success");
      queryClient.invalidateQueries(["users"]);
    },
    onError: () => showFeedback("Failed to promote user", "error"),
  });

  const handleSearch = (e) => {
    e.preventDefault();
    const text = e.target.search.value.trim();
    setSearch(text);
    setPage(1);
  };

  const handleMakeAdmin = (id) => {
    Swal.fire({
      icon: "question",
      title: "Promote to Admin?",
      text: "This user will have full access to the platform.",
      showCancelButton: true,
      confirmButtonText: "Yes, promote",
      confirmButtonColor: "#1e40af",
      cancelButtonColor: "#ef4444",
      shape: "rounded-2xl"
    }).then((result) => {
      if (result.isConfirmed) {
        makeAdmin.mutate(id);
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
      <div className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-3xl font-black text-slate-900 flex items-center gap-3 tracking-tight">
            <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center text-blue-800">
              <FaUsers size={20} />
            </div>
            User Management
          </h2>
          <p className="text-slate-500 font-medium mt-2">View and manage platform accounts and roles.</p>
        </div>

        {/* Search Bar */}
        <form onSubmit={handleSearch} className="relative w-full md:w-80 group">
          <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
            <FaSearch className="text-slate-400 group-focus-within:text-blue-600 transition-colors" />
          </div>
          <input
            name="search"
            type="text"
            placeholder="Search name or email..."
            className="w-full pl-12 pr-24 py-3.5 rounded-2xl bg-white border border-slate-200 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all text-sm font-medium shadow-sm"
          />
          <button
            type="submit"
            className="absolute right-1.5 top-1.5 bottom-1.5 bg-slate-900 text-white px-5 rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-blue-800 transition-colors"
          >
            Find
          </button>
        </form>
      </div>

      {data?.users?.length === 0 ? (
        <div className="bg-white rounded-[2rem] p-16 text-center border border-slate-100 shadow-sm mt-8">
          <div className="w-20 h-20 rounded-full bg-slate-50 flex items-center justify-center mx-auto mb-6">
            <FaSearch className="text-slate-300 text-2xl" />
          </div>
          <h3 className="text-xl font-black text-slate-800 mb-2">No users found</h3>
          <p className="text-slate-500 font-medium text-sm">Try adjusting your search terms.</p>
        </div>
      ) : (
        <div className="bg-white rounded-[2rem] shadow-xl shadow-slate-200/40 border border-slate-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-100">
                  <th className="px-6 py-5 text-xs font-bold text-slate-400 uppercase tracking-widest whitespace-nowrap">User</th>
                  <th className="px-6 py-5 text-xs font-bold text-slate-400 uppercase tracking-widest whitespace-nowrap">Email</th>
                  <th className="px-6 py-5 text-xs font-bold text-slate-400 uppercase tracking-widest whitespace-nowrap">Role</th>
                  <th className="px-6 py-5 text-xs font-bold text-slate-400 uppercase tracking-widest whitespace-nowrap text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {data.users.map((u) => (
                  <tr key={u._id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <img
                          src={u.photoURL || "https://randomuser.me/api/portraits/lego/1.jpg"}
                          alt="avatar"
                          className="w-12 h-12 rounded-full object-cover border border-slate-200 shadow-sm"
                        />
                        <div>
                          <p className="font-bold text-slate-900 leading-none mb-1">{u.name || "N/A"}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-slate-600 font-medium">{u.email}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold tracking-wide uppercase
                        ${u.role === 'admin' ? 'bg-blue-50 text-blue-700' :
                          u.role === 'teacher' ? 'bg-emerald-50 text-emerald-700' :
                            'bg-amber-50 text-amber-700'}`}
                      >
                        {u.role || 'student'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => handleMakeAdmin(u._id)}
                        disabled={u.role === "admin"}
                        className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold tracking-wide uppercase transition-all
                          ${u.role === "admin"
                            ? "bg-slate-100 text-slate-400 cursor-not-allowed"
                            : "bg-blue-50 text-blue-700 hover:bg-blue-600 hover:text-white group-hover:shadow-md"}`}
                      >
                        <FaUserShield size={14} />
                        {u.role === "admin" ? "Is Admin" : "Make Admin"}
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
              Page {page} of {data.totalPages || 1}
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
                disabled={!data.hasNextPage}
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
