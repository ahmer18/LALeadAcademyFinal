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
  const [bgVisible, setBgVisible] = useState(false);
  const [contentVisible, setContentVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setBgVisible(entry.isIntersecting);
        if (entry.isIntersecting) {
          setContentVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      id="section2"
      ref={sectionRef}
      className="relative w-full min-h-screen snap-start overflow-hidden bg-[#050505] flex flex-col justify-center py-24"
    >
      {/* BACKGROUND: Zoom + Top-to-Bottom */}
      <div
        className="absolute inset-0 bg-cover bg-center z-0 transition-all ease-out"
        style={{ 
          backgroundImage: `url(${bannerImg})`,
          transitionDuration: '6000ms',
          opacity: bgVisible ? 0.2 : 0, // Darker as requested
          transform: bgVisible 
            ? 'scale(1.1) translateY(0)' 
            : 'scale(1.2) translateY(-20%)',
        }}
      />
      <div className="absolute inset-0 bg-black/50 z-[1]" />

      <div className="relative z-10 max-w-7xl mx-auto px-6 flex flex-col items-center">
        
        {/* HEADER: Increased spacing between elements */}
        <div className={`text-center mb-16 md:mb-10 max-w-4xl transition-all duration-1000 transform ${contentVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <span className="text-green-400 font-bold tracking-[0.3em] uppercase text-sm mb-8 block animate-pulse">
            25+ Years of Excellence
          </span>
          <h2 className="text-5xl md:text-7xl font-extrabold text-white mb-10 tracking-tight leading-tight">
            Global <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#1B365D] to-cyan-700 text-glow"
              style={{ 
                WebkitTextStroke: "0.5px #FAF9F6",
                paintOrder: "stroke fill"
              }}>
              Expertise
            </span>
          </h2>
          <p className="text-gray-300 text-lg md:text-2xl leading-loose md:leading-relaxed font-light">
            Our trainers bring unmatched classroom experience across the UK, Middle East, and international systems, 
            blending global standards with cultural intelligence.
          </p>
        </div>

        {/* FEATURE GRID: Increased Gap for mobile spacing */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-6 w-full mt-10">
          {highlights.map((item, index) => (
            <div 
              key={index}
              style={{ transitionDelay: `${index * 300}ms` }}
              className={`group p-10 md:p-6 rounded-3xl border border-white/10 bg-white/[0.03] backdrop-blur-2xl hover:bg-white/[0.07] hover:border-green-400/40 transition-all duration-700 flex flex-col items-center text-center transform ${contentVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
            >
              <div className="mb-8 p-4 inline-block rounded-2xl bg-white/5 border border-white/10 group-hover:bg-green-400/10 transition-colors duration-500">
                {item.icon}
              </div>
              <h3 className="text-2xl font-bold text-white mb-4 transition-transform duration-500 group-hover:scale-105">
                {item.title}
              </h3>
              <p className="text-gray-400 text-base leading-relaxed transition-colors duration-500 group-hover:text-gray-200">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}