import { useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useState } from "react";
import { useParams, useNavigate } from "react-router";
import AssignmentModal from "../../components/common/AssignmentModal";
import GiveFeedbackModal from "../../components/common/GiveFeedbackModal";
import LoaderDotted from "../../components/common/LoaderDotted";
import useAuth from "../../hooks/useAuth";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import { FaLock, FaPlayCircle, FaQuestionCircle, FaFileAlt, FaCheckCircle, FaBookOpen, FaDownload } from "react-icons/fa";

const CourseAssignments = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAssignmentModalOpen, setIsAssignmentModalOpen] = useState(false);
  const [selectedAssignmentId, setSelectedAssignmentId] = useState(null);
  const axiosSecure = useAxiosSecure();

  // 1. Fetch Course Structure
  const { data: courseInfo = {}, isLoading: courseLoading } = useQuery({
    queryKey: ["courseInfo", courseId],
    queryFn: async () => {
      const { data } = await axiosSecure.get(`/courses/${courseId}`);
      return data.course;
    },
    enabled: !!courseId,
  });

  // 2. Fetch Student Progress
  const { data: enrollmentData = {}, isLoading: progressLoading } = useQuery({
    queryKey: ["enrollmentStatus", courseId],
    queryFn: async () => {
      const { data } = await axiosSecure.get(`/enrollment-status/${courseId}`);
      return data;
    },
    enabled: !!courseId,
  });

  const completedModules = enrollmentData?.completedModules || [];
  const allModules = courseInfo.modules?.sort((a, b) => a.order - b.order) || [];

  // Calculate Progress Percentage - Filtered to only count modules that exist in the current course
  const totalModules = allModules.length;
  const completedInCourse = allModules.filter(m => completedModules.includes(m.order));
  const progressPercent = totalModules > 0
    ? Math.round((completedInCourse.length / totalModules) * 100)
    : 0;

  const onAssignmentSubmit = (assignmentId) => {
    setSelectedAssignmentId(assignmentId);
    setIsAssignmentModalOpen(true);
  };

  if (courseLoading || progressLoading) return <LoaderDotted />;

  return (
    <div className="min-h-screen p-6 pb-20 bg-theme-gradient">
      <div className="max-w-5xl mx-auto">
        {/* Top Header Section */}
        <div className="mb-10 px-4">
          <h1 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tight leading-[1.1] mb-2 mt-15 drop-shadow-sm">
            {courseInfo.title}
          </h1>
          <div className="flex items-center gap-2 mt-4">

            <div className="h-0.5 w-12 bg-slate-200 rounded-full" />
          </div>
        </div>

        {/* Curriculum Header */}
        <div className="mb-12 px-4 text-left">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-2xl bg-blue-900/5 text-blue-900 flex items-center justify-center border border-blue-900/10 shadow-inner">
              <FaBookOpen size={18} />
            </div>
            <div>
              <h2 className="text-xl font-black text-gray-900 tracking-tight">Curriculum Roadmap</h2>
              <p className="text-xs text-gray-600 font-bold uppercase tracking-widest mt-0.5">Explore your learning modules below</p>
            </div>
          </div>
          <p className="text-gray-600 font-medium leading-relaxed max-w-2xl text-medium">
            Your course consists of <span className="text-blue-900 font-black">{totalModules} modules</span>.
            Please complete them in order to qualify for your professional certification.
          </p>
        </div>

        {/* Modules List */}
        <div className="space-y-4 mb-20">
          {allModules.map((module, index) => {
            const isCompleted = completedModules.includes(module.order);
            const isFirst = index === 0;
            const previousModule = !isFirst ? allModules[index - 1] : null;
            const isUnlocked = isFirst || completedModules.includes(previousModule?.order);
            const isNext = isUnlocked && !isCompleted && (isFirst || completedModules.includes(previousModule?.order));

            return (
              <div
                key={index}
                className={`flex items-center justify-between p-5 border-2 rounded-xl transition-all ${isUnlocked
                  ? "bg-white border-slate-50 shadow-sm"
                  : "bg-gray-50 border-transparent opacity-60"
                  }`}
              >
                <div className="flex items-center gap-5">
                  <div className={`text-2xl ${isCompleted ? "text-green-500" : isUnlocked ? "text-blue-900" : "text-gray-400"}`}>
                    {isCompleted ? <FaCheckCircle /> : !isUnlocked ? <FaLock /> : (
                      <FaBookOpen className="text-[#8d6e3e]" />
                    )}
                  </div>
                  <div>
                    <div className="flex items-center gap-3">
                      <span className="text-[10px] font-black px-2 py-0.5 rounded bg-gray-100 text-gray-500 uppercase">
                        Module {module.order}
                      </span>
                      <span className="text-xs font-bold text-[#8d6e3e] uppercase">
                        {module.blocks?.length || 0} Blocks
                      </span>
                    </div>
                    <h4 className={`mt-2 text-base font-bold ${isUnlocked ? "text-gray-700" : "text-gray-400"}`}>
                      {module.title}
                    </h4>
                    {module.purpose && (
                      <div className={`mt-3 pl-3 text-sm italic border-l-2 ${isUnlocked ? "text-gray-600 border-blue-900" : "text-gray-400 border-gray-300"}`}>
                        {module.purpose}
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  {isUnlocked && module.blocks?.some(b => b.type === 'assignment') && (
                    <button
                      onClick={() => onAssignmentSubmit(module._id)}
                      className="px-4 py-2 border border-amber-500 text-amber-600 rounded-lg text-xs font-bold hover:bg-amber-50"
                    >
                      Submit Assignment
                    </button>
                  )}
                  {isUnlocked ? (
                    <button
                      onClick={() => navigate(`/course/${courseId}/module/${module.order}`, { state: { module } })}
                      className={`px-6 py-2 rounded-lg font-bold text-sm transition-all shadow-sm ${isCompleted
                        ? "bg-green-100 text-green-700 hover:bg-green-200"
                        : "bg-blue-900 text-white hover:bg-blue-800"
                        }`}
                    >
                      {isCompleted ? "Review" : isNext ? "Next" : "Start"}
                    </button>
                  ) : (
                    <div className="flex items-center gap-2 text-gray-400 font-bold px-4">
                      <span className="text-sm uppercase tracking-widest">Locked</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Track Progress (Bottom) Section */}
        <div className="bg-white p-10 rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.05)] border border-slate-100 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-gradient-to-br from-blue-100/30 via-transparent to-transparent -mr-32 -mt-32 blur-3xl rounded-full" />

          <div className="relative z-10">
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center gap-2 text-gray-500 font-bold text-xs uppercase tracking-widest">
                <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="3" fill="none" strokeLinecap="round" strokeLinejoin="round" className="text-blue-900"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"></polyline><polyline points="16 7 22 7 22 13"></polyline></svg>
                Track Your Progress
              </div>
              <div className="text-gray-900 font-black text-xl tracking-tighter">
                {progressPercent}%
              </div>
            </div>

            <div className="flex gap-1.5 h-2.5 mb-5">
              {allModules.map((module, idx) => {
                const completed = completedModules.includes(module.order);
                return (
                  <div
                    key={idx}
                    className={`flex-1 rounded-full transition-all duration-700 ${completed ? "bg-blue-900" : "bg-blue-100/50"}`}
                    style={{ transitionDelay: `${idx * 50}ms` }}
                  />
                );
              })}
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 pt-4 border-t border-slate-50 mt-4">
              <div className="flex items-center gap-2 text-sm text-gray-400 font-bold uppercase tracking-widest text-[12px]">
                <div className={`w-2 h-2 rounded-full ${totalModules - completedInCourse.length === 0 ? 'bg-emerald-400' : 'bg-blue-400'}`} />
                <span>{totalModules - completedInCourse.length} Modules Remaining out of {totalModules}</span>
              </div>

              <div className="flex items-center gap-3">
                <button
                  disabled={progressPercent < 100 || !courseInfo?.certificateUrl}
                  onClick={() => window.open(courseInfo.certificateUrl, "_blank")}
                  className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all shadow-sm active:scale-95 ${progressPercent === 100 && courseInfo?.certificateUrl
                    ? "bg-emerald-600 text-white hover:bg-emerald-700 shadow-lg shadow-emerald-200"
                    : "bg-slate-100 text-slate-400 cursor-not-allowed opacity-60"
                    }`}
                  title={progressPercent < 100 ? "Complete all modules to unlock your certificate" : !courseInfo?.certificateUrl ? "Certificate not available for this course" : "Download your certificate"}
                >
                  <FaDownload size={12} className={progressPercent === 100 ? "animate-bounce" : "opacity-30"} />
                  {progressPercent === 100 ? "Get Certificate" : "Certificate Locked"}
                </button>

                <button
                  onClick={() => setIsModalOpen(true)}
                  className="flex items-center gap-2 px-6 py-3 bg-blue-900/5 text-blue-900 border border-blue-900/10 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-blue-900 hover:text-white transition-all shadow-sm active:scale-95"
                >
                  <FaFileAlt size={12} className="opacity-50" />
                  Give Course Feedback
                </button>
              </div>
            </div>
          </div>
        </div>

        {isModalOpen && (
          <GiveFeedbackModal setIsModalOpen={setIsModalOpen} courseId={courseId} queryClient={queryClient} />
        )}
        {isAssignmentModalOpen && (
          <AssignmentModal
            setIsAssignmentModalOpen={setIsAssignmentModalOpen}
            assignmentId={selectedAssignmentId}
            courseId={courseId}
            queryClient={queryClient}
          />
        )}
      </div>
    </div>
  );
};

export default CourseAssignments;