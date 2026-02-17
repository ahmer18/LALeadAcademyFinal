import React, { useState } from "react";
import { 
  Users, Trophy, Target, ShieldCheck, 
  BookOpen, CheckCircle2, Layout, ArrowRight 
} from "lucide-react";

const achievements = [
  { id: "01", title: "Teacher Engagement", desc: "Increased teacher engagement and instructional clarity through evidence-based coaching.", icon: <Users /> },
  { id: "02", title: "Leadership Alignment", desc: "Improved leadership alignment across departments for a unified school vision.", icon: <Layout /> },
  { id: "03", title: "IB Authorization", desc: "Successful IB PYP and MYP authorization and rigorous accreditation preparation.", icon: <Trophy /> },
  { id: "04", title: "Measurable Growth", desc: "Clear action plans for measurable school improvement and data-driven results.", icon: <Target /> },
  { id: "05", title: "WASC Readiness", desc: "WASC-aligned school improvement planning and full accreditation readiness.", icon: <ShieldCheck /> },
  { id: "06", title: "Curriculum Alignment", desc: "Enhanced Cambridge and international curriculum alignment for global standards.", icon: <BookOpen /> },
  { id: "07", title: "Elite Training", desc: "Targeted teacher professional development and high-level leadership training.", icon: <CheckCircle2 /> },
];
export default function AchievementLightGallery() {
  const [active, setActive] = useState(achievements[0]);

  return (
    <section className="h-screen w-full bg-[#FAF9F6] snap-start relative flex items-center justify-center overflow-hidden pt-10">
      
      {/* BACKGROUND GRAPHIC ACCENT (Full screen, outside the scale) */}
      <div className="absolute -right-20 -top-20 opacity-[0.03] pointer-events-none">
        <Trophy size={800} className="text-[#1B365D]" />
      </div>

      {/* SCALE WRAPPER: Matches your FounderSection zoom */}
      <div className="w-full h-full flex items-center justify-center transform scale-90 origin-center transition-transform duration-500">
        
        <div className="max-w-7xl w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10 px-6">
          
          {/* LEFT SIDE: HEADER & MENU */}
          <div className="lg:col-span-5 flex flex-col h-full justify-center">
            <div className="mb-10">
              <h2 className="text-4xl md:text-6xl font-black tracking-tighter uppercase italic leading-none">
                <span className="text-[#1B365D] opacity-40 block">What Schools</span>
                <span 
                  className="text-transparent bg-clip-text bg-gradient-to-r from-[#1B365D] via-cyan-600 to-[#1B365D] block"
                  style={{ 
                    WebkitTextStroke: "1px #1B365D", 
                    backgroundSize: '200% auto', 
                    animation: 'gradientFlow 5s linear infinite' 
                  }}
                >
                  Achieve With Us?
                </span>
              </h2>
            </div>

            <div className="flex flex-col gap-1">
              {achievements.map((item) => (
                <button
                  key={item.id}
                  onMouseEnter={() => setActive(item)}
                  className={`group flex items-center gap-4 p-3 rounded-xl transition-all duration-500 text-left ${
                    active.id === item.id 
                      ? 'bg-white shadow-[0_10px_30px_rgba(0,0,0,0.05)] translate-x-4 border-l-4 border-cyan-500' 
                      : 'hover:bg-gray-100 hover:translate-x-2'
                  }`}
                >
                  <span className={`text-sm font-black italic ${active.id === item.id ? 'text-cyan-600' : 'text-gray-300'}`}>
                    {item.id}
                  </span>
                  <span className={`text-base md:text-xl font-bold tracking-tight transition-colors ${active.id === item.id ? 'text-[#1B365D]' : 'text-gray-400'}`}>
                    {item.title}
                  </span>
                  <ArrowRight className={`ml-auto transition-all ${active.id === item.id ? 'text-cyan-500 opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'}`} size={18} />
                </button>
              ))}
            </div>
          </div>

          {/* RIGHT SIDE: THE SHOWCASE STAGE */}
          <div className="lg:col-span-7 flex items-center justify-center">
            <div className="relative w-full max-w-[550px] p-1 bg-gradient-to-br from-gray-200 to-transparent rounded-[50px]">
              <div 
                key={active.id}
                className="relative z-10 w-full p-10 md:p-16 rounded-[48px] bg-white shadow-2xl flex flex-col items-center text-center animate-in fade-in zoom-in slide-in-from-right-10 duration-700"
              >
                <div className="w-24 h-24 rounded-[32px] bg-[#1B365D] flex items-center justify-center text-white mb-10 shadow-[0_20px_40px_rgba(27,54,93,0.2)]">
                  {React.cloneElement(active.icon, { size: 48, strokeWidth: 1.5 })}
                </div>
                
                <h3 className="text-3xl md:text-4xl font-black text-[#1B365D] mb-6 uppercase tracking-tighter italic">
                  {active.title}
                </h3>
                
                <p className="text-gray-600 text-lg md:text-xl leading-relaxed font-serif italic">
                  "{active.desc}"
                </p>

                {/* PROGRESS DASHES */}
                <div className="mt-12 flex gap-2">
                  {achievements.map((dot) => (
                    <div 
                      key={dot.id} 
                      className={`h-1.5 rounded-full transition-all duration-700 ${
                        active.id === dot.id ? 'w-12 bg-cyan-500' : 'w-3 bg-gray-200'
                      }`} 
                    />
                  ))}
                </div>
              </div>
              <div className="absolute -inset-4 bg-cyan-500/5 blur-3xl rounded-full pointer-events-none" />
            </div>
          </div>

        </div>
      </div>

      <style>{`
        @keyframes gradientFlow {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
      `}</style>
    </section>
  );
}