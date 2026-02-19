import React, { useEffect, useRef, useState } from "react";
import bannerImg from "../../assets/images/Hero.png";

export default function Banner() {
  const sectionRef = useRef(null);
  const [bgVisible, setBgVisible] = useState(false);
  const [contentVisible, setContentVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        // This MUST toggle to true/false for re-triggering
        setBgVisible(entry.isIntersecting);

        if (entry.isIntersecting) {
          setContentVisible(true);
        }
      },
      { 
        threshold: 0.05, // Trigger as soon as 5% is visible
        rootMargin: "0px" 
      }
    );

    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <header
      ref={sectionRef}
      className="relative w-full h-screen snap-start bg-[#020617] overflow-hidden flex items-center justify-center"
    >
      {/* BACKGROUND: Zoom + Slide Up */}
      <div
        className={`absolute inset-0 bg-cover bg-center z-0 transition-all ease-out`}
        style={{ 
          backgroundImage: `url(${bannerImg})`,
          // Using inline style for duration to bypass Tailwind v4 JIT issues
          transitionDuration: '3000ms',
          opacity: bgVisible ? 1 : 0,
          transform: bgVisible 
            ? 'scale(1.1) translateY(0)' 
            : 'scale(1) translateY(20%)', // Moves from 20% down to 0
        }}
      >
        <div className="absolute inset-0 bg-black/50 z-10" />
      </div>

      {/* CONTENT: Bottom-to-Top (Stays visible) */}
      <div 
        className={`relative z-30 flex flex-col items-center text-center px-6 max-w-7xl mx-auto transition-all duration-1000 ease-out ${
          contentVisible 
            ? "scale-90 translate-y-0 opacity-100" 
            : "scale-75 translate-y-10 opacity-0"
        }`}
      >
        <h1 className="brand-text text-7xl md:text-9xl mb-10 leading-none">
          <span className="brand-la">LA</span>
          <span className="brand-lead">LEAD Academy</span>
        </h1>
        
        <h2 className={`brand-slogan text-2xl md:text-3xl mb-20 transition-all duration-1000 delay-300 ${
          contentVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
        }`}>
          Grow. Shine. Succeed!
        </h2>

        <p className={`text-2xl md:text-4xl max-w-4xl text-gray-300 leading-relaxed font-light transition-all duration-1000 delay-500 ${
          contentVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
        }`}>
          Shaping <span className="text-white font-medium">confident leaders</span> and  
          <span className="text-white font-medium"> effective educators</span> for today’s global school systems.
        </p>
      </div>
    </header>
  );
}