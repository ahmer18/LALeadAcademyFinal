// src/pages/teacher/CourseSummery.jsx
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { useParams } from "react-router";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import LoaderDotted from "../../components/common/LoaderDotted";
import useAuth from "../../hooks/useAuth";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import { FaTrash, FaVideo, FaQuestionCircle, FaFileAlt, FaCommentAlt, FaPlus, FaUserGraduate } from "react-icons/fa";

const CourseSummery = () => {
  const { courseId } = useParams();
  const [modalOpen, setModalOpen] = useState(false);
  const [moduleType, setModuleType] = useState("video");
  const queryClient = useQueryClient();
  const axiosSecure = useAxiosSecure();
  const { user } = useAuth();

  const { register, handleSubmit, reset, control } = useForm({
    defaultValues: {
      questions: [{ question: "", opt1: "", opt2: "", opt3: "", opt4: "", correctAns: "1" }]
    }
  });

  const { fields, append, remove } = useFieldArray({ control, name: "questions" });

  // 1. FETCH COURSE INFO (Modules)
  const { data: courseInfo = {}, isLoading: infoLoading } = useQuery({
    queryKey: ["courseInfo", courseId],
    queryFn: async () => {
      const { data } = await axios.get(`${import.meta.env.VITE_BASE_URL}/courses/${courseId}`);
      return data.course;
    },
  });

  // 2. FETCH DYNAMIC STATS (Now using the Teacher-Specific Progress API)
  // Replace your existing courseStats useQuery with this:
// Inside CourseSummery.jsx
// Inside CourseSummery.jsx -> courseStats useQuery
const { data: courseStats, isLoading: statsLoading } = useQuery({
  queryKey: ["courseStats", courseId],
  queryFn: async () => {
    const [subs, prog, assi, feed] = await Promise.all([
      axiosSecure.get(`/submissions/${courseId}`),
      axiosSecure.get(`/instructor/course-progress/${courseId}`),
      axiosSecure.get(`/assignments/${courseId}`),
      axiosSecure.get(`/feedbacks?courseId=${courseId}`)
    ]);

    // LOG THIS: Open your browser F12 console and look for this specific log
    console.log("FEEDBACK API RAW DATA:", feed.data);

    return {
      submissions: subs.data.submissions || [],
      progress: prog.data || [], 
      assignments: assi.data.assignments || [],
      // Handle every possible return structure
      feedbacks: feed.data.feedbacks || (Array.isArray(feed.data) ? feed.data : [])
    };
  },
  enabled: !!courseId,
});

  // 3. MUTATIONS (Add & Delete)
  const addModuleMutation = useMutation({
    mutationFn: async (moduleData) => {
      const res = await axiosSecure.patch(`/add-module/${courseId}`, moduleData);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["courseInfo", courseId]);
      toast.success("Module added!");
      setModalOpen(false);
      reset();
    }
  });

  const deleteModuleMutation = useMutation({
    mutationFn: async (moduleOrder) => {
      return await axiosSecure.patch(`/delete-module/${courseId}`, { order: moduleOrder });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["courseInfo", courseId]);
      toast.success("Module deleted");
    }
  });

  const handleDeleteModule = (order) => {
    Swal.fire({
      title: "Are you sure?",
      text: "This will remove the module for all students.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it"
    }).then((res) => { if (res.isConfirmed) deleteModuleMutation.mutate(order); });
  };

  const onSubmit = (data) => {
    let finalModuleData = { title: data.title, contentType: data.contentType, order: parseInt(data.order) };
    if (data.contentType === "video") finalModuleData.videoUrl = data.videoUrl;
    else if (data.contentType === "assignment") finalModuleData.assignmentDetails = { description: data.description, deadline: data.deadline };
    else if (data.contentType === "quiz") {
      finalModuleData.quizData = data.questions.map(q => ({
        question: q.question, options: [q.opt1, q.opt2, q.opt3, q.opt4], correctAnswerIndex: parseInt(q.correctAns) - 1
      }));
    }
    addModuleMutation.mutate(finalModuleData);
  };

  if (infoLoading || statsLoading) return <LoaderDotted />;

  const totalModules = courseInfo.modules?.length || 0;

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-white">Course Dashboard</h2>

      {/* STAT CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <StatCard title="Enrollments" count={courseStats?.enrollments?.length || 0} />
        <StatCard title="Total Modules" count={totalModules} />
        <StatCard title="Submissions" count={courseStats?.submissions?.length || 0} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {/* CURRICULUM LIST */}
          <section className="bg-[#1e1e1e] p-6 rounded-xl border border-gray-800">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-white">Curriculum</h3>
              <button onClick={() => setModalOpen(true)} className="btn btn-sm btn-primary border-none bg-indigo-600"><FaPlus className="mr-2" />Add</button>
            </div>
            {courseInfo.modules?.sort((a, b) => a.order - b.order).map((m, i) => (
              <div key={i} className="flex items-center justify-between p-3 border-b border-gray-800 last:border-0">
                <div className="flex items-center gap-3 text-gray-300">
                  <span className="text-xs text-gray-600 font-bold">#{m.order}</span>
                  {m.contentType === 'video' ? <FaVideo className="text-indigo-400" /> : m.contentType === 'quiz' ? <FaQuestionCircle className="text-indigo-400" /> : <FaFileAlt className="text-indigo-400" />}
                  <p>{m.title}</p>
                </div>
                <button onClick={() => handleDeleteModule(m.order)} className="text-gray-600 hover:text-red-500"><FaTrash size={14} /></button>
              </div>
            ))}
          </section>

          {/* FEEDBACK TABLE */}
          <section className="bg-[#181818] rounded-2xl border border-gray-800 overflow-hidden">
            <div className="p-6 border-b border-gray-800 bg-[#1e1e1e]">
              <h3 className="text-lg font-bold">Student Reviews</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="table w-full text-sm">
                <thead className="bg-gray-900/50 text-gray-500 uppercase text-[10px]">
                  <tr>
                    <th className="bg-transparent border-gray-800">Student</th>
                    <th className="bg-transparent border-gray-800">Comment</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800">
                  {courseStats?.feedbacks?.length > 0 ? courseStats.feedbacks.map((f, i) => (
                    <tr key={i} className="hover:bg-white/5 border-none">
                      {/* 1. Add studentEmail fallback if userName is missing */}
                      <td className="font-bold text-indigo-400">{f.userName || f.studentEmail || "Anonymous"}</td>

                      {/* 2. Check BOTH field names: feedback and description */}
                      <td className="text-gray-400 italic">
                        "{f.feedback || f.description || "No comment provided"}"
                      </td>
                    </tr>
                  )) : (
                    <tr><td colSpan="2" className="text-center py-10 text-gray-600">No feedback yet</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>
        </div>

        {/* FEEDBACK TABLE */}
        
        <aside className="bg-[#181818] rounded-2xl border border-gray-800 overflow-hidden h-fit">
          <div className="p-6 border-b border-gray-800 bg-[#1e1e1e]">
            <h3 className="text-lg font-bold flex items-center gap-2"><FaUserGraduate className="text-indigo-500" /> Student Progress</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="table w-full text-xs">
              <thead className="bg-gray-900/50 text-gray-500 uppercase text-[10px]">
                <tr>
                  <th className="bg-transparent border-gray-800">Student</th>
                  <th className="bg-transparent border-gray-800 text-right">Completion</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800">
                {courseStats?.progress?.map((s, i) => (
                  <tr key={i} className="hover:bg-white/5 border-none">
                    <td>
                      <p className="font-bold text-white truncate w-24">{s.studentName}</p>
                      <p className="text-[10px] text-gray-500 truncate w-24">{s.studentEmail}</p>
                    </td>
                    <td className="text-right">
                      <span className={`px-2 py-0.5 rounded text-[10px] ${s.progressPercent === 100 ? 'bg-emerald-500/10 text-emerald-500' : 'bg-indigo-500/10 text-indigo-500'}`}>
                        {s.progressPercent}%
                      </span>
                      <div className="w-16 bg-gray-800 h-1 rounded-full mt-2 ml-auto overflow-hidden">
                        <div className="bg-indigo-500 h-full" style={{ width: `${s.progressPercent}%` }}></div>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </aside>
      </div>

      {/* MODAL (Restored Adding Logic) */}
      {modalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/70 z-50 p-4">
          <div className="bg-[#1e1e1e] p-6 rounded-xl w-full max-w-lg max-h-[90vh] overflow-y-auto border border-gray-700">
            <h3 className="text-xl font-bold text-white mb-6">Add Course Content</h3>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 text-gray-300">
              <div className="grid grid-cols-2 gap-4">
                <div><label className="label text-xs">Module Order</label><input type="number" {...register("order", { required: true })} className="input input-sm input-bordered w-full bg-gray-800" /></div>
                <div><label className="label text-xs">Content Type</label><select {...register("contentType")} onChange={(e) => setModuleType(e.target.value)} className="select select-sm select-bordered w-full bg-gray-800"><option value="video">Video</option><option value="quiz">Quiz</option><option value="assignment">Assignment</option></select></div>
              </div>
              <div><label className="label text-xs">Module Title</label><input type="text" {...register("title", { required: true })} className="input input-sm input-bordered w-full bg-gray-800" /></div>

              {moduleType === "video" && <input type="url" placeholder="Video URL" {...register("videoUrl")} className="input input-sm input-bordered w-full bg-gray-800" />}
              {moduleType === "assignment" && (
                <div className="space-y-2">
                  <input type="date" {...register("deadline")} className="input input-sm input-bordered w-full bg-gray-800" />
                  <textarea {...register("description")} placeholder="Instructions" className="textarea textarea-bordered w-full bg-gray-800"></textarea>
                </div>
              )}
              {moduleType === "quiz" && (
                <div className="space-y-4">
                  {fields.map((field, index) => (
                    <div key={field.id} className="p-3 border border-gray-700 rounded-lg space-y-2">
                      <input {...register(`questions.${index}.question`)} placeholder="Question" className="input input-xs w-full bg-gray-900" />
                      <div className="grid grid-cols-2 gap-1">
                        {[1, 2, 3, 4].map(n => <input key={n} {...register(`questions.${index}.opt${n}`)} placeholder={`Option ${n}`} className="input input-xs bg-gray-900" />)}
                      </div>
                      <select {...register(`questions.${index}.correctAns`)} className="select select-xs w-full bg-gray-900"><option value="1">Option 1</option><option value="2">Option 2</option><option value="3">Option 3</option><option value="4">Option 4</option></select>
                    </div>
                  ))}
                  <button type="button" onClick={() => append({})} className="btn btn-xs btn-outline w-full">+ Add Question</button>
                </div>
              )}
              <div className="flex justify-end gap-3 pt-4"><button type="button" onClick={() => setModalOpen(false)} className="btn btn-ghost btn-sm">Cancel</button><button type="submit" className="btn btn-primary btn-sm bg-indigo-600 border-none">Save</button></div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

const StatCard = ({ title, count }) => (
  <div className="bg-[#1e1e1e] p-6 rounded-xl border border-gray-800">
    <h4 className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">{title}</h4>
    <p className="text-3xl font-black text-white mt-1">{count}</p>
  </div>
);

export default CourseSummery;