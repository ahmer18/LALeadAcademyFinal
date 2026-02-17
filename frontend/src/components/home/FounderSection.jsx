import React from "react";
import { Award, GraduationCap, Globe2, Quote } from "lucide-react";
import trainerImage from "../../assets/images/teacher.jpeg";

export default function FounderSection() {
  return (
    <section className="h-screen w-full bg-[#FAF9F6] snap-start relative flex flex-col items-center justify-center overflow-hidden px-6 pt-20">
      
      {/* BACKGROUND ACCENTS */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none flex items-center justify-center">
        <h2 className="text-[20rem] font-black uppercase tracking-tighter select-none">LEAD</h2>
      </div>

      <div className="max-w-7xl w-full h-full max-h-[800px] grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
        
        {/* LEFT SIDE: PROFESSIONAL PORTRAIT */}
        <div className="lg:col-span-5 relative group">
          <div className="relative w-full aspect-[8/9] rounded-[40px] overflow-hidden shadow-2xl border-[12px] border-white">
            <img 
  src={trainerImage} 
  alt="Muhammad Ahmed"
  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
/>
            {/* Overlay Gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#1B365D]/40 to-transparent" />
          </div>
          
          {/* Experience Badge */}
          <div className="absolute -bottom-6 -right-6 bg-white p-6 rounded-3xl shadow-xl border border-gray-100 flex flex-col items-center">
            <span className="text-4xl font-black text-cyan-600">28+</span>
            <span className="text-[10px] font-black uppercase tracking-widest text-[#1B365D]">Years Exp</span>
          </div>
        </div>

        {/* RIGHT SIDE: BIO & CREDENTIALS */}
        <div className="lg:col-span-7 flex flex-col">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#1B365D]/5 border border-[#1B365D]/10 text-[#1B365D] text-xs font-black tracking-widest uppercase mb-6 w-fit">
            Founder & Visionary
          </div>

          <h2 className="text-5xl md:text-8xl font-black tracking-tighter uppercase italic leading-[0.8] mb-4">
            <span className="text-[#1B365D] block">Muhammad</span>
            <span 
              className="text-transparent bg-clip-text bg-gradient-to-r from-[#1B365D] to-cyan-600 block"
              style={{ WebkitTextStroke: "1px #1B365D", paintOrder: "stroke fill" }}
            >
              Ahmed
            </span>
          </h2>

          <div className="flex flex-wrap gap-4 mb-8">
            <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-xl shadow-sm border border-gray-100 font-bold text-[#1B365D] text-sm">
              <GraduationCap size={18} className="text-cyan-600" /> MA Education (UK)
            </div>
            <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-xl shadow-sm border border-gray-100 font-bold text-[#1B365D] text-sm">
              <Award size={18} className="text-cyan-600" /> Harvard Trained
            </div>
          </div>

          <div className="space-y-6 max-w-2xl">
            <p className="text-xl md:text-2xl font-serif text-[#1B365D] leading-relaxed italic border-l-4 border-cyan-500 pl-6">
              "An education consultant and leadership trainer with over 28 years of experience across the UK, Turkey, Saudi Arabia, and Pakistan."
            </p>
            
            <p className="text-gray-600 text-lg leading-relaxed font-medium">
              Educated in the UK and professionally trained through programmes at 
              <span className="text-[#1B365D] font-bold"> Harvard University</span>, 
              his work centres on leadership formation, reflective decision-making, and 
              inquiry-driven teaching aligned with international standards and local school realities.
            </p>
          </div>

          {/* GLOBAL FOOTPRINT */}
          <div className="mt-10 flex items-center gap-4 text-gray-400">
             <Globe2 size={20} />
             <div className="flex gap-4 text-[10px] font-black uppercase tracking-[0.2em]">
                <span>UK</span>
                <span className="text-cyan-500">•</span>
                <span>Turkey</span>
                <span className="text-cyan-500">•</span>
                <span>Saudi Arabia</span>
                <span className="text-cyan-500">•</span>
                <span>Pakistan</span>
             </div>
          </div>
        </div>

      </div>
    </section>
  );
}