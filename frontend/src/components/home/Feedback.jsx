import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useState, useRef, useEffect } from "react";
import renderStars from "../../utils/renderStarts";
import { useSystemTheme } from "../../hooks/useSystemTheme";

export default function Feedback() {
  const isLight = useSystemTheme();
  
  const { data: feedbacks = [] } = useQuery({
    queryKey: ["feedbacks"],
    queryFn: async () => {
      const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/feedbacks`);
      const enrichedFeedbacks = await Promise.all(
        response.data.feedbacks.map(async (feedback) => {
          let courseInfo = { title: "Unknown Course" };
          let userInfo = { displayName: feedback.studentEmail, photoURL: "/default-avatar.png" };
          
          if (feedback.courseId) {
            try {
              const courseRes = await axios.get(`${import.meta.env.VITE_BASE_URL}/courses/${feedback.courseId}`);
              courseInfo = { title: courseRes.data.course?.title || "Unknown Course" };
            } catch (e) { courseInfo = { title: "Course Not Available" }; }
          }
          
          if (feedback.studentEmail) {
            try {
              const userRes = await axios.get(`${import.meta.env.VITE_BASE_URL}/users/${feedback.studentEmail}`);
              userInfo = {
                displayName: userRes.data.displayName || feedback.studentEmail,
                photoURL: userRes.data.photoURL || "/default-avatar.png"
              };
            } catch (e) { userInfo = { displayName: feedback.studentEmail, photoURL: "/default-avatar.png" }; }
          }
          return { ...feedback, userInfo, courseInfo };
        })
      );
      return enrichedFeedbacks;
    },
  });

  const carouselRef = useRef(null);
  const pauseRef = useRef(false);
  const rafRef = useRef(null);
  const lastTimeRef = useRef(null);
  const offsetRef = useRef(0);
  const SPEED = 0.08; 
  const [renderList, setRenderList] = useState([]);

  const startAnimation = () => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    const step = (now) => {
      const container = carouselRef.current;
      if (!container) return;
      const inner = container.firstElementChild;
      if (!inner || pauseRef.current) {
        lastTimeRef.current = null;
        rafRef.current = requestAnimationFrame(step);
        return;
      }

      if (!lastTimeRef.current) lastTimeRef.current = now;
      const delta = now - lastTimeRef.current;
      lastTimeRef.current = now;

      offsetRef.current -= SPEED * delta;
      const first = inner.firstElementChild;
      const gap = 24; // gap-6
      const firstWidth = first ? first.offsetWidth + gap : 0;

      inner.style.transform = `translateX(${offsetRef.current}px)`;

      if (first && Math.abs(offsetRef.current) >= firstWidth) {
        setRenderList((prev) => {
          const [firstItem, ...rest] = prev;
          return [...rest, firstItem];
        });
        offsetRef.current += firstWidth;
        inner.style.transform = `translateX(${offsetRef.current}px)`;
      }
      rafRef.current = requestAnimationFrame(step);
    };
    rafRef.current = requestAnimationFrame(step);
  };

  useEffect(() => {
    if (feedbacks.length > 0) startAnimation();
    return () => rafRef.current && cancelAnimationFrame(rafRef.current);
  }, [feedbacks.length]);

  useEffect(() => { setRenderList(feedbacks); }, [feedbacks]);

  if (feedbacks.length === 0) return null;

  return (
    <section 
      className="relative py-20 md:py-32 overflow-hidden snap-start snap-always"
      style={{ background: 'radial-gradient(circle at center, #1f2937 0%, #111827 50%, #000000 100%)' }}
    >
      {/* Premium Overlays */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-900/10 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-900/10 rounded-full blur-[120px]" />
      </div>

      <div className="max-w-9xl mx-auto px-6 relative z-10">
        <div className="text-center mb-16">
          <span className="text-blue-500 font-bold uppercase tracking-[0.3em] text-xs mb-4 block">Testimonials</span>
          <h2 className="text-4xl md:text-5xl font-black text-[#FAF9F6] tracking-tight">
            Success <span className="text-blue-500 italic">Stories</span>
          </h2>
        </div>

        <div
          ref={carouselRef}
          onMouseEnter={() => pauseRef.current = true}
          onMouseLeave={() => { pauseRef.current = false; startAnimation(); }}
          className="overflow-hidden w-full cursor-grab active:cursor-grabbing"
        >
          <div className="flex items-stretch gap-6 flex-nowrap" style={{ willChange: 'transform' }}>
            {renderList.map((feedback, idx) => (
              <div key={`${feedback._id}-${idx}`} className="flex-shrink-0 w-80 md:w-[450px]">
                <FeedbackCard feedback={feedback} isLight={isLight} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function FeedbackCard({ feedback, isLight }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const photoURL = feedback?.userInfo?.photoURL || "/default-avatar.png";

  return (
    <div className="h-full py-4 group">
      {/* Modal Backdrop */}
      {isExpanded && (
        <div 
          className="fixed inset-0 z-[60] bg-black/70 backdrop-blur-md transition-opacity duration-500" 
          onClick={() => setIsExpanded(false)}
        ></div>
      )}

      <div
        className={`relative p-8 rounded-[2rem] transition-all duration-500 flex flex-col overflow-hidden border ${
          isExpanded 
          ? "fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] max-w-xl z-[70] scale-100 shadow-2xl" 
          : "h-full shadow-xl hover:-translate-y-2"
        } ${
          isLight 
            ? "border-blue-100 hover:border-blue-300" 
            : "border-blue-900/30 hover:border-blue-500/40"
        }`}
        style={{
          background: isLight 
            ? 'linear-gradient(135deg, #ffffff 0%, #f0f9ff 100%)' 
            : 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
        }}
      >
        {/* Glow Decor */}
        <div className={`absolute top-0 right-0 w-32 h-32 blur-3xl -mr-16 -mt-16 pointer-events-none ${
          isLight ? "bg-blue-200/40" : "bg-blue-600/10"
        }`} />
        
        <div className="relative z-10 flex items-center gap-5 mb-8">
          <div className="relative">
            <img 
              src={photoURL} 
              className="w-16 h-16 rounded-2xl shadow-lg object-cover border-2 border-white/80" 
              alt="student"
            />
            <div className="absolute -bottom-1 -right-1 bg-blue-600 text-white p-1 rounded-full border-2 border-white text-[8px]">
              <svg fill="currentColor" viewBox="0 0 20 20" className="w-2.5 h-2.5">
                <path d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293l-4 4a1 1 0 01-1.414 0l-2-2a1 1 0 111.414-1.414L9 10.586l3.293-3.293a1 1 0 111.414 1.414z"></path>
              </svg>
            </div>
          </div>
          
          <div className="flex-1 min-w-0">
            <h3 className={`font-black truncate tracking-tight text-xl ${isLight ? "text-gray-900" : "text-white"}`}>
              {feedback?.userInfo?.displayName || "Academy Learner"}
            </h3>
            <div className="flex items-center gap-2 mt-1">
               <span className="w-5 h-[1.5px] bg-blue-500"></span>
               <p className="text-[10px] uppercase font-black text-blue-500 tracking-[0.2em] truncate">
                 {feedback?.courseInfo?.title}
               </p>
            </div>
          </div>
        </div>

        <div className="relative z-10 mb-8">
          <span className="text-5xl text-blue-500/10 absolute -top-6 -left-3 font-serif select-none">“</span>
          <p className={`leading-relaxed font-medium italic px-2 text-base ${
            isExpanded ? "" : "line-clamp-4"
          } ${isLight ? "text-gray-600" : "text-gray-300"}`}>
            {feedback.feedback}
          </p>
        </div>
        
        <div className={`mt-auto relative z-10 flex items-center justify-between border-t pt-6 ${
          isLight ? "border-blue-50/50" : "border-gray-800"
        }`}>
          <div className="flex gap-1 text-amber-500 text-sm">
            {renderStars(feedback.rating)}
          </div>
          
          {feedback.feedback?.length > 150 && (
            <button 
              onClick={(e) => {
                e.stopPropagation();
                setIsExpanded(!isExpanded);
              }}
              className={`group/btn flex items-center gap-2 text-[10px] font-black uppercase tracking-widest transition-all ${
                isLight ? "text-blue-900 hover:text-blue-600" : "text-blue-400 hover:text-blue-300"
              }`}
            >
              {isExpanded ? "Close" : "Full Story"}
              <span className="group-hover/btn:translate-x-1 transition-transform duration-300">→</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}