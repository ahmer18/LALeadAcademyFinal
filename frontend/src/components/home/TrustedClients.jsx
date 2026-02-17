import { useEffect, useRef, useState } from "react";
import { GraduationCap, Globe, LineChart } from "lucide-react"; 
import bannerImg from "../../assets/images/section2bg.png";

const highlights = [
  {
    title: "UK Leadership",
    desc: "UK educational leadership & teacher development experience",
    icon: <GraduationCap className="w-8 h-8 text-green-400" />,
  },
  {
    title: "Global Curriculum",
    desc: "International curriculum IB & Cambridge exposure",
    icon: <Globe className="w-8 h-8 text-blue-400" />,
  },
  {
    title: "School Transformation",
    desc: "Research-based school transformation practices",
    icon: <LineChart className="w-8 h-8 text-emerald-400" />,
  },
];

export default function TrustedClients() {
  const sectionRef = useRef(null);
  const bgRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observerEl = sectionRef.current;
    if (!observerEl) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        // Toggle isVisible based on intersection status to allow re-triggering
        setIsVisible(entry.isIntersecting);
      },
      { 
        threshold: 0.2,
        rootMargin: "-50px" // Slight margin to ensure it triggers cleanly
      }
    );

    observer.observe(observerEl);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      id="section2"
      ref={sectionRef}
      className="relative w-full min-h-screen snap-start overflow-hidden bg-[#050505] flex flex-col justify-center"
    >
      {/* BACKGROUND */}
      <div
        ref={bgRef}
        className="absolute inset-0 bg-cover bg-center z-0 opacity-40"
        style={{ backgroundImage: `url(${bannerImg})` }}
      />
      <div className="absolute inset-0 bg-gradient-to-tr from-black via-transparent to-black z-[1]" />

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-20 flex flex-col items-center">
        
        {/* HEADER - Slides up smoothly */}
        <div className={`text-center mb-10 max-w-4xl transition-all duration-1000 transform ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <span className="text-green-400 font-bold tracking-[0.3em] uppercase text-sm mb-4 block animate-pulse">
            25+ Years of Excellence
          </span>
          <h2 className="text-5xl md:text-7xl font-extrabold text-white mb-6 tracking-tight">
            Global <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#1B365D]  to-cyan-700 text-glow"
      style={{ 
        WebkitTextStroke: "0.5px #FAF9F6",
        paintOrder: "stroke fill"
      }}>
  Expertise
</span>
          </h2>
          <p className="text-gray-300 text-lg md:text-2xl leading-relaxed font-light">
            Our trainers bring unmatched classroom experience across the UK, Middle East, and international systems, 
            blending global standards with cultural intelligence.
          </p>
        </div>

        {/* FEATURE GRID - Staggered entrance */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
          {highlights.map((item, index) => (
            <div 
              key={index}
              style={{ transitionDelay: `${index * 300}ms` }} // Staggers the cards
              className={`group p-6 rounded-3xl border border-white/10 bg-white/[0.03] backdrop-blur-2xl hover:bg-white/[0.07] hover:border-green-400/40 transition-all duration-700 flex flex-col items-center text-center transform ${isVisible ? 'opacity-100 translate-y-12' : 'opacity-0 translate-y-0'}`}
            >
              <div className="mb-6 p-4 inline-block rounded-2xl bg-white/5 border border-white/10 group-hover:bg-green-400/10 transition-colors duration-500">
                {item.icon}
              </div>
              <h3 className="text-2xl font-bold text-white mb-3 transition-transform duration-500 group-hover:scale-105">
                {item.title}
              </h3>
              <p className="text-gray-400 text-sm leading-relaxed transition-colors duration-500 group-hover:text-gray-200">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}