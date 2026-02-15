import { useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useState } from "react";
import { useParams, useNavigate } from "react-router"; 
import AssignmentModal from "../../components/common/AssignmentModal";
import GiveFeedbackModal from "../../components/common/GiveFeedbackModal";
import LoaderDotted from "../../components/common/LoaderDotted";
import useAuth from "../../hooks/useAuth";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import { FaLock, FaPlayCircle, FaQuestionCircle, FaFileAlt, FaCheckCircle } from "react-icons/fa";

const CourseAssignments = () => {
  const { courseId } = useParams();
  const { user } = useAuth();
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
      const { data } = await axios.get(`${import.meta.env.VITE_BASE_URL}/courses/${courseId}`);
      return data.course;
    },
    enabled: !!courseId,
  });

  // 2. Fetch Student Progress
  const { data: enrollmentData = {}, isLoading: progressLoading } = useQuery({
    queryKey: ["enrollmentStatus", courseId, user?.email],
    queryFn: async () => {
      const { data } = await axiosSecure.get(`/enrollment-status/${courseId}`);
      return data;
    },
    enabled: !!user?.email && !!courseId,
  });

  const completedModules = enrollmentData?.completedModules || [];
  const allModules = courseInfo.modules?.sort((a, b) => a.order - b.order) || [];
  
  // Calculate Progress Percentage
  const totalModules = allModules.length;
  const progressPercent = totalModules > 0 
    ? Math.round((completedModules.length / totalModules) * 100) 
    : 0;

  const onAssignmentSubmit = (assignmentId) => {
    setSelectedAssignmentId(assignmentId);
    setIsAssignmentModalOpen(true);
  };

  if (courseLoading || progressLoading) return <LoaderDotted />;

  return (
    <div className="p-6 max-w-5xl mx-auto">
      {/* Progress Section */}
      <div className="mb-10 bg-white p-6 rounded-2xl shadow-sm border border-indigo-50">
        <div className="flex justify-between items-end mb-4">
          <div>
            <h2 className="text-3xl font-bold text-gray-800">Learning Path</h2>
            <p className="text-gray-500 font-medium italic">Course: {courseInfo.title}</p>
          </div>
          <div className="text-right">
             <span className="text-indigo-600 font-black text-2xl">{progressPercent}%</span>
             <p className="text-xs uppercase text-gray-400 font-bold">Complete</p>
          </div>
        </div>
        <div className="w-full bg-gray-100 h-3 rounded-full overflow-hidden">
          <div 
            className="h-full bg-indigo-600 transition-all duration-700 ease-in-out"
            style={{ width: `${progressPercent}%` }}
          ></div>
        </div>
      </div>

      <div className="flex justify-end mb-6">
        <button
          onClick={() => setIsModalOpen(true)}
          className="px-6 py-2 bg-indigo-600 text-white rounded-lg shadow-md hover:bg-indigo-700 transition"
        >
          Give Feedback
        </button>
      </div>

      <div className="space-y-4">
        {allModules.map((module, index) => {
          const isCompleted = completedModules.includes(module.order);
          const isFirst = module.order === 1;
          const isUnlocked = isFirst || completedModules.includes(module.order - 1);
          
          // Logic for "Next" text: If it's the first available uncompleted module
          const isNext = isUnlocked && !isCompleted && (isFirst || completedModules.includes(module.order - 1));

          return (
            <div 
              key={index} 
              className={`flex items-center justify-between p-5 border-2 rounded-xl transition-all ${
                isUnlocked 
                  ? "bg-white border-indigo-50 shadow-sm" 
                  : "bg-gray-50 border-transparent opacity-60"
              }`}
            >
              <div className="flex items-center gap-5">
                <div className={`text-2xl ${isCompleted ? "text-green-500" : isUnlocked ? "text-indigo-600" : "text-gray-400"}`}>
                  {isCompleted ? <FaCheckCircle /> : !isUnlocked ? <FaLock /> : (
                    <>
                      {module.contentType === 'video' && <FaPlayCircle />}
                      {module.contentType === 'quiz' && <FaQuestionCircle />}
                      {module.contentType === 'assignment' && <FaFileAlt />}
                    </>
                  )}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-black px-2 py-0.5 rounded bg-gray-100 text-gray-500 uppercase">
                      Module {module.order}
                    </span>
                    <span className="text-xs font-bold text-indigo-400 uppercase">{module.contentType}</span>
                  </div>
                  <h4 className={`text-lg font-bold ${isUnlocked ? "text-gray-700" : "text-gray-400"}`}>
                    {module.title}
                  </h4>
                </div>
              </div>

              <div className="flex items-center">
                {isUnlocked ? (
                  <button 
                    onClick={() => {
                      if(module.contentType === 'quiz') navigate(`/course/${courseId}/quiz/${module.order}`, { state: { module } });
                      else if(module.contentType === 'video') navigate(`/course/${courseId}/video/${module.order}`, { state: { module } });
                      else onAssignmentSubmit(module._id);
                    }}
                    className={`px-6 py-2 rounded-lg font-bold text-sm transition-all ${
                      isCompleted 
                        ? "bg-green-100 text-green-700 hover:bg-green-200" 
                        : "bg-indigo-600 text-white hover:bg-indigo-700 shadow-lg shadow-indigo-100"
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
  );
};

export default CourseAssignments;