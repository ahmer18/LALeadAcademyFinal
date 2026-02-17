import React, { useEffect, useRef, useState } from "react";
import bannerImg from "../../assets/images/Hero.png";

export default function Banner() {
  const sectionRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        // This is the key: it sets visibility to true when entering, 
        // and false when leaving, so animations can restart.
        setIsVisible(entry.isIntersecting);
      },
      { 
        threshold: 0.2, // Trigger slightly earlier for a smoother feel
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
      {/* BACKGROUND: Cinematic Slow Zoom */}
      <div
        className={`absolute inset-0 bg-cover bg-center transition-transform duration-[6000ms] ease-out z-0 ${
          isVisible ? "scale-110 opacity-100" : "scale-100 opacity-0"
        }`}
        style={{ 
            backgroundImage: `url(${bannerImg})`,
            transitionProperty: "transform, opacity" 
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-[#020617] z-10" />
        <div className="absolute inset-0 bg-black/40 z-10" />
      </div>

      {/* CONTENT: Staggered Reveal */}
      <div className="relative z-30 flex flex-col items-center text-center px-6 max-w-7xl mx-auto">
        
        {/* SMALL TOP LABEL */}
        <p className={`text-blue-400 font-bold tracking-[0.4em] uppercase text-xs mt-5 mb-10 transition-all duration-700 delay-100 ${
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
        }`}>
          Elite Educator Training
        </p>

        <h1 className={`text-6xl md:text-9xl font-black text-[#FAF9F6] mb-8 tracking-tighter transition-all duration-1000 delay-300 ${
  isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
}`}>
  LALEAD <span className="academy-animated-text">Academy</span>
</h1>
        
        <h2 className={`text-3xl md:text-3xl font-bold text-white/90 mb-12 transition-all duration-1000 delay-500 ${
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
        }`}>
          Grow. Shine. Succeed!
        </h2>

        <p className={`text-lg md:text-4xl mt-5 max-w-5xl text-gray-300 leading-relaxed font-light transition-all duration-1000 delay-700 ${
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
        }`}>
          Shaping <span className="text-white font-medium">confident leaders</span> and  
          <span className="text-white font-medium"> effective educators</span> for today’s global school systems.
        </p>
      </div>

     <style>{`
  .academy-animated-text {
    /* 1. The Gradient Fill */
    background: linear-gradient(
      to right, 
      #FAF9F6 20%, 
      #22d3ee 40%, 
      #3b82f6 60%, 
      #FAF9F6 80%
    );
    background-size: 200% auto;
    -webkit-background-clip: text;
    text-transparent: border-box;
    color: transparent;
    -webkit-text-stroke: 1.5px #FAF9F6;
    
    /* 2. The Animated Flow */
    animation: shine-flow 5s linear infinite;

    /* 3. The Shadow-Stroke Fix (Ensures perfect fill) */
    text-shadow: 
      -1px -1px 0 #1B365D,  
       1px -1px 0 #1B365D,
      -1px  1px 0 #1B365D,
       1px  1px 0 #1B365D;
    
    filter: drop-shadow(0 0 20px rgba(34, 211, 238, 0.3));
    display: inline-block;
  }

  @keyframes shine-flow {
    to {
      background-position: 200% center;
    }
  }

  /* Keeping your existing shine for the overall glow */
  @keyframes shine {
    0%, 100% { filter: drop-shadow(0 0 15px rgba(255, 255, 255, 0.4)); }
    50% { filter: drop-shadow(0 0 25px rgba(59, 130, 246, 0.6)); }
  }
`}</style>
    </header>
  );
}