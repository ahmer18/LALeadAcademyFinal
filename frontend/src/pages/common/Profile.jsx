import { useState, useEffect } from "react";
import { FaCamera, FaEnvelope, FaUserShield, FaBookOpen, FaPen, FaCheck, FaTimes } from "react-icons/fa";
import { useQuery } from "@tanstack/react-query";
import HeadTag from "../../components/common/HeadTag";
import useAuth from "../../hooks/useAuth";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import handleUpload from "../../utils/ImageUploadApi";
import CourseCard from "../../components/common/CourseCard";
import LoaderDotted from "../../components/common/LoaderDotted";
import { useFeedback } from "../../providers/FeedbackProvider";

export default function UserProfile() {
  const { user, updateUserProfile, setUser } = useAuth();
  const axiosSecure = useAxiosSecure();
  const { showFeedback } = useFeedback();
  const [uploading, setUploading] = useState(false);

  // Name editing state
  const [isEditingName, setIsEditingName] = useState(false);
  const [editName, setEditName] = useState("");
  const [savingName, setSavingName] = useState(false);

  useEffect(() => {
    if (user?.displayName) setEditName(user.displayName);
  }, [user?.displayName]);

  // Fetch Courses based on Role
  const { data: roleCourses = [], isLoading: loadingCourses } = useQuery({
    queryKey: ['profileCourses', user?.email, user?.role],
    queryFn: async () => {
      if (!user?.email || user?.role === 'admin') return [];
      if (user?.role === 'teacher') {
        const res = await axiosSecure.get(`/courses/teacher/${user.email}`);
        return res.data.courses || [];
      } else {
        const res = await axiosSecure.get(`/courses/enrolled/${user.email}`);
        return res.data.enrolledCourses?.map(enc => ({
           ...enc.courseInfo,
           instructor: enc.instructor
        })) || [];
      }
    },
    enabled: !!user?.email
  });

  if (!user) return <div className="min-h-screen flex items-center justify-center"><LoaderDotted /></div>;

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      setUploading(true);
      const newPhotoURL = await handleUpload(file);

      if (newPhotoURL) {
        await updateUserProfile(user.displayName, newPhotoURL);
        
        await axiosSecure.patch("/users/update-profile", {
          email: user.email,
          name: user.displayName,
          photoURL: newPhotoURL,
        });

        setUser({ ...user, photoURL: newPhotoURL });
        showFeedback("Profile picture updated!", "success");
      }
    } catch (error) {
      console.error(error);
      showFeedback("Failed to update image", "error");
    } finally {
      setUploading(false);
    }
  };

  const handleNameSave = async () => {
    const trimmed = editName.trim();
    if (!trimmed || trimmed === user.displayName) {
      setIsEditingName(false);
      setEditName(user.displayName || "");
      return;
    }
    setSavingName(true);
    try {
      await updateUserProfile(trimmed, user.photoURL);
      await axiosSecure.patch("/users/update-profile", {
        email: user.email,
        name: trimmed,
        photoURL: user.photoURL,
      });
      setUser({ ...user, displayName: trimmed });
      showFeedback("Name updated successfully!", "success");
      setIsEditingName(false);
    } catch (error) {
      console.error(error);
      showFeedback("Failed to update name", "error");
    } finally {
      setSavingName(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      <HeadTag title="LA Lead Academy | Profile" />

      {/* Hero Cover Section that fully contains the profile card */}
      <div className="w-full bg-gradient-to-r from-[#1B365D] via-blue-900 to-[#1B365D] relative overflow-hidden pt-16 pb-16 md:pt-24 md:pb-24">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="absolute inset-0 opacity-[0.05]" style={{ backgroundImage: `radial-gradient(#ffffff 2px, transparent 2px)`, backgroundSize: '40px 40px' }}></div>
        
        <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10 flex justify-center w-full">
          {/* Profile Info Card */}
          <div className="bg-white/95 backdrop-blur-sm rounded-[2rem] shadow-2xl shadow-black/30 p-8 w-full flex flex-col md:flex-row items-center md:items-start gap-8 border border-white/20">
            
            {/* Profile Photo */}
            <div className="relative group shrink-0 -mt-16 md:-mt-20 mb-4 md:mb-0">
            <div className="w-40 h-40 rounded-full p-2 bg-white shadow-xl shadow-blue-900/10">
              <img
                src={user.photoURL || "/default-avatar.png"}
                alt="Profile"
                className={`w-full h-full rounded-full object-cover border-4 ${uploading ? 'border-slate-200 opacity-50' : 'border-slate-50'}`}
              />
            </div>
            <label className="absolute bottom-4 right-4 bg-blue-800 p-3 rounded-full cursor-pointer hover:bg-blue-700 hover:scale-105 transition-all shadow-lg text-white">
              <FaCamera size={14} />
              <input 
                type="file" className="hidden" accept="image/*" 
                onChange={handleImageChange} disabled={uploading}
              />
            </label>
            {uploading && <p className="text-[10px] text-blue-800 font-extrabold uppercase mt-2 text-center absolute -bottom-6 w-full tracking-widest">Uploading...</p>}
          </div>

          {/* User Details */}
          <div className="flex-1 text-center md:text-left mt-2 md:mt-0">
            <h1 className="text-3xl md:text-4xl font-black text-slate-900 mb-2 flex items-center gap-3 justify-center md:justify-start">
              {isEditingName ? (
                <div className="flex items-center gap-2 w-full max-w-sm">
                  <input
                    type="text"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleNameSave()}
                    className="flex-1 text-2xl font-black border-2 border-blue-300 rounded-xl px-3 py-1 outline-none focus:border-blue-800 transition-colors bg-blue-50/50"
                    autoFocus
                    disabled={savingName}
                  />
                  <button
                    onClick={handleNameSave}
                    disabled={savingName}
                    className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-700 hover:bg-emerald-200 flex items-center justify-center transition-all"
                  >
                    <FaCheck size={14} />
                  </button>
                  <button
                    onClick={() => { setIsEditingName(false); setEditName(user.displayName || ""); }}
                    className="w-9 h-9 rounded-xl bg-red-100 text-red-600 hover:bg-red-200 flex items-center justify-center transition-all"
                  >
                    <FaTimes size={14} />
                  </button>
                </div>
              ) : (
                <>
                  <span className="truncate">{user?.displayName || user?.name || "Member"}</span>
                  <button
                    onClick={() => setIsEditingName(true)}
                    className="w-8 h-8 rounded-lg bg-slate-100 text-slate-400 hover:bg-blue-100 hover:text-blue-800 flex items-center justify-center transition-all shrink-0"
                    title="Edit name"
                  >
                    <FaPen size={11} />
                  </button>
                </>
              )}
            </h1>
            <div className="inline-block px-4 py-1.5 bg-blue-50 text-blue-800 font-bold text-xs uppercase tracking-widest rounded-full mb-8">
              {user.role || "student"} Account
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl">
              <div className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-100">
                <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center text-blue-800 shrink-0">
                  <FaEnvelope size={18} />
                </div>
                <div className="text-left overflow-hidden">
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-1">Email Address</p>
                  <p className="font-bold text-slate-700 truncate">{user.email}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-100">
                <div className="w-12 h-12 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-800 shrink-0">
                  <FaUserShield size={18} />
                </div>
                <div className="text-left">
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-1">Access Level</p>
                  <p className="font-bold text-slate-700 capitalize">{user.role || "Student"}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 mt-12 relative z-10">

        {/* Dynamic Courses Section (Hidden for Admins) */}
        {user?.role !== 'admin' && (
          <div className="pt-4">
            <h2 className="text-2xl font-black text-slate-900 mb-8 flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-800 text-lg">
                <FaBookOpen />
              </div>
              {user.role === 'teacher' ? 'Courses You Teach' : 'Your Enrolled Courses'}
            </h2>
            
            {loadingCourses ? (
              <div className="py-20 flex justify-center"><LoaderDotted /></div>
            ) : roleCourses.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {roleCourses.map((course) => (
                  <div key={course._id} className="h-full">
                    <CourseCard course={course} />
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-[2rem] p-16 text-center border border-slate-100 shadow-sm">
                <div className="w-24 h-24 rounded-full bg-slate-50 flex items-center justify-center mx-auto mb-6">
                  <FaBookOpen className="text-slate-300 text-3xl" />
                </div>
                <h3 className="text-2xl font-black text-slate-800 mb-3">No Courses Found</h3>
                <p className="text-slate-500 font-medium max-w-sm mx-auto">
                  {user.role === 'teacher' 
                    ? "You haven't published any courses yet. Head to your dashboard to create your first course." 
                    : "You haven't enrolled in any courses yet. Explore our catalog to start learning."}
                </p>
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
}