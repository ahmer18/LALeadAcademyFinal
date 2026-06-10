import { useState, useEffect, useRef, useCallback } from "react";
import { useLocation, useNavigate, useParams } from "react-router";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import { FaArrowLeft, FaArrowRight, FaCheckCircle, FaVideo, FaAlignLeft, FaQuestionCircle, FaFileAlt, FaTrophy, FaStar, FaExclamationCircle, FaChevronLeft, FaChevronRight, FaImage } from "react-icons/fa";
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
// Block type icon & label helper
// ─────────────────────────────────────────────
const BLOCK_META = {
  text:       { icon: FaAlignLeft,        label: "Reading",    color: "text-blue-600",   bg: "bg-blue-50" },
  video:      { icon: FaVideo,            label: "Video",      color: "text-purple-600", bg: "bg-purple-50" },
  photo:      { icon: FaImage,            label: "Image",      color: "text-pink-600",   bg: "bg-pink-50" },
  quiz:       { icon: FaQuestionCircle,   label: "Quiz",       color: "text-emerald-600",bg: "bg-emerald-50" },
  assignment: { icon: FaFileAlt,          label: "Assignment", color: "text-amber-600",  bg: "bg-amber-50" },
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

  // ── Slide navigation state ──
  const [currentSlide, setCurrentSlide] = useState(0);
  const [slideDirection, setSlideDirection] = useState("next"); // "next" | "prev"
  const [isAnimating, setIsAnimating] = useState(false);
  const slideRef = useRef(null);
  const touchStartX = useRef(null);

  const blocks = module?.blocks || [];
  const totalSlides = blocks.length;
  const isFirstSlide = currentSlide === 0;
  const isLastSlide = currentSlide === totalSlides - 1;

  // ── Quiz / completion state ──
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

  // ── Slide navigation handlers ──
  const goToSlide = useCallback((index, direction) => {
    if (isAnimating || index < 0 || index >= totalSlides) return;
    setSlideDirection(direction);
    setIsAnimating(true);
    setTimeout(() => {
      setCurrentSlide(index);
      setIsAnimating(false);
      // Scroll to top of slide content
      if (slideRef.current) slideRef.current.scrollTop = 0;
    }, 280);
  }, [isAnimating, totalSlides]);

  const goNext = useCallback(() => {
    if (!isLastSlide) goToSlide(currentSlide + 1, "next");
  }, [currentSlide, isLastSlide, goToSlide]);

  const goPrev = useCallback(() => {
    if (!isFirstSlide) goToSlide(currentSlide - 1, "prev");
  }, [currentSlide, isFirstSlide, goToSlide]);

  // ── Keyboard navigation ──
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "ArrowRight" || e.key === " ") { e.preventDefault(); goNext(); }
      if (e.key === "ArrowLeft") { e.preventDefault(); goPrev(); }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [goNext, goPrev]);

  // ── Touch / swipe support ──
  const handleTouchStart = (e) => { touchStartX.current = e.touches[0].clientX; };
  const handleTouchEnd = (e) => {
    if (touchStartX.current === null) return;
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) { diff > 0 ? goNext() : goPrev(); }
    touchStartX.current = null;
  };

  const handleComplete = async () => {
    if (!canComplete) return;
    try {
      await axiosSecure.patch(`/update-progress/${courseId}`, {
        completedModuleOrder: module.order
      });
      confetti({ particleCount: 150, spread: 70, origin: { y: 0.6 }, colors: ["#8d6e3e", "#1e3a8a", "#ffffff"], zIndex: 100000 });
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

  // ── Current block ──
  const currentBlock = blocks[currentSlide];
  const blockMeta = BLOCK_META[currentBlock?.type] || BLOCK_META.text;
  const BlockIcon = blockMeta.icon;

  // ── Slide animation class ──
  const getSlideAnimClass = () => {
    if (isAnimating) {
      return slideDirection === "next"
        ? "mp-slide-exit-left"
        : "mp-slide-exit-right";
    }
    return slideDirection === "next"
      ? "mp-slide-enter-right"
      : "mp-slide-enter-left";
  };

  // ── Render the current block content ──
  const renderBlockContent = (block) => {
    if (!block) return null;

    if (block.type === 'text') {
      return (
        <div className="space-y-4 w-full">
          <div className="prose prose-lg max-w-none bg-white p-6 md:p-10 rounded-2xl shadow-sm border border-gray-100 relative">
            <FaAlignLeft className="absolute top-8 right-8 text-gray-200 text-3xl" />
            <div
              className="ql-editor-content text-gray-700 leading-relaxed"
              dangerouslySetInnerHTML={{ __html: block.content }}
            />
          </div>
        </div>
      );
    }

    if (block.type === 'video') {
      const embedUrl = block.videoUrl?.replace("watch?v=", "embed/");
      return (
        <div className="w-full">
          <div className="bg-black p-2 md:p-4 rounded-3xl shadow-2xl">
            <div className="aspect-video w-full rounded-2xl overflow-hidden relative">
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
        </div>
      );
    }

    if (block.type === 'photo') {
      return (
        <div className="w-full flex justify-center">
          <div className="bg-white p-4 md:p-6 rounded-3xl shadow-md border border-slate-100 overflow-hidden inline-block">
            <img
              src={block.photoUrl}
              alt={block.heading || "Module Image"}
              className="max-w-full h-auto rounded-2xl object-contain max-h-[55vh] shadow-sm"
            />
          </div>
        </div>
      );
    }

    if (block.type === 'quiz') {
      return (
        <div className="w-full">
          <InlineQuiz block={block} onPass={(passed) => handleQuizPass(block.id, passed)} />
        </div>
      );
    }

    if (block.type === 'assignment') {
      return (
        <div className="w-full">
          <div className="bg-amber-50 p-6 md:p-8 rounded-2xl border border-amber-200 relative overflow-hidden">
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
        </div>
      );
    }

    return null;
  };

  return (
    <>
      {/* ── Slide animation styles ── */}
      <style>{`
        @keyframes mpSlideEnterRight {
          from { opacity: 0; transform: translateX(60px); }
          to   { opacity: 1; transform: translateX(0); }
        }
        @keyframes mpSlideEnterLeft {
          from { opacity: 0; transform: translateX(-60px); }
          to   { opacity: 1; transform: translateX(0); }
        }
        @keyframes mpSlideExitLeft {
          from { opacity: 1; transform: translateX(0); }
          to   { opacity: 0; transform: translateX(-60px); }
        }
        @keyframes mpSlideExitRight {
          from { opacity: 1; transform: translateX(0); }
          to   { opacity: 0; transform: translateX(60px); }
        }
        .mp-slide-enter-right  { animation: mpSlideEnterRight 0.35s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        .mp-slide-enter-left   { animation: mpSlideEnterLeft  0.35s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        .mp-slide-exit-left    { animation: mpSlideExitLeft   0.25s ease-in forwards; }
        .mp-slide-exit-right   { animation: mpSlideExitRight  0.25s ease-in forwards; }
      `}</style>

      {/* Celebration Overlay */}
      {showCelebration && (
        <CelebrationModal
          module={{ ...module, courseCompletionMessage: courseCompletionMsg }}
          isCourseComplete={isLastModule}
          onContinue={handleCelebrationContinue}
        />
      )}

      {/* ── Full-screen slide layout ── */}
      <div
        className="fixed inset-0 flex flex-col bg-gradient-to-br from-slate-50 via-white to-blue-50/30 z-0"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {/* ── Top Header Bar ── */}
        <div className="flex-shrink-0 px-4 md:px-8 pt-4 pb-3 flex items-center justify-between bg-white/70 backdrop-blur-xl border-b border-slate-100/60 z-20">
          {/* Left: back + module info */}
          <div className="flex items-center gap-3 md:gap-5 min-w-0">
            <button
              onClick={() => navigate(-1)}
              className="flex-shrink-0 w-10 h-10 rounded-xl bg-slate-100 hover:bg-blue-900 hover:text-white text-slate-500 flex items-center justify-center transition-all"
            >
              <FaArrowLeft size={14} />
            </button>
            <div className="min-w-0">
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-900/60">Module {module.order}</p>
              <h1 className="text-sm md:text-base font-black text-slate-900 truncate">{module.title}</h1>
            </div>
          </div>

          {/* Center: progress bar (desktop) */}
          <div className="hidden md:flex items-center gap-3 flex-1 max-w-md mx-8">
            <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-blue-900 to-[#8d6e3e] rounded-full transition-all duration-500 ease-out"
                style={{ width: `${((currentSlide + 1) / totalSlides) * 100}%` }}
              />
            </div>
            <span className="text-xs font-bold text-slate-400 whitespace-nowrap">
              {currentSlide + 1}/{totalSlides}
            </span>
          </div>

          {/* Right: block type badge */}
          <div className={`flex-shrink-0 flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold ${blockMeta.bg} ${blockMeta.color}`}>
            <BlockIcon size={12} />
            <span className="hidden sm:inline">{blockMeta.label}</span>
          </div>
        </div>

        {/* ── Mobile progress bar ── */}
        <div className="md:hidden flex-shrink-0 px-4 pt-2">
          <div className="flex items-center gap-2">
            <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-blue-900 to-[#8d6e3e] rounded-full transition-all duration-500 ease-out"
                style={{ width: `${((currentSlide + 1) / totalSlides) * 100}%` }}
              />
            </div>
            <span className="text-[10px] font-bold text-slate-400">{currentSlide + 1}/{totalSlides}</span>
          </div>
        </div>

        {/* ── Main Slide Content ── */}
        <div className="flex-1 overflow-hidden relative">
          <div
            ref={slideRef}
            className={`absolute inset-0 overflow-y-auto px-4 md:px-8 py-6 md:py-10 ${getSlideAnimClass()}`}
            key={currentSlide}
          >
            <div className="max-w-4xl mx-auto">
              {/* Block heading */}
              {currentBlock?.heading && (
                <h2 className="text-2xl md:text-3xl font-black text-slate-800 tracking-tight mb-6">
                  {currentBlock.heading}
                </h2>
              )}

              {/* Block content */}
              {totalSlides > 0 ? (
                renderBlockContent(currentBlock)
              ) : (
                <div className="py-20 text-center text-gray-500 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
                  This module has no content blocks yet.
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ── Bottom Navigation Bar ── */}
        <div className="flex-shrink-0 px-4 md:px-8 py-4 bg-white/80 backdrop-blur-xl border-t border-slate-100/60 z-20">
          <div className="max-w-4xl mx-auto flex items-center justify-between gap-3">
            {/* Previous Button */}
            <button
              onClick={goPrev}
              disabled={isFirstSlide}
              className={`h-12 md:h-14 px-4 md:px-6 rounded-2xl font-black text-xs uppercase tracking-widest transition-all flex items-center gap-2 ${
                isFirstSlide
                  ? "bg-slate-50 text-slate-300 cursor-not-allowed"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-800 active:scale-[0.97]"
              }`}
            >
              <FaChevronLeft size={12} />
              <span className="hidden sm:inline">Previous</span>
            </button>

            {/* Dot indicators (desktop) */}
            <div className="hidden md:flex items-center gap-1.5 flex-wrap justify-center max-w-xs">
              {blocks.map((b, i) => {
                const meta = BLOCK_META[b.type] || BLOCK_META.text;
                return (
                  <button
                    key={i}
                    onClick={() => goToSlide(i, i > currentSlide ? "next" : "prev")}
                    className={`rounded-full transition-all duration-300 ${
                      i === currentSlide
                        ? `w-8 h-3 ${meta.color === "text-blue-600" ? "bg-blue-600" : meta.color === "text-purple-600" ? "bg-purple-600" : meta.color === "text-pink-600" ? "bg-pink-600" : meta.color === "text-emerald-600" ? "bg-emerald-600" : "bg-amber-600"}`
                        : "w-3 h-3 bg-slate-200 hover:bg-slate-300"
                    }`}
                    title={`${meta.label}: ${b.heading || `Block ${i + 1}`}`}
                  />
                );
              })}
            </div>

            {/* Next / Finish Button */}
            {isLastSlide ? (
              <button
                onClick={handleComplete}
                disabled={!canComplete}
                className={`h-12 md:h-14 px-5 md:px-8 rounded-2xl font-black text-xs uppercase tracking-[0.15em] transition-all shadow-xl flex items-center gap-2 ${
                  canComplete
                    ? "bg-gradient-to-r from-blue-900 to-[#8d6e3e] text-white hover:shadow-blue-900/30 hover:scale-[1.02] active:scale-[0.97] shadow-blue-900/20"
                    : "bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200 shadow-none"
                }`}
              >
                <FaCheckCircle className={canComplete ? "text-emerald-400" : ""} />
                <span>{canComplete ? "Finish Module" : "Complete Quizzes"}</span>
              </button>
            ) : (
              <button
                onClick={goNext}
                className="h-12 md:h-14 px-5 md:px-8 rounded-2xl font-black text-xs uppercase tracking-[0.15em] bg-blue-900 text-white hover:bg-blue-800 hover:scale-[1.02] active:scale-[0.97] transition-all shadow-xl shadow-blue-900/20 flex items-center gap-2"
              >
                <span>Next</span>
                <FaChevronRight size={12} />
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default ModulePlayer;
