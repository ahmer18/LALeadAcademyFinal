import { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate, useParams } from "react-router";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import { FaArrowLeft, FaCheckCircle, FaVideo, FaAlignLeft, FaQuestionCircle, FaFileAlt, FaTrophy, FaStar, FaExclamationCircle } from "react-icons/fa";
import confetti from "canvas-confetti";

// ─────────────────────────────────────────────
// Inline Quiz Component
// ─────────────────────────────────────────────
const InlineQuiz = ({ block, onPass }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const questions = block.quizData || [];

  const handleAnswer = (selectedIndex) => {
    const isCorrect = selectedIndex === questions[currentStep].correctAnswerIndex;
    const newScore = score + (isCorrect ? 1 : 0);

    if (currentStep < questions.length - 1) {
      setScore(newScore);
      setCurrentStep(currentStep + 1);
    } else {
      setShowResult(true);
      onPass(newScore === questions.length);
      setScore(newScore);
    }
  };

  const handleTryAgain = () => {
    setScore(0);
    setCurrentStep(0);
    setShowResult(false);
    onPass(false);
  };

  if (questions.length === 0) return <div className="text-gray-500 italic">No questions found.</div>;

  return (
    <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-200 my-6">
      <div className="flex items-center gap-2 mb-6 text-blue-900 font-bold uppercase tracking-widest text-xs">
        <FaQuestionCircle /> Quiz
      </div>

      {!showResult ? (
        <div className="space-y-6">
          <div className="flex justify-between items-center border-b pb-4">
            <h2 className="text-lg font-bold">Question {currentStep + 1} of {questions.length}</h2>
            <span className="bg-blue-50 text-blue-800 px-3 py-1 rounded-full text-xs font-bold">
              Score: {score}
            </span>
          </div>
          <p className="text-xl font-medium text-gray-800">{questions[currentStep].question}</p>
          <div className="grid grid-cols-1 gap-3">
            {questions[currentStep].options.map((opt, idx) => (
              <button
                key={idx}
                onClick={() => handleAnswer(idx)}
                className="p-4 text-left border-2 border-gray-100 rounded-xl hover:border-blue-900 hover:bg-blue-50 transition-all group"
              >
                <span className="font-bold mr-3 text-blue-800 group-hover:text-blue-900">
                  {String.fromCharCode(65 + idx)}.
                </span>
                {opt}
              </button>
            ))}
          </div>
        </div>
      ) : (
        <div className="text-center py-6">
          {score === questions.length ? (
          <div className="space-y-6 pt-4 animate-in fade-in zoom-in duration-500">
            <div className="w-24 h-24 rounded-[2rem] bg-emerald-50 text-emerald-500 flex items-center justify-center mx-auto shadow-inner border border-emerald-100 relative group">
              <div className="absolute inset-0 bg-emerald-400/20 rounded-[2rem] animate-pulse opacity-40" />
              <FaTrophy size={40} className="relative z-10" />
            </div>
            <div>
              <h3 className="text-3xl font-black text-slate-800 tracking-tight">Mastery Achieved!</h3>
              <p className="text-sm text-emerald-600 font-bold uppercase tracking-[0.2em] mt-1">100% Correct</p>
            </div>
            <p className="text-slate-500 font-medium max-w-xs mx-auto text-sm leading-relaxed">
              Incredible work! You've successfully passed the quiz with a <span className="text-emerald-600 font-black">Perfect Score</span>.
            </p>
            <div className="inline-flex items-center gap-2 px-6 py-2 bg-emerald-50 text-emerald-700 rounded-full text-[10px] font-black uppercase tracking-widest border border-emerald-100">
              <FaCheckCircle /> Module Unlocked
            </div>
          </div>
          ) : (
            <div className="space-y-6 pt-4 animate-in fade-in zoom-in duration-500">
              <div className="w-24 h-24 rounded-[2rem] bg-amber-50 text-amber-500 flex items-center justify-center mx-auto shadow-inner border border-amber-100 relative group">
                <div className="absolute inset-0 bg-amber-400/20 rounded-[2rem] animate-ping opacity-20" />
                <FaExclamationCircle size={40} className="relative z-10" />
              </div>
              <div>
                <h3 className="text-2xl font-black text-slate-800 tracking-tight">Almost There!</h3>
                <p className="text-sm text-slate-400 font-bold uppercase tracking-[0.2em] mt-1">Score: {score} out of {questions.length}</p>
                <div className="w-full bg-slate-100 h-1.5 rounded-full mt-4 max-w-[200px] mx-auto overflow-hidden">
                  <div className="bg-amber-500 h-full transition-all duration-1000" style={{ width: `${(score/questions.length)*100}%` }} />
                </div>
              </div>
              <p className="text-slate-500 font-medium max-w-xs mx-auto text-sm leading-relaxed">
                You need a <span className="text-blue-900 font-black">Perfect Score</span> to master this module. Let's give it another shot!
              </p>
              <button onClick={handleTryAgain} className="h-14 px-10 bg-blue-900 text-white rounded-2xl font-black uppercase tracking-widest text-xs shadow-xl shadow-blue-900/20 hover:bg-blue-800 hover:scale-[1.02] active:scale-[0.98] transition-all">
                Retry Challenge →
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// ─────────────────────────────────────────────
// Celebration Modal Component
// ─────────────────────────────────────────────
const CelebrationModal = ({ module, isCourseComplete, onContinue }) => {
  // Use custom message if provided and NOT empty, otherwise use fallback
  let message = (module?.completionMessage && module.completionMessage.trim() !== "")
    ? module.completionMessage
    : "Well done! You have completed the module successfully.\nYou are building strong foundations for professional teaching.";

  if (isCourseComplete) {
    message = (module?.courseCompletionMessage && module.courseCompletionMessage.trim() !== "")
      ? module.courseCompletionMessage
      : `🏆 You have completed the full Teacher English Course (99 Professional Terms).\nYou are now confident using professional teaching language for:\n• Classrooms\n• Assessment\n• Professional growth\n• Leadership and collaboration`;
  }

  const lines = message.split("\n").filter(Boolean);

  useEffect(() => {
    // Fire confetti burst
    const fire = (particleRatio, opts) => {
      confetti({
        origin: { y: 0.6 },
        zIndex: 100000,
        ...opts,
        particleCount: Math.floor((isCourseComplete ? 400 : 150) * particleRatio),
      });
    };

    if (isCourseComplete) {
      // Bigger explosion for course completion
      fire(0.25, { spread: 30, startVelocity: 65, colors: ["#8d6e3e", "#FFF"] });
      fire(0.2, { spread: 70, startVelocity: 45, colors: ["#1e3a8a", "#1e40af"] });
      fire(0.35, { spread: 130, decay: 0.9, scalar: 1, colors: ["#8d6e3e", "#1e3a8a", "#1e40af"] });
      // Continuous side bursts for 2 seconds
      const end = Date.now() + 2000;
      const frame = () => {
        confetti({ particleCount: 2, angle: 60, spread: 55, origin: { x: 0 }, colors: ["#8d6e3e", "#1e3a8a"], zIndex: 100000 });
        confetti({ particleCount: 2, angle: 120, spread: 55, origin: { x: 1 }, colors: ["#8d6e3e", "#1e40af"], zIndex: 100000 });
        if (Date.now() < end) requestAnimationFrame(frame);
      };
      frame();
    } else {
      fire(0.25, { spread: 26, startVelocity: 55, colors: ["#8d6e3e", "#8B4513"] });
      fire(0.2, { spread: 60, colors: ["#1e3a8a", "#1e40af"] });
      fire(0.35, { spread: 100, decay: 0.91, scalar: 0.8, colors: ["#8d6e3e", "#1e3a8a"] });
    }
  }, [isCourseComplete]);

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm animate-fadeIn p-4">
      <div
        className="relative bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden"
        style={{ animation: "celebrationPop 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards" }}
      >
        {/* Top Banner */}
        <div className={`p-8 text-center relative overflow-hidden bg-gradient-to-br ${isCourseComplete
          ? "from-[#8d6e3e] via-[#6b522e] to-[#4d3a21]"
          : "from-blue-900 via-blue-950 to-[#8d6e3e]"
          }`}>
          <div className="absolute inset-0 opacity-20"
            style={{ backgroundImage: "radial-gradient(circle at 30% 50%, white 1px, transparent 1px), radial-gradient(circle at 70% 50%, white 1px, transparent 1px)", backgroundSize: "30px 30px" }}
          />
          {/* Animated Trophy */}
          <div className="relative inline-block mb-3" style={{ animation: "trophyBounce 0.8s ease 0.3s both" }}>
            <div className={`w-24 h-24 rounded-full flex items-center justify-center mx-auto shadow-2xl border-4 border-white/30 ${isCourseComplete ? "bg-amber-100/30" : "bg-white/10"
              }`}>
              <FaTrophy className={`${isCourseComplete ? "text-white" : "text-[#8d6e3e]"} text-5xl drop-shadow-lg`} />
            </div>
            {/* Sparkles */}
            <FaStar className="absolute -top-1 -right-1 text-yellow-300 text-lg animate-pulse" />
            <FaStar className="absolute -top-2 left-2 text-white text-xs animate-pulse" style={{ animationDelay: "0.3s" }} />
          </div>
          <h2 className="text-white font-black text-2xl tracking-tight drop-shadow">
            {isCourseComplete ? "COURSE COMPLETED!" : "Module Completed!"}
          </h2>
          <p className="text-white/80 text-sm mt-1 font-medium">
            {isCourseComplete ? "Congratulations on this achievement!" : `Module ${module.order}: ${module.title}`}
          </p>
        </div>

        {/* Message Body */}
        {lines.length > 0 && (
          <div className="px-8 py-6 space-y-3">
            {lines.map((line, i) => {
              const isBullet = line.trim().startsWith("•");
              return (
                <p
                  key={i}
                  className={`leading-relaxed ${isBullet
                    ? "text-gray-600 text-sm flex items-start gap-2 pl-2"
                    : "text-gray-700 text-base font-medium"
                    }`}
                  style={{ animation: `fadeSlideIn 0.4s ease ${0.1 + i * 0.08}s both` }}
                >
                  {isBullet ? (
                    <>
                      <span className="text-[#8d6e3e] mt-1">•</span>
                      <span>{line.replace("•", "").trim()}</span>
                    </>
                  ) : (
                    line
                  )}
                </p>
              );
            })}
          </div>
        )}

        {/* CTA */}
        <div className="px-8 pb-8">
          <button
            onClick={onContinue}
            className="w-full py-4 bg-gradient-to-r from-blue-900 to-[#8d6e3e] text-white rounded-2xl font-black text-lg shadow-xl shadow-blue-900/20 hover:shadow-blue-900/30 hover:scale-[1.02] active:scale-[0.98] transition-all"
          >
            Continue →
          </button>
          <p className="text-center text-xs text-gray-400 mt-3 font-medium">
            Your progress has been saved
          </p>
        </div>
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────
// Main ModulePlayer Component
// ─────────────────────────────────────────────
const ModulePlayer = () => {
  const { state } = useLocation();
  const { courseId } = useParams();
  const navigate = useNavigate();
  const axiosSecure = useAxiosSecure();
  const module = state?.module;

  // Track if all quizzes in this module are passed
  const [quizStatuses, setQuizStatuses] = useState({});
  const [canComplete, setCanComplete] = useState(true);
  const [showCelebration, setShowCelebration] = useState(false);
  const [isLastModule, setIsLastModule] = useState(false);
  const [courseCompletionMsg, setCourseCompletionMsg] = useState("");

  // Fetch Course Info to check if this is the last module
  useEffect(() => {
    const checkLastModule = async () => {
      try {
        const { data } = await axiosSecure.get(`/courses/${courseId}`);
        const allModules = data?.course?.modules || [];
        if (allModules.length > 0) {
          const maxOrder = Math.max(...allModules.map(m => m.order));
          setIsLastModule(module?.order === maxOrder);
          if (data.course.courseCompletionMessage) {
            setCourseCompletionMsg(data.course.courseCompletionMessage);
          }
        }
      } catch (err) {
        console.error("Error checking course length", err);
      }
    };
    if (courseId && module) checkLastModule();
  }, [courseId, module, axiosSecure]);

  useEffect(() => {
    if (!module || !module.blocks) return;
    const quizBlocks = module.blocks.filter(b => b.type === 'quiz');
    if (quizBlocks.length === 0) { setCanComplete(true); return; }
    const allPassed = quizBlocks.every(qk => quizStatuses[qk.id] === true);
    setCanComplete(allPassed);
  }, [quizStatuses, module]);

  const handleQuizPass = (blockId, passed) => {
    setQuizStatuses(prev => ({ ...prev, [blockId]: passed }));
  };

  const handleComplete = async () => {
    if (!canComplete) {
      return;
    }
    try {
      await axiosSecure.patch(`/update-progress/${courseId}`, {
        completedModuleOrder: module.order
      });
      console.log("Progress updated successfully");

      // Fire a safety confetti burst immediately
      confetti({
        particleCount: 150,
        spread: 70,
        origin: { y: 0.6 },
        colors: ["#8d6e3e", "#1e3a8a", "#ffffff"],
        zIndex: 100000
      });

      setShowCelebration(true);
    } catch (err) {
      console.warn("Progress update failed, but showing celebration anyway:", err);
      setShowCelebration(true);
    }
  };

  const handleCelebrationContinue = () => {
    setShowCelebration(false);
    navigate(-1);
  };

  if (!module) return <div className="p-10 text-center">Module data not found.</div>;

  return (
    <>
      {/* Celebration Overlay */}
      {showCelebration && (
        <CelebrationModal
          module={{ ...module, courseCompletionMessage: courseCompletionMsg }}
          isCourseComplete={isLastModule}
          onContinue={handleCelebrationContinue}
        />
      )}

      <div className="max-w-6xl mx-auto p-6 md:px-12 md:pt-32 space-y-12 pb-48 animate-fadeIn">
        <div className="flex justify-between items-center">
          <button onClick={() => navigate(-1)} className="group flex items-center gap-2 text-slate-400 hover:text-blue-900 transition-all font-black text-xs uppercase tracking-widest">
            <FaArrowLeft className="group-hover:-translate-x-1 transition-transform" /> Back to Learning Path
          </button>
        </div>

        <div className="space-y-6 mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-blue-50/50 text-blue-900 font-black tracking-[0.2em] uppercase text-[10px] rounded-full border border-blue-100/50">
            <div className="w-1.5 h-1.5 rounded-full bg-blue-900 animate-pulse" />
            Module {module.order}
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tight leading-[0.9]">{module.title}</h1>
          <div className="h-1.5 w-24 bg-blue-900 rounded-full" />
        </div>

        <div className="space-y-20">
          {module.blocks?.map((block, index) => {
            if (block.type === 'text') {
              return (
                <div key={index} className="prose prose-lg max-w-none bg-white p-8 rounded-2xl shadow-sm border border-gray-100 relative">
                  <FaAlignLeft className="absolute top-8 right-8 text-gray-200 text-3xl" />
                  <div
                    className="ql-editor-content text-gray-700 leading-relaxed"
                    dangerouslySetInnerHTML={{ __html: block.content }}
                  />
                </div>
              );
            }

            if (block.type === 'video') {
              const embedUrl = block.videoUrl?.replace("watch?v=", "embed/");
              return (
                <div key={index} className="bg-black p-2 md:p-4 rounded-3xl shadow-2xl">
                  <div className="aspect-video w-full rounded-2xl overflow-hidden relative group">
                    <iframe
                      width="100%"
                      height="100%"
                      src={embedUrl}
                      title="Video Player"
                      frameBorder="0"
                      allowFullScreen
                      className="absolute inset-0 z-10"
                    ></iframe>
                  </div>
                </div>
              );
            }

            if (block.type === 'quiz') {
              return <InlineQuiz key={index} block={block} onPass={(passed) => handleQuizPass(block.id, passed)} />;
            }

            if (block.type === 'assignment') {
              return (
                <div key={index} className="bg-amber-50 p-6 md:p-8 rounded-2xl border border-amber-200 relative overflow-hidden">
                  <FaFileAlt className="absolute -bottom-4 -right-4 text-amber-200/50 text-9xl" />
                  <div className="relative z-10 flex items-center gap-3 mb-4">
                    <span className="w-10 h-10 rounded-xl bg-amber-200 flex items-center justify-center text-amber-800 shadow-inner">
                      <FaFileAlt />
                    </span>
                    <h3 className="text-xl font-bold text-amber-900">Assignment Task</h3>
                  </div>
                  <div className="relative z-10 prose prose-amber">
                    <p className="whitespace-pre-wrap text-amber-900/80 font-medium">{block.assignmentDetails?.description || block.description}</p>
                  </div>
                  <div className="mt-6 inline-flex items-center gap-2 px-4 py-2 bg-amber-900 text-white text-xs font-bold rounded-lg tracking-wider">
                    DUE DATE: <span className="text-amber-300">{block.assignmentDetails?.deadline || block.deadline}</span>
                  </div>
                  <p className="text-xs text-amber-700/60 mt-4 relative z-10 font-bold italic">
                    * Return to the Course Dashboard to submit this assignment file when ready.
                  </p>
                </div>
              );
            }

            return null;
          })}
          {(!module.blocks || module.blocks.length === 0) && (
            <div className="py-20 text-center text-gray-500 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
              This module has no content blocks yet.
            </div>
          )}
        </div>

        {/* Bottom bar */}
        <div className="fixed bottom-0 left-0 right-0 p-6 bg-white/60 backdrop-blur-2xl border-t border-slate-100/50 z-50">
          <div className="max-w-6xl mx-auto w-full flex justify-between items-center bg-white p-4 rounded-[2rem] shadow-2xl shadow-blue-900/10 border border-slate-50">
            <div className="hidden md:flex items-center gap-3 ml-4">
               <div className={`w-3 h-3 rounded-full ${canComplete ? 'bg-emerald-500 animate-pulse' : 'bg-slate-200'}`} />
               <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">
                 {canComplete
                   ? "You've mastered this module!"
                   : "Complete all quizzes to finish"}
               </p>
            </div>
            <button
              onClick={handleComplete}
              disabled={!canComplete}
              className={`h-16 px-12 rounded-2xl font-black text-xs uppercase tracking-[0.2em] transition-all shadow-xl flex items-center gap-3 ${canComplete
                ? "bg-blue-900 text-white hover:bg-blue-800 hover:scale-[1.02] shadow-blue-900/20"
                : "bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200"
                }`}
            >
              <FaCheckCircle className={canComplete ? "text-emerald-400" : ""} /> 
              {canComplete ? "Finish Module" : "Quizzes Required"}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default ModulePlayer;
