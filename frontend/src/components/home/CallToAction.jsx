import React, { useState, useEffect, useRef } from "react";
import { Mail, MessageCircle, FileText, Calendar, Check } from "lucide-react";
import bgImage from "../../assets/images/c2a.jpg";
import Footer from "../../components/common/Footer";

export default function CallToAction({ onVisible }) {
  const [copied, setCopied] = useState(false);
  const sectionRef = useRef(null);
  const emailAddress = "info@laleadacademy.com";

  // ✅ Intersection Observer to hide/show Navbar
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (onVisible) {
          // If isIntersecting is true, it means we are in this section
          onVisible(entry.isIntersecting);
        }
      },
      { threshold: 0.3 } // Triggers when 30% of the section is visible
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) observer.unobserve(sectionRef.current);
    };
  }, [onVisible]);

  const handleEmailClick = () => {
    navigator.clipboard.writeText(emailAddress);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div 
      ref={sectionRef}
      className="h-screen w-full flex flex-col snap-start snap-always overflow-hidden bg-[#020617]"
    >
      <section
        className="relative flex-grow w-full flex items-center justify-center px-6 text-white text-center"
        style={{
          backgroundImage: `url(${bgImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        {/* Deep Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#020617] via-[#020617]/95 to-[#020617]/80"></div>

        {/* Content Container - No Scale to prevent top clipping */}
        <div className="relative z-10 w-full max-w-5xl mx-auto flex flex-col items-center justify-center py-10">
          
          <div className="mb-10">
            <h2 className="text-4xl md:text-6xl lg:text-7xl font-black tracking-tighter uppercase italic leading-[0.9] mb-8">
              <span className="text-white opacity-60 block mb-2">Ready to strengthen your</span>
              <span 
                className="text-transparent bg-clip-text bg-gradient-to-r from-white via-cyan-400 to-white inline-block"
                style={{ 
                  textShadow: `-1px -1px 0 #FAF9F6, 1px -1px 0 #FAF9F6, -1px 1px 0 #FAF9F6, 1px 1px 0 #FAF9F6`,
                  filter: "drop-shadow(0 0 15px rgba(34, 211, 238, 0.4))"
                }}
              >
                School’s Leadership?
              </span>
            </h2>

            <p className="text-base md:text-lg text-gray-400 max-w-2xl mx-auto font-medium leading-relaxed">
              Partner with LALEAD Academy to implement evidence-based coaching and 
              rigorous international standards in your institution.
            </p>
          </div>

          <div className="flex flex-col items-center gap-8 w-full">
            {/* Main Action Button */}
            <a
              href="https://wa.me/905346053958?text=I%20would%20like%20to%20request%20a%20school%20proposal."
              target="_blank"
              rel="noopener noreferrer"
              className="group relative flex items-center justify-center gap-4 bg-cyan-600 hover:bg-cyan-500 text-white font-black px-12 py-5 rounded-2xl shadow-[0_20px_50px_rgba(8,145,178,0.3)] transition-all hover:-translate-y-1 tracking-[0.2em] uppercase text-xs md:text-sm w-full md:w-auto"
            >
              <FileText size={20} className="group-hover:rotate-12 transition-transform" /> 
              Request a School Proposal
            </a>

            {/* Quick Contact Links */}
            <div className="flex flex-wrap items-center justify-center gap-3">
              <a 
                href="https://wa.me/905346053958" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-3 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 px-5 py-3 rounded-full transition-all hover:scale-105 font-bold uppercase tracking-widest text-[10px]"
              >
                <MessageCircle size={16} fill="currentColor" className="opacity-20" />
                Chat
              </a>

              <div className="relative">
                <button 
                  onClick={handleEmailClick}
                  className="flex items-center gap-3 bg-white/5 hover:bg-white/10 border border-white/10 text-white px-5 py-3 rounded-full transition-all hover:scale-105 font-bold uppercase tracking-widest text-[10px]"
                >
                  <Mail size={16} />
                  {emailAddress}
                </button>
                {copied && (
                  <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-white text-[#020617] text-[10px] px-4 py-2 rounded-lg shadow-2xl flex items-center gap-2 font-black animate-in fade-in zoom-in slide-in-from-bottom-2 duration-300">
                    <Check size={12} strokeWidth={3} /> EMAIL COPIED
                  </div>
                )}
              </div>

              <a
                href="https://wa.me/905346053958?text=I%20would%20like%20to%20schedule%20a%20strategy%20call."
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 bg-cyan-400/10 hover:bg-cyan-400/20 border border-cyan-400/30 text-cyan-400 px-5 py-3 rounded-full transition-all hover:scale-105 font-bold uppercase tracking-widest text-[10px]"
              >
                <Calendar size={16} />
                Schedule Call
              </a>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}