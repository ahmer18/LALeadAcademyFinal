// src/pages/teacher/CourseSummery.jsx
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useParams } from "react-router";
import { useFeedback } from "../../providers/FeedbackProvider";
import Swal from "sweetalert2";
import LoaderDotted from "../../components/common/LoaderDotted";
import RichTextEditor from "../../components/common/RichTextEditor";
import useAuth from "../../hooks/useAuth";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import { FaTrash, FaVideo, FaQuestionCircle, FaFileAlt, FaCommentAlt, FaPlus, FaUserGraduate, FaEdit, FaAlignLeft, FaTimes, FaImage, FaHeadphones, FaChevronUp, FaChevronDown } from "react-icons/fa";
import handleUpload from "../../utils/ImageUploadApi";
import handleFileUpload from "../../utils/FileUploadApi";

const CourseSummery = () => {
  const { courseId } = useParams();
  const [modalOpen, setModalOpen] = useState(false);
  const [celebrationMsg, setCelebrationMsg] = useState("");
  const [courseCompletionMsg, setCourseCompletionMsg] = useState("");
  const [isEditingFinishMsg, setIsEditingFinishMsg] = useState(false);
  const [tempFinishMsg, setTempFinishMsg] = useState("");

  // NEW STATE: Blocks builder
  const [blocks, setBlocks] = useState([]);
  const [editingModule, setEditingModule] = useState(null); // Tracks which module is being edited

  const queryClient = useQueryClient();
  const axiosSecure = useAxiosSecure();
  const { showFeedback } = useFeedback();

  // We no longer strictly need useFieldArray for the top level, 
  // but we can keep standard inputs for the Module Title and Order
  const { register: registerModule, handleSubmit: handleModuleSubmit, reset: registerReset, setValue, formState: { errors } } = useForm();

  // 1. FETCH COURSE INFO (Modules)
  const { data: courseInfo = {}, isLoading: infoLoading } = useQuery({
    queryKey: ["courseInfo", courseId],
    queryFn: async () => {
      const { data } = await axiosSecure.get(`/courses/${courseId}`);
      if (data?.course?.courseCompletionMessage) {
        setCourseCompletionMsg(data.course.courseCompletionMessage || "");
      }
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

      // Extract feedbacks uniquely due to API response structure variations
      const feeds = feed.data.feedbacks || (Array.isArray(feed.data) ? feed.data : []);

      return {
        submissions: subs.data.submissions || [],
        progress: prog.data || [],
        assignments: assi.data.assignments || [],
        feedbacks: feeds
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
      showFeedback("Module added!", "success");
      closeModal();
    }
  });

  const updateModuleMutation = useMutation({
    mutationFn: async (moduleData) => {
      const res = await axiosSecure.patch(`/update-module/${courseId}`, moduleData);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["courseInfo", courseId]);
      showFeedback("Module updated!", "success");
      closeModal();
    },
    onError: (err) => {
      showFeedback(err.response?.data?.message || "Failed to update module", "error");
    }
  });

  const updateCourseMutation = useMutation({
    mutationFn: async (updatedData) => {
      const res = await axiosSecure.patch(`/courses/${courseId}`, updatedData);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["courseInfo", courseId]);
      showFeedback("Course updated!", "success");
      setIsEditingFinishMsg(false);
    }
  });

  const closeModal = () => {
    setModalOpen(false);
    setEditingModule(null);
    registerReset();
    setBlocks([]);
    setCelebrationMsg("");
  };

  const deleteModuleMutation = useMutation({
    mutationFn: async (moduleOrder) => {
      return await axiosSecure.patch(`/delete-module/${courseId}`, { order: moduleOrder });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["courseInfo", courseId]);
      showFeedback("Module deleted", "success");
    }
  });

  const handleDeleteModule = (order) => {
    Swal.fire({
      title: "Are you sure?",
      text: "This will remove the module for all students.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it",
      confirmButtonColor: "#1e3a8a",
      cancelButtonColor: "#cbd5e1",
    }).then((res) => { if (res.isConfirmed) deleteModuleMutation.mutate(order); });
  };

  const handleEditModule = (module) => {
    setEditingModule(module);
    setValue("title", module.title);
    setValue("order", module.order);
    setValue("purpose", module.purpose || "");
    setCelebrationMsg(module.completionMessage || "");

    // Map blocks to add unique IDs for keying in UI
    const blocksWithIds = (module.blocks || []).map(b => {
      const blockWithId = { ...b, id: Math.random() };

      // If it's a quiz, ensure we map the backend data structure back to frontend form state
      if (b.type === 'quiz' && b.quizData) {
        blockWithId.questions = b.quizData.map(q => ({
          question: q.question,
          opt1: q.options[0] || "",
          opt2: q.options[1] || "",
          opt3: q.options[2] || "",
          opt4: q.options[3] || "",
          correctAns: (q.correctAnswerIndex + 1).toString()
        }));
      }
      // If it's an assignment, flatten the details for the form
      if (b.type === 'assignment' && b.assignmentDetails) {
        blockWithId.description = b.assignmentDetails.description || "";
        blockWithId.deadline = b.assignmentDetails.deadline || "";
      }
      // If it's a photo block, ensure we initialize terms and images array if not present (for compatibility)
      if (b.type === 'photo') {
        blockWithId.images = (b.images || (b.photoUrl ? [{ id: Math.random(), url: b.photoUrl, correctTerm: "" }] : [])).map(img => ({
          id: img.id || Math.random(),
          url: img.url || img.photoUrl || "",
          correctTerm: img.correctTerm || ""
        }));
        blockWithId.terms = b.terms || [];
      }
      return blockWithId;
    });

    setBlocks(blocksWithIds);
    setModalOpen(true);
  };

  const onSubmitCourse = (data) => {
    if (blocks.length === 0) {
      toast.error("Please add at least one content block to the module.");
      return;
    }

    // Format blocks for backend payload
    const formattedBlocks = blocks.map(block => {
      const heading = block.heading || "";
      if (block.type === 'text') {
        return { type: 'text', heading, content: block.content, audioUrl: block.audioUrl || "" };
      }
      if (block.type === 'video') {
        return { type: 'video', heading, videoUrl: block.videoUrl };
      }
      if (block.type === 'photo') {
        return {
          type: 'photo',
          heading,
          photoUrl: block.photoUrl || "",
          images: (block.images || []).map(img => ({ url: img.url || "", correctTerm: img.correctTerm || "" })),
          terms: block.terms || []
        };
      }
      if (block.type === 'assignment') {
        return {
          type: 'assignment',
          heading,
          assignmentDetails: { description: block.description, deadline: block.deadline }
        };
      }
      if (block.type === 'quiz') {
        const quizData = block.questions.map(q => {
          // Filter out empty options
          const allOptions = [
            { text: q.opt1, originalIndex: 1 },
            { text: q.opt2, originalIndex: 2 },
            { text: q.opt3, originalIndex: 3 },
            { text: q.opt4, originalIndex: 4 }
          ];
          const validOptions = allOptions.filter(opt => opt.text && opt.text.trim() !== "");

          // Find the new index of the correct answer
          const newCorrectIndex = validOptions.findIndex(opt => opt.originalIndex === parseInt(q.correctAns));

          return {
            question: q.question,
            options: validOptions.map(opt => opt.text),
            correctAnswerIndex: newCorrectIndex !== -1 ? newCorrectIndex : 0
          };
        });
        return { type: 'quiz', heading, quizData };
      }
      return { ...block, heading };
    });

    const finalModuleData = {
      title: data.title,
      order: parseInt(data.order),
      purpose: data.purpose || "",
      completionMessage: celebrationMsg.trim(),
      blocks: formattedBlocks
    };

    const performMutation = () => {
      if (editingModule) {
        updateModuleMutation.mutate({ oldOrder: editingModule.order, ...finalModuleData });
      } else {
        addModuleMutation.mutate(finalModuleData);
      }
    };

    if (!finalModuleData.completionMessage) {
      Swal.fire({
        title: "No Celebration Message?",
        text: "You haven't added a congratulatory message for this module. Students won't see your 'graffiti' message.",
        icon: "info",
        showCancelButton: true,
        confirmButtonText: "Save anyway",
        cancelButtonText: "Go back & add one",
        confirmButtonColor: "#1e3a8a"
      }).then((res) => {
        if (res.isConfirmed) performMutation();
      });
      return;
    }

    performMutation();
  };

  // Block Builder Helpers
  const addBlock = (type) => {
    const newBlock = { id: Date.now(), type };
    if (type === 'quiz') {
      newBlock.questions = [{ question: "", opt1: "", opt2: "", opt3: "", opt4: "", correctAns: "1" }];
    }
    setBlocks([...blocks, newBlock]);
  };

  const removeBlock = (id) => {
    setBlocks(blocks.filter(b => b.id !== id));
  };

  const moveBlockUp = (index) => {
    if (index === 0) return;
    const newBlocks = [...blocks];
    const temp = newBlocks[index];
    newBlocks[index] = newBlocks[index - 1];
    newBlocks[index - 1] = temp;
    setBlocks(newBlocks);
  };

  const moveBlockDown = (index) => {
    if (index === blocks.length - 1) return;
    const newBlocks = [...blocks];
    const temp = newBlocks[index];
    newBlocks[index] = newBlocks[index + 1];
    newBlocks[index + 1] = temp;
    setBlocks(newBlocks);
  };

  const updateBlock = (id, field, value) => {
    setBlocks(blocks.map(b => b.id === id ? { ...b, [field]: value } : b));
  };

  const handlePhotoChange = async (blockId, file) => {
    if (!file) return;
    setBlocks(prev => prev.map(b => b.id === blockId ? { ...b, uploading: true } : b));
    try {
      const url = await handleUpload(file);
      if (url) {
        setBlocks(prev => prev.map(b => b.id === blockId ? { ...b, photoUrl: url, uploading: false } : b));
        showFeedback("Photo uploaded successfully!", "success");
      } else {
        throw new Error("Failed to get image URL");
      }
    } catch (err) {
      console.error("Photo upload failed:", err);
      setBlocks(prev => prev.map(b => b.id === blockId ? { ...b, uploading: false } : b));
      showFeedback("Photo upload failed. Please try again.", "error");
    }
  };

  const addImageToBlock = (blockId) => {
    setBlocks(blocks.map(b => {
      if (b.id !== blockId) return b;
      const imgs = b.images || [];
      return {
        ...b,
        images: [...imgs, { id: Math.random(), url: "", correctTerm: "", uploading: false }]
      };
    }));
  };

  const removeImageFromBlock = (blockId, imgId) => {
    setBlocks(blocks.map(b => {
      if (b.id !== blockId) return b;
      return {
        ...b,
        images: (b.images || []).filter(img => img.id !== imgId)
      };
    }));
  };

  const updateImageField = (blockId, imgId, field, value) => {
    setBlocks(blocks.map(b => {
      if (b.id !== blockId) return b;
      return {
        ...b,
        images: (b.images || []).map(img => img.id === imgId ? { ...img, [field]: value } : img)
      };
    }));
  };

  const handleGridPhotoChange = async (blockId, imgId, file) => {
    if (!file) return;
    setBlocks(prev => prev.map(b => {
      if (b.id !== blockId) return b;
      return {
        ...b,
        images: (b.images || []).map(img => img.id === imgId ? { ...img, uploading: true } : img)
      };
    }));
    try {
      const url = await handleUpload(file);
      if (url) {
        setBlocks(prev => prev.map(b => {
          if (b.id !== blockId) return b;
          return {
            ...b,
            images: (b.images || []).map(img => img.id === imgId ? { ...img, url, uploading: false } : img)
          };
        }));
        showFeedback("Photo uploaded successfully!", "success");
      } else {
        throw new Error("Failed to get photo URL");
      }
    } catch (err) {
      console.error("Grid photo upload failed:", err);
      setBlocks(prev => prev.map(b => {
        if (b.id !== blockId) return b;
        return {
          ...b,
          images: (b.images || []).map(img => img.id === imgId ? { ...img, uploading: false } : img)
        };
      }));
      showFeedback("Photo upload failed. Please try again.", "error");
    }
  };

  const addTermToBlock = (blockId, termText) => {
    if (!termText || !termText.trim()) return;
    setBlocks(blocks.map(b => {
      if (b.id !== blockId) return b;
      const terms = b.terms || [];
      if (terms.includes(termText.trim())) return b;
      return {
        ...b,
        terms: [...terms, termText.trim()]
      };
    }));
  };

  const removeTermFromBlock = (blockId, termText) => {
    setBlocks(blocks.map(b => {
      if (b.id !== blockId) return b;
      return {
        ...b,
        terms: (b.terms || []).filter(t => t !== termText),
        images: (b.images || []).map(img => img.correctTerm === termText ? { ...img, correctTerm: "" } : img)
      };
    }));
  };

  const handleAudioChange = async (blockId, file) => {
    if (!file) return;
    setBlocks(prev => prev.map(b => b.id === blockId ? { ...b, audioUploading: true } : b));
    try {
      const url = await handleFileUpload(file);
      if (url) {
        setBlocks(prev => prev.map(b => b.id === blockId ? { ...b, audioUrl: url, audioUploading: false } : b));
        showFeedback("Audio uploaded successfully!", "success");
      } else {
        throw new Error("Failed to get audio URL");
      }
    } catch (err) {
      console.error("Audio upload failed:", err);
      setBlocks(prev => prev.map(b => b.id === blockId ? { ...b, audioUploading: false } : b));
      showFeedback("Audio upload failed. Please try again.", "error");
    }
  };

  const removeAudio = (blockId) => {
    setBlocks(prev => prev.map(b => b.id === blockId ? { ...b, audioUrl: null } : b));
    showFeedback("Audio attachment removed.", "success");
  };

  const updateQuizQuestion = (blockId, qIndex, field, value) => {
    setBlocks(blocks.map(b => {
      if (b.id !== blockId) return b;
      const newQuestions = [...b.questions];
      newQuestions[qIndex] = { ...newQuestions[qIndex], [field]: value };
      return { ...b, questions: newQuestions };
    }));
  };

  const addQuizQuestion = (blockId) => {
    setBlocks(blocks.map(b => {
      if (b.id !== blockId) return b;
      return {
        ...b,
        questions: [...b.questions, { question: "", opt1: "", opt2: "", opt3: "", opt4: "", correctAns: "1" }]
      };
    }));
  };

  const removeQuizQuestion = (blockId, qIndex) => {
    setBlocks(blocks.map(b => {
      if (b.id !== blockId) return b;
      return {
        ...b,
        questions: b.questions.filter((_, idx) => idx !== qIndex)
      };
    }));
  };

  if (infoLoading || statsLoading) return <LoaderDotted />;

  const totalModules = courseInfo.modules?.length || 0;

  return (
    <div className="min-h-screen p-6 md:p-10 bg-theme-gradient">
      <div className="max-w-7xl mx-auto w-full">
        {/* TOP DASHBOARD BAR */}
        <div className="flex flex-wrap items-center justify-between gap-6 mb-12">
          <div>
            <h2 className="text-4xl font-black text-slate-900 tracking-tight mb-1">Course Management</h2>
            <p className="text-slate-400 font-bold uppercase tracking-[0.2em] text-[10px]">Overview & Modules Builder</p>
          </div>

          <div className="flex items-center gap-4">
            <CompactStat label="Total Students" value={courseStats?.progress?.length || 0} icon={<FaUserGraduate size={14} />} color="blue" />
            <CompactStat label="Curriculum" value={`${totalModules} Modules`} icon={<FaEdit size={14} />} color="amber" />
          </div>
        </div>

        <div className="space-y-12">
          {/* FULL WIDTH CURRICULUM */}
          <section className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-2xl shadow-slate-200/40 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-50/50 blur-3xl -mr-32 -mt-32 rounded-full" />

            <div className="relative z-10">
              <div className="flex justify-between items-center mb-10">
                <div>
                  <h3 className="text-2xl font-black text-slate-900 tracking-tight">Structured Curriculum</h3>
                  <p className="text-slate-400 font-medium text-sm mt-1">Manage and organize your course modules</p>
                </div>
                <button
                  onClick={() => setModalOpen(true)}
                  className="btn bg-blue-900 text-white border-none hover:bg-blue-800 shadow-xl shadow-blue-900/20 px-6 rounded-2xl transition-all hover:scale-105 active:scale-95 text-xs font-black uppercase tracking-widest h-12"
                >
                  <FaPlus className="mr-2" /> Add Module
                </button>
              </div>
              {courseInfo.modules?.length > 0 ? (
                courseInfo.modules.sort((a, b) => a.order - b.order).map((m, i) => (
                  <div key={i} className="p-5 border border-slate-100 rounded-2xl mb-4 bg-white hover:bg-slate-50/50 transition-all group shadow-sm">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-4 text-slate-900">
                        <span className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-xs font-black text-blue-900">#{m.order}</span>
                        <p className="font-bold text-lg tracking-tight text-slate-900">{m.title}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <button onClick={() => handleEditModule(m)} title="Edit Module" className="text-slate-300 hover:text-blue-900 transition-colors bg-slate-50 p-2.5 rounded-xl group-hover:bg-blue-50"><FaEdit size={14} /></button>
                        <button onClick={() => handleDeleteModule(m.order)} title="Delete Module" className="text-slate-300 hover:text-red-500 transition-colors bg-slate-50 p-2.5 rounded-xl group-hover:bg-red-50"><FaTrash size={14} /></button>
                      </div>
                    </div>

                    {/* Internal Blocks Summary */}
                    <div className="flex flex-wrap gap-2 pl-11">
                      {m.blocks?.map((block, bIdx) => {
                        let Icon = FaFileAlt;
                        let label = "Content";
                        let color = "text-slate-500";
                        let bg = "bg-slate-100";

                        if (block.type === 'video') { Icon = FaVideo; label = "Video"; color = "text-blue-600"; bg = "bg-blue-50"; }
                        if (block.type === 'quiz') { Icon = FaQuestionCircle; label = "Quiz"; color = "text-[#8d6e3e]"; bg = "bg-[#8d6e3e]/10"; }
                        if (block.type === 'assignment') { Icon = FaFileAlt; label = "Assignment"; color = "text-amber-600"; bg = "bg-amber-50"; }
                        if (block.type === 'text') { Icon = FaAlignLeft; label = "Text"; color = "text-emerald-600"; bg = "bg-emerald-50"; }
                        if (block.type === 'photo') { Icon = FaImage; label = "Photo"; color = "text-purple-600"; bg = "bg-purple-50"; }

                        return (
                          <span key={bIdx} className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest ${color} ${bg} border border-slate-100/50`}>
                            <Icon size={10} /> {label}
                          </span>
                        )
                      })}
                      {(!m.blocks || m.blocks.length === 0) && (
                        <span className="text-xs text-gray-500 italic">Empty Module</span>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-16 bg-slate-50 rounded-[2rem] border-2 border-dashed border-slate-200">
                  <FaFileAlt className="text-slate-300 text-4xl mx-auto mb-4" />
                  <p className="text-slate-500 font-bold whitespace-pre-line text-sm">
                    {`No content modules added yet.
                  Click "Add Module" to start building your curriculum.`}
                  </p>
                </div>
              )}
            </div>
          </section>

          {/* INSIGHTS GRID */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

            {/* 1. STUDENT PROGRESS */}
            <div className="bg-white rounded-[2.5rem] border border-slate-100 overflow-hidden shadow-xl shadow-slate-200/30 flex flex-col">
              <div className="p-8 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
                <h3 className="text-lg font-black text-slate-900 tracking-tight">Student's Course Completion Progress</h3>
                <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-900 flex items-center justify-center shadow-inner">
                  <FaUserGraduate size={16} />
                </div>
              </div>
              <div className="flex-1 overflow-y-auto max-h-[450px] custom-scrollbar">
                <table className="table w-full">
                  <thead className="bg-slate-50/80 text-blue-900 uppercase text-[10px] font-black tracking-widest sticky top-0 z-10">
                    <tr>
                      <th className="px-6 py-4 text-left">Student</th>
                      <th className="px-6 py-4 text-right">Progress</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {courseStats?.progress?.length > 0 ? (
                      courseStats.progress.map((s, i) => (
                        <tr key={i} className="hover:bg-slate-50/50 transition-all">
                          <td className="py-4 pl-6 text-left">
                            <p className="font-black text-slate-900 truncate w-48 tracking-tight leading-tight">{s.studentName}</p>
                            <p className="text-[10px] text-slate-400 font-bold truncate w-48">{s.studentEmail}</p>
                          </td>
                          <td className="text-right py-4 pr-6">
                            <div className="flex flex-col items-end gap-1">
                              <span className={`text-[11px] font-black ${s.progressPercent === 100 ? 'text-emerald-600' : 'text-blue-900'}`}>
                                {s.progressPercent}%
                              </span>
                              <div className="w-24 bg-slate-100 h-1.5 rounded-full overflow-hidden shadow-inner">
                                <div className={`h-full transition-all duration-1000 ${s.progressPercent === 100 ? 'bg-emerald-500' : 'bg-blue-900'}`} style={{ width: `${s.progressPercent}%` }}></div>
                              </div>
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr><td colSpan="2" className="text-center py-10 text-slate-400 font-bold text-xs uppercase tracking-widest">No students yet</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* 2. REVIEWS & FEEDBACK */}
            <div className="bg-white rounded-[2.5rem] border border-slate-100 overflow-hidden shadow-xl shadow-slate-200/30 flex flex-col">
              <div className="p-8 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
                <h3 className="text-lg font-black text-slate-900 tracking-tight">Student Feedbacks</h3>
                <div className="w-10 h-10 rounded-xl bg-amber-100 text-[#8d6e3e] flex items-center justify-center shadow-inner text-lg">
                  <FaCommentAlt size={16} />
                </div>
              </div>
              <div className="flex-1 overflow-y-auto max-h-[450px] custom-scrollbar">
                <div className="p-8 space-y-6">
                  {courseStats?.feedbacks?.length > 0 ? courseStats.feedbacks.map((f, i) => (
                    <div key={i} className="p-6 bg-slate-50/50 rounded-3xl border border-slate-100 group hover:border-blue-200 transition-all">
                      <div className="flex justify-between items-center mb-3">
                        <p className="font-black text-blue-900 tracking-tight">{f.userName || f.studentEmail || "Anonymous"}</p>
                        <span className="text-[10px] font-black text-[#8d6e3e] bg-amber-50 px-2.5 py-1 rounded-full uppercase tracking-widest">Review</span>
                      </div>
                      <p className="text-sm text-slate-500 italic leading-relaxed">"{f.feedback || f.description || "No comment provided"}"</p>
                    </div>
                  )) : (
                    <div className="text-center py-20 text-slate-400 font-bold text-xs uppercase tracking-widest">No reviews received yet</div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {modalOpen && (
          <div className="fixed inset-0 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm z-[9999] p-4 animate-fadeIn">
            <form
              onSubmit={handleModuleSubmit(onSubmitCourse)}
              className="bg-white rounded-[2.5rem] w-full max-w-4xl max-h-[90vh] flex flex-col border border-slate-100 shadow-2xl overflow-hidden scale-100 transition-all"
            >

              <div className="p-8 border-b border-slate-50 bg-slate-50/50 flex justify-between items-center">
                <div>
                  <h3 className="text-2xl font-black text-blue-900 tracking-tight">{editingModule ? "Edit Module Content" : "Create New Module"}</h3>
                  <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-1">{editingModule ? "Update curriculum content and interactive tasks" : "Add curriculum content and interactive tasks"}</p>
                </div>
                <button onClick={closeModal} className="text-slate-300 hover:text-red-500 transition-colors bg-white w-10 h-10 rounded-xl border border-slate-200 flex items-center justify-center shadow-sm hover:bg-red-50 hover:border-red-100 transition-all"><FaTimes size={20} /></button>
              </div>

              <div className="p-8 overflow-y-auto flex-1 custom-scrollbar bg-slate-50/30 space-y-10">

                {/* Module Meta */}
                <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-5">
                  <h4 className="text-[10px] font-black text-blue-900 uppercase tracking-widest">General Information</h4>
                  <div className="grid grid-cols-4 gap-6">
                    <div className="col-span-1">
                      <label className="label text-[10px] text-slate-500 uppercase font-black px-0 pt-0">Sequence #</label>
                      <input type="number" {...registerModule("order", { required: "Order is required" })} className={`input input-bordered w-full bg-slate-50 ${errors.order ? 'border-red-500' : 'border-slate-200'} text-slate-900 rounded-xl focus:border-blue-900 focus:ring-4 focus:ring-blue-900/5 transition-all font-bold`} placeholder="1" />
                      {errors.order && <p className="text-[9px] text-red-500 mt-1 font-bold">{errors.order.message}</p>}
                    </div>
                    <div className="col-span-3">
                      <label className="label text-[10px] text-slate-500 uppercase font-black px-0 pt-0">Module Headline</label>
                      <input type="text" {...registerModule("title", { required: "Title is required" })} className={`input input-bordered w-full bg-slate-50 ${errors.title ? 'border-red-500' : 'border-slate-200'} text-slate-900 rounded-xl focus:border-blue-900 focus:ring-4 focus:ring-blue-900/5 transition-all font-bold`} placeholder="e.g. Advanced Leadership Principles" />
                      {errors.title && <p className="text-[9px] text-red-500 mt-1 font-bold">{errors.title.message}</p>}
                    </div>
                    <div className="col-span-4">
                      <label className="label text-[10px] text-slate-500 uppercase font-black px-0 pt-0">Module Purpose (Optional)</label>
                      <textarea {...registerModule("purpose")} className="textarea textarea-bordered w-full bg-slate-50 border-slate-200 text-slate-900 rounded-xl focus:border-blue-900 focus:ring-4 focus:ring-blue-900/5 transition-all font-medium" placeholder="e.g. This module builds your vocabulary for describing what happens in the classroom..."></textarea>
                    </div>
                  </div>
                </div>

                {/* Completion Message */}
                <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600 text-xl shadow-sm">🏆</div>
                    <div>
                      <h4 className="text-[10px] font-black text-blue-900 uppercase tracking-widest">Congratulatory Message</h4>
                      <p className="text-[11px] text-slate-500 mt-0.5 font-medium">This appears when the student marks the module complete.</p>
                    </div>
                  </div>
                  <textarea
                    value={celebrationMsg}
                    onChange={(e) => setCelebrationMsg(e.target.value)}
                    rows={3}
                    placeholder={`e.g. 🌟 Spectacular work!\nYou've mastered the foundational concepts of this module.`}
                    className="textarea w-full bg-slate-50 border border-slate-200 text-slate-800 placeholder:text-slate-300 rounded-xl text-sm focus:border-[#8d6e3e] focus:ring-4 focus:ring-[#8d6e3e]/5 transition-all leading-relaxed font-medium"
                  />
                </div>

                {/* Blocks Area */}
                <div className="space-y-6">
                  <div className="flex justify-between items-end border-b border-slate-100 pb-3">
                    <h4 className="text-sm font-black text-slate-900 uppercase tracking-tight">Curriculum Structure</h4>
                    <span className="text-[10px] font-black text-[#8d6e3e] bg-[#8d6e3e]/10 px-3 py-1 rounded-full uppercase tracking-widest">{blocks.length} Units Added</span>
                  </div>

                  {blocks.length === 0 ? (
                    <div className="py-20 border-2 border-dashed border-slate-200 rounded-3xl text-center bg-white shadow-inner">
                      <div className="w-16 h-16 rounded-2xl bg-slate-50 flex items-center justify-center mx-auto mb-4 text-slate-300">
                        <FaPlus className="text-2xl" />
                      </div>
                      <p className="text-slate-900 font-black tracking-tight">Your module is empty</p>
                      <p className="text-slate-400 text-xs font-medium mt-1">Start adding rich content, video lectures, or assessments below.</p>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      {blocks.map((block, index) => (
                        <div key={block.id} className="relative bg-white border border-slate-100 rounded-3xl overflow-hidden group shadow-md hover:shadow-lg transition-all">
                          {/* Block Header */}
                          <div className="bg-slate-50/80 px-5 py-3 flex justify-between items-center border-b border-slate-100">
                            <div className="flex items-center gap-3">
                              <span className="text-slate-400 font-black text-[10px] bg-white border border-slate-200 px-2 py-0.5 rounded-lg shadow-sm">{index + 1}</span>
                              <span className="text-[10px] font-black uppercase tracking-widest text-[#8d6e3e] flex items-center gap-2">
                                {block.type === 'video' && <FaVideo />}
                                {block.type === 'text' && <FaAlignLeft />}
                                {block.type === 'quiz' && <FaQuestionCircle />}
                                {block.type === 'assignment' && <FaFileAlt />}
                                {block.type === 'photo' && <FaImage />}
                                {block.type} UNIT
                              </span>
                            </div>
                            <div className="flex items-center gap-1.5">
                              <button
                                type="button"
                                onClick={() => moveBlockUp(index)}
                                disabled={index === 0}
                                className="text-slate-400 hover:text-blue-900 p-1.5 rounded-lg hover:bg-slate-200/50 transition-colors disabled:opacity-30 disabled:hover:bg-transparent"
                                title="Move Up"
                              >
                                <FaChevronUp size={12} />
                              </button>
                              <button
                                type="button"
                                onClick={() => moveBlockDown(index)}
                                disabled={index === blocks.length - 1}
                                className="text-slate-400 hover:text-blue-900 p-1.5 rounded-lg hover:bg-slate-200/50 transition-colors disabled:opacity-30 disabled:hover:bg-transparent"
                                title="Move Down"
                              >
                                <FaChevronDown size={12} />
                              </button>
                              <div className="w-px h-4 bg-slate-200 mx-1" />
                              <button type="button" onClick={() => removeBlock(block.id)} className="text-slate-300 hover:text-red-500 p-1.5 rounded-lg hover:bg-red-50 transition-colors"><FaTrash size={12} /></button>
                            </div>
                          </div>

                          {/* Block Content Inputs */}
                          <div className="p-4 space-y-4">
                            <div>
                              <label className="label text-[10px] text-slate-400 font-black uppercase tracking-widest px-0 pt-0">Section Heading (Optional)</label>
                              <input
                                type="text"
                                value={block.heading || ""}
                                onChange={(e) => updateBlock(block.id, "heading", e.target.value)}
                                placeholder="e.g. Section Title"
                                className="input input-bordered w-full bg-slate-50 border-slate-200 rounded-xl font-medium focus:border-blue-900 text-slate-900"
                              />
                            </div>
                            {block.type === 'text' && (
                              <div className="space-y-4">
                                <RichTextEditor
                                  value={block.content || ""}
                                  onChange={(val) => updateBlock(block.id, "content", val)}
                                />

                                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100/80 space-y-3">
                                  <label className="text-[10px] text-slate-400 font-black uppercase tracking-widest flex items-center gap-1.5 px-0 pt-0">
                                    <FaHeadphones size={12} className="text-slate-400" />
                                    Voice / Audio Narration (Optional)
                                  </label>

                                  {block.audioUrl ? (
                                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white p-3 rounded-xl border border-slate-200">
                                      <audio src={block.audioUrl} controls className="h-8 max-w-full sm:max-w-md" />
                                      <button
                                        type="button"
                                        onClick={() => removeAudio(block.id)}
                                        className="text-xs font-bold text-red-500 hover:text-red-700 hover:bg-red-50 px-3 py-2 rounded-lg transition-colors flex items-center justify-center gap-1 self-end sm:self-auto"
                                      >
                                        <FaTrash size={10} /> Delete Audio
                                      </button>
                                    </div>
                                  ) : (
                                    <label className={`border-2 border-dashed rounded-xl p-6 flex flex-col items-center justify-center cursor-pointer transition-all hover:bg-blue-50/30 ${block.audioUploading ? 'border-blue-400 bg-blue-50/10' : 'border-slate-300 bg-white'}`}>
                                      <input
                                        type="file"
                                        accept="audio/*"
                                        className="hidden"
                                        onChange={(e) => handleAudioChange(block.id, e.target.files[0])}
                                        disabled={block.audioUploading}
                                      />
                                      {block.audioUploading ? (
                                        <div className="flex flex-col items-center gap-2">
                                          <span className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-900"></span>
                                          <span className="text-[10px] font-bold text-blue-900 uppercase tracking-widest animate-pulse">Uploading Audio File...</span>
                                        </div>
                                      ) : (
                                        <div className="flex flex-col items-center gap-1.5 text-slate-400">
                                          <FaHeadphones size={20} />
                                          <span className="text-xs font-bold uppercase tracking-widest">Attach Audio / Narration</span>
                                          <span className="text-[9px] text-slate-400 font-medium">MP3, WAV, M4A up to 20MB</span>
                                        </div>
                                      )}
                                    </label>
                                  )}
                                </div>
                              </div>
                            )}

                            {block.type === 'video' && (
                              <input
                                type="url"
                                value={block.videoUrl || ""}
                                onChange={(e) => updateBlock(block.id, "videoUrl", e.target.value)}
                                placeholder="Paste Video URL (YouTube/Vimeo)..."
                                className="input input-bordered w-full bg-slate-50 border-slate-200 rounded-xl font-medium focus:border-blue-900"
                                required
                              />
                            )}

                            {block.type === 'assignment' && (
                              <div className="grid grid-cols-1 gap-5">
                                <div className="grid grid-cols-2 gap-4">
                                  <div>
                                    <label className="label text-[10px] text-slate-400 font-black uppercase tracking-widest px-0 pt-0">Deadline Date</label>
                                    <input
                                      type="date"
                                      value={block.deadline || ""}
                                      onChange={(e) => updateBlock(block.id, "deadline", e.target.value)}
                                      className="input input-bordered w-full bg-slate-50 border-slate-200 rounded-xl font-bold"
                                      required
                                    />
                                  </div>
                                </div>
                                <div>
                                  <label className="label text-[10px] text-slate-400 font-black uppercase tracking-widest px-0 pt-0">Assignment Mission</label>
                                  <textarea
                                    value={block.description || ""}
                                    onChange={(e) => updateBlock(block.id, "description", e.target.value)}
                                    placeholder="Describe what the student needs to achieve..."
                                    className="textarea textarea-bordered w-full bg-slate-50 border-slate-200 rounded-xl min-h-[120px] font-medium"
                                    required
                                  />
                                </div>
                              </div>
                            )}

                            {block.type === 'quiz' && (
                              <div className="space-y-6">
                                {block.questions?.map((q, qIdx) => (
                                  <div key={qIdx} className="p-6 bg-slate-50/50 border border-slate-100 rounded-2xl shadow-sm space-y-4">
                                    <div className="flex justify-between items-center mb-1">
                                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Question {qIdx + 1}</span>
                                      <button
                                        type="button"
                                        onClick={() => removeQuizQuestion(block.id, qIdx)}
                                        className="text-red-400 hover:text-red-600 transition-colors p-1"
                                        title="Delete Question"
                                      >
                                        <FaTrash size={12} />
                                      </button>
                                    </div>
                                    <input
                                      value={q.question}
                                      onChange={(e) => updateQuizQuestion(block.id, qIdx, "question", e.target.value)}
                                      placeholder="Enter the question prompt here..."
                                      className="input input-md w-full bg-white border-slate-200 rounded-xl font-bold focus:border-blue-900 shadow-sm"
                                    />
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                      <input
                                        value={q.opt1}
                                        onChange={(e) => updateQuizQuestion(block.id, qIdx, "opt1", e.target.value)}
                                        placeholder="A) Professional Option"
                                        className="input input-sm bg-white border-slate-200 rounded-lg text-xs"
                                      />
                                      <input
                                        value={q.opt2}
                                        onChange={(e) => updateQuizQuestion(block.id, qIdx, "opt2", e.target.value)}
                                        placeholder="B) Alternative Option"
                                        className="input input-sm bg-white border-slate-200 rounded-lg text-xs"
                                      />
                                      <input
                                        value={q.opt3}
                                        onChange={(e) => updateQuizQuestion(block.id, qIdx, "opt3", e.target.value)}
                                        placeholder="C) (Optional)"
                                        className="input input-sm bg-white border-slate-200 rounded-lg text-xs"
                                      />
                                      <input
                                        value={q.opt4}
                                        onChange={(e) => updateQuizQuestion(block.id, qIdx, "opt4", e.target.value)}
                                        placeholder="D) (Optional)"
                                        className="input input-sm bg-white border-slate-200 rounded-lg text-xs"
                                      />
                                    </div>
                                    <div className="flex items-center gap-3 pt-3 mt-4 border-t border-slate-100">
                                      <label className="text-[10px] text-slate-400 uppercase font-black tracking-widest">Select Valid Key:</label>
                                      <select
                                        value={q.correctAns}
                                        onChange={(e) => updateQuizQuestion(block.id, qIdx, "correctAns", e.target.value)}
                                        className="select select-sm bg-white border-slate-200 rounded-lg w-40 text-xs font-bold"
                                      >
                                        <option value="1">Key A</option>
                                        <option value="2">Key B</option>
                                        {q.opt3 && q.opt3.trim() && <option value="3">Key C</option>}
                                        {q.opt4 && q.opt4.trim() && <option value="4">Key D</option>}
                                      </select>
                                    </div>
                                  </div>
                                ))}
                                <button type="button" onClick={() => addQuizQuestion(block.id)} className="btn btn-xs bg-slate-50 border-2 border-dashed border-slate-200 text-slate-400 hover:bg-slate-100 hover:text-slate-600 w-full py-4 h-auto rounded-xl font-bold">+ New Question</button>
                              </div>
                            )}

                            {block.type === 'photo' && (
                              <div className="space-y-6">
                                {/* Option Pool Management */}
                                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-4">
                                  <label className="text-[10px] text-slate-500 font-black uppercase tracking-widest block">
                                    1. Define Answer Options Pool
                                  </label>
                                  <div className="flex gap-2">
                                    <input
                                      type="text"
                                      id={`new-term-input-${block.id}`}
                                      placeholder="e.g. Leader, Manager, Innovator..."
                                      className="input input-sm flex-1 bg-white border-slate-200 rounded-lg text-xs font-medium"
                                      onKeyDown={(e) => {
                                        if (e.key === 'Enter') {
                                          e.preventDefault();
                                          addTermToBlock(block.id, e.target.value);
                                          e.target.value = "";
                                        }
                                      }}
                                    />
                                    <button
                                      type="button"
                                      onClick={() => {
                                        const inputEl = document.getElementById(`new-term-input-${block.id}`);
                                        if (inputEl) {
                                          addTermToBlock(block.id, inputEl.value);
                                          inputEl.value = "";
                                        }
                                      }}
                                      className="btn btn-sm bg-blue-900 text-white hover:bg-blue-800 rounded-lg font-bold text-xs"
                                    >
                                      + Add Option
                                    </button>
                                  </div>

                                  {/* List of current options */}
                                  <div className="flex flex-wrap gap-2 pt-2">
                                    {(block.terms || []).map((term, tIdx) => (
                                      <span key={tIdx} className="inline-flex items-center gap-1 bg-white text-slate-700 px-3 py-1 rounded-full text-xs font-bold border border-slate-200 shadow-sm">
                                        {term}
                                        <button
                                          type="button"
                                          onClick={() => removeTermFromBlock(block.id, term)}
                                          className="text-slate-400 hover:text-red-500 font-black ml-1 transition-colors text-[10px]"
                                        >
                                          ×
                                        </button>
                                      </span>
                                    ))}
                                    {(!block.terms || block.terms.length === 0) && (
                                      <p className="text-[10px] text-slate-400 font-medium italic">No options defined yet. Add at least one option above to associate with images.</p>
                                    )}
                                  </div>
                                </div>

                                {/* Images Grid List */}
                                <div className="space-y-4">
                                  <label className="text-[10px] text-slate-500 font-black uppercase tracking-widest block">
                                    2. Upload Images and Map Answers
                                  </label>

                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {(block.images || []).map((img, imgIdx) => (
                                      <div key={img.id} className="p-4 bg-white border border-slate-100 rounded-2xl shadow-sm space-y-3 relative group">
                                        <button
                                          type="button"
                                          onClick={() => removeImageFromBlock(block.id, img.id)}
                                          className="absolute top-2 right-2 text-slate-300 hover:text-red-500 hover:bg-red-50 p-1.5 rounded-lg transition-colors z-10"
                                          title="Remove Image"
                                        >
                                          <FaTrash size={10} />
                                        </button>

                                        <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Image #{imgIdx + 1}</div>

                                        {/* Image Upload/Preview */}
                                        {img.url ? (
                                          <div className="relative rounded-xl overflow-hidden border border-slate-200 bg-slate-50 h-32 flex items-center justify-center">
                                            <img src={img.url} alt="Grid unit preview" className="object-contain max-h-full" />
                                            <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                              <label className="btn btn-xs bg-white text-blue-900 hover:bg-slate-100 rounded cursor-pointer font-bold">
                                                Change
                                                <input
                                                  type="file"
                                                  accept="image/*"
                                                  className="hidden"
                                                  onChange={(e) => handleGridPhotoChange(block.id, img.id, e.target.files[0])}
                                                  disabled={img.uploading}
                                                />
                                              </label>
                                            </div>
                                          </div>
                                        ) : (
                                          <label className={`border border-dashed rounded-xl h-32 flex flex-col items-center justify-center cursor-pointer transition-all hover:bg-blue-50/20 ${img.uploading ? 'border-blue-400 bg-blue-50/5' : 'border-slate-300 bg-slate-50/30'}`}>
                                            <input
                                              type="file"
                                              accept="image/*"
                                              className="hidden"
                                              onChange={(e) => handleGridPhotoChange(block.id, img.id, e.target.files[0])}
                                              disabled={img.uploading}
                                            />
                                            {img.uploading ? (
                                              <div className="flex flex-col items-center gap-1.5">
                                                <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-900"></span>
                                                <span className="text-[9px] font-bold text-blue-900 uppercase tracking-widest">Uploading...</span>
                                              </div>
                                            ) : (
                                              <div className="flex flex-col items-center gap-1 text-slate-400">
                                                <FaImage size={16} />
                                                <span className="text-[10px] font-bold uppercase tracking-widest">Upload Image</span>
                                              </div>
                                            )}
                                          </label>
                                        )}

                                        {/* Dropdown Selection */}
                                        <div className="space-y-1">
                                          <label className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Correct Answer Option</label>
                                          <select
                                            value={img.correctTerm || ""}
                                            onChange={(e) => updateImageField(block.id, img.id, "correctTerm", e.target.value)}
                                            className="select select-sm select-bordered w-full bg-white border-slate-200 rounded-lg text-xs font-bold"
                                            required
                                          >
                                            <option value="">-- Choose Option --</option>
                                            {(block.terms || []).map((term, idx) => (
                                              <option key={idx} value={term}>{term}</option>
                                            ))}
                                          </select>
                                        </div>
                                      </div>
                                    ))}
                                  </div>

                                  <button
                                    type="button"
                                    onClick={() => addImageToBlock(block.id)}
                                    className="btn btn-xs bg-slate-50 border-2 border-dashed border-slate-200 text-slate-400 hover:bg-slate-100 hover:text-slate-600 w-full py-3 h-auto rounded-xl font-bold mt-2"
                                  >
                                    + Add Image to Grid
                                  </button>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Add Block Toolbar */}
                  <div className="bg-white border border-slate-100 p-4 rounded-[2rem] flex flex-wrap gap-3 justify-center mt-10 shadow-xl shadow-slate-200/20">
                    <button type="button" onClick={() => addBlock('text')} className="flex-1 min-w-[120px] py-4 bg-slate-50 rounded-2xl border border-slate-100 flex flex-col items-center gap-2 hover:bg-emerald-50 hover:border-emerald-200 transition-all group shadow-sm">
                      <FaAlignLeft className="text-slate-400 group-hover:text-emerald-600 text-xl" />
                      <span className="text-[10px] font-black uppercase text-slate-500 group-hover:text-emerald-700 tracking-widest">Add Text</span>
                    </button>
                    <button type="button" onClick={() => addBlock('video')} className="flex-1 min-w-[120px] py-4 bg-slate-50 rounded-2xl border border-slate-100 flex flex-col items-center gap-2 hover:bg-blue-50 hover:border-blue-200 transition-all group shadow-sm">
                      <FaVideo className="text-slate-400 group-hover:text-blue-600 text-xl" />
                      <span className="text-[10px] font-black uppercase text-slate-500 group-hover:text-blue-700 tracking-widest">Add Video</span>
                    </button>
                    <button type="button" onClick={() => addBlock('quiz')} className="flex-1 min-w-[120px] py-4 bg-slate-50 rounded-2xl border border-slate-100 flex flex-col items-center gap-2 hover:bg-amber-50 hover:border-amber-200 transition-all group shadow-sm">
                      <FaQuestionCircle className="text-slate-400 group-hover:text-[#8d6e3e] text-xl" />
                      <span className="text-[10px] font-black uppercase text-slate-500 group-hover:text-[#8d6e3e] tracking-widest">Add Quiz</span>
                    </button>
                    <button type="button" onClick={() => addBlock('assignment')} className="flex-1 min-w-[120px] py-4 bg-slate-50 rounded-2xl border border-slate-100 flex flex-col items-center gap-2 hover:bg-slate-100 hover:border-slate-300 transition-all group shadow-sm">
                      <FaFileAlt className="text-slate-400 group-hover:text-slate-900 text-xl" />
                      <span className="text-[10px] font-black uppercase text-slate-500 group-hover:text-slate-900 tracking-widest">Assignment</span>
                    </button>
                    <button type="button" onClick={() => addBlock('photo')} className="flex-1 min-w-[120px] py-4 bg-slate-50 rounded-2xl border border-slate-100 flex flex-col items-center gap-2 hover:bg-purple-50 hover:border-purple-200 transition-all group shadow-sm">
                      <FaImage className="text-slate-400 group-hover:text-purple-600 text-xl" />
                      <span className="text-[10px] font-black uppercase text-slate-500 group-hover:text-purple-700 tracking-widest">Add Photo</span>
                    </button>
                  </div>
                </div>
              </div>

              <div className="p-8 border-t border-slate-50 bg-slate-50/50 flex justify-end gap-4">
                <button type="button" onClick={closeModal} className="px-8 py-3 rounded-xl font-bold text-slate-400 hover:text-slate-900 transition-colors uppercase tracking-widest text-xs">Cancel</button>
                <button type="submit" disabled={addModuleMutation.isPending || updateModuleMutation.isPending} className="px-10 py-3 bg-blue-900 text-white rounded-xl font-black uppercase tracking-widest text-xs shadow-xl shadow-blue-900/20 hover:bg-blue-800 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50">
                  {addModuleMutation.isPending || updateModuleMutation.isPending ? "Saving..." : (editingModule ? "Update & Save Changes" : "Create & Save Module")}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

const CompactStat = ({ label, value, icon, color }) => {
  const colors = {
    blue: "bg-blue-50 text-blue-900",
    amber: "bg-amber-50 text-amber-700",
    emerald: "bg-emerald-50 text-emerald-700"
  };

  return (
    <div className="flex items-center gap-4 px-6 py-4 bg-white border border-slate-100 rounded-2xl shadow-sm hover:shadow-md transition-all group">
      <div className={`w-10 h-10 rounded-xl ${colors[color]} flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform`}>
        {icon}
      </div>
      <div>
        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-0.5">{label}</p>
        <p className="text-lg font-black text-slate-900 tracking-tight">{value}</p>
      </div>
    </div>
  );
};

export default CourseSummery;