import React, { useState } from "react";
import { Quote, Globe, MapPin, ChevronRight, ChevronLeft } from "lucide-react";

const testimonials = [
  {
    quote: "Your guidance during our PYP accreditation process brought structure, clarity, and measurable improvement to our school systems.",
    author: "Aisha Alotaibi",
    role: "Owner, Al-Yusr International School",
    location: "Jeddah, Saudi Arabia",
    id: "01"
  },
  {
    quote: "I was deeply impressed by the clarity with which he articulated the essence of my leadership approach.",
    author: "Mrs Yasmeen Raza Minhas",
    role: "Owner Principal, Foundation Public School",
    location: "Karachi, Pakistan",
    id: "02"
  },
  {
    quote: "He fostered a culture of professionalism, accountability and continuous growth. Staff morale improved remarkably.",
    author: "Mr Bil Ahmer",
    role: "Owner, Alhukama International School",
    location: "Jeddah, Saudi Arabia",
    id: "03"
  },
  {
    quote: "His strategic direction and staff development initiatives elevated both teaching quality and institutional performance.",
    author: "Mr Atakan",
    role: "Vice Principal, Gokkusagi Koleji",
    location: "Istanbul, Turkey",
    id: "04"
  },
  {
    quote: "Practical, research-driven, and immediately applicable to our classrooms.",
    author: "Owner Principal",
    role: "Tungsten School",
    location: "Karachi, Pakistan",
    id: "05"
  }
];
export default function PremiumLightUI() {
  const [index, setIndex] = useState(0);

  const next = () => setIndex((prev) => (prev + 1) % testimonials.length);
  const prev = () => setIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);

  return (
    <section className="h-screen w-full bg-[#FAF9F6] snap-start relative flex flex-col items-center justify-center overflow-hidden pt-20 px-6">
      
      {/* BACKGROUND ACCENTS */}
      <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-gray-100/50 to-transparent" />
      <div className="absolute -right-20 -bottom-20 opacity-[0.03] pointer-events-none">
        <Globe size={650} className="text-[#1B365D]" />
      </div>

      <div className="max-w-7xl w-full h-full max-h-[750px] flex flex-col relative z-10">
        
        {/* UPDATED HEADING: SINGLE LINE WITH SYNCED GRADIENT */}
        <div className="mb-10 mt-10">
           <h2 className="text-4xl md:text-6xl lg:text-7xl font-black tracking-tighter uppercase italic leading-none whitespace-nowrap">
            <span 
              className="text-transparent bg-clip-text bg-gradient-to-r from-[#1B365D] via-cyan-600 to-[#1B365D] animate-gradient-x"
              style={{ 
                WebkitTextStroke: "1px #1B365D", 
                paintOrder: "stroke fill",
                backgroundSize: '200% auto'
              }}
            >
              Trusted In 4 Countries
            </span>
          </h2>
          <div className="h-1 w-210 bg-gradient-to-r from-[#1B365D] to-cyan-500 mt-4 rounded-full" />
        </div>

        {/* INTERACTIVE GALLERY */}
        <div className="flex-grow grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* CONTENT AREA */}
          <div className="lg:col-span-8 relative">
            <Quote className="absolute -top-14 -left-10 w-24 h-24 text-[#1B365D]/5 -rotate-12" />
            
            <div key={index} className="animate-in fade-in slide-in-from-right-8 duration-700">
              <p className="text-2xl md:text-5xl font-serif text-[#1B365D] leading-tight mb-12 tracking-tight">
                "{testimonials[index].quote}"
              </p>
              
              <div className="space-y-1 border-l-4 border-cyan-500 pl-8 transition-all duration-500">
                <h4 className="text-2xl font-black text-[#1B365D] uppercase tracking-tighter">
                  {testimonials[index].author}
                </h4>
                <p className="text-gray-500 font-bold text-xs uppercase tracking-widest">
                  {testimonials[index].role}
                </p>
                <div className="flex items-center gap-2 text-cyan-600 font-bold italic text-sm pt-2">
                  <MapPin size={16} />
                  <span>{testimonials[index].location}</span>
                </div>
              </div>
            </div>
          </div>

          {/* CONTROLS AREA */}
          <div className="lg:col-span-4 flex flex-col gap-6 items-center lg:items-end">
             {/* Vertical Progress Indicator */}
             <div className="flex lg:flex-col gap-3 mb-4">
                {testimonials.map((_, i) => (
                  <button 
                    key={i} 
                    onClick={() => setIndex(i)}
                    className={`transition-all duration-500 rounded-full cursor-pointer ${
                      index === i ? 'w-12 h-1.5 lg:w-1.5 lg:h-12 bg-cyan-500 shadow-[0_0_10px_rgba(6,182,212,0.5)]' : 'w-2 h-1.5 lg:w-1.5 lg:h-2 bg-gray-200 hover:bg-gray-300'
                    }`} 
                  />
                ))}
             </div>

             {/* Navigation Buttons */}
             <div className="flex gap-4">
                <button 
                  onClick={prev}
                  className="p-5 rounded-full border border-gray-200 text-[#1B365D] hover:bg-[#1B365D] hover:text-white transition-all group active:scale-90"
                >
                  <ChevronLeft className="group-hover:-translate-x-1 transition-transform" />
                </button>
                <button 
                  onClick={next}
                  className="p-5 rounded-full border border-gray-200 bg-[#1B365D] text-white hover:bg-cyan-600 transition-all group shadow-xl active:scale-90"
                >
                  <ChevronRight className="group-hover:translate-x-1 transition-transform" />
                </button>
             </div>
          </div>

        </div>

        {/* FOOTER INFO */}
        
      </div>

      <style jsx>{`
        @keyframes gradient-x {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .animate-gradient-x {
          animation: gradient-x 6s ease infinite;
        }
      `}</style>
    </section>
  );
}