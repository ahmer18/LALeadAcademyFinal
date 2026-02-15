import React, { useEffect, useRef } from "react";
import { Link } from "react-router";
import bannerImg from "../../assets/images/Hero.png";

export default function Banner() { 
  // Refs for scroll-triggered animation
  const sectionRef = useRef(null);
  const bgRef = useRef(null);

  useEffect(() => {
    const observerEl = sectionRef.current;
    const animationEl = bgRef.current;

    if (!observerEl || !animationEl) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // Re-trigger the CSS animation
            animationEl.classList.remove("animate-bg-slide-in");
            void animationEl.offsetWidth; // Force reflow
            animationEl.classList.add("animate-bg-slide-in");
          }
        });
      },
      { threshold: 0.5 }
    );

    observer.observe(observerEl);
    return () => observer.disconnect();
  }, []);

  return (
    <header
      id="banner"
      ref={sectionRef}
      className="relative w-full h-screen snap-start bg-black overflow-hidden"
    >
      {/* Background Layer - Animated */}
      <div
        ref={bgRef}
        className="absolute inset-0 bg-cover bg-center animate-bg-slide-in"
        style={{ 
          backgroundImage: `url(${bannerImg})`,
          backgroundRepeat: "no-repeat" 
        }}
      >
        {/* Gradient Overlay for text contrast */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent" />
      </div>

      {/* Content Layer */}
      <div className="relative z-30 flex flex-col items-center justify-center h-full text-center px-4 max-w-7xl mx-auto">
        <h1 className="text-6xl md:text-8xl font-extrabold text-[#FAF9F6] mb-4 custom-text-shadow tracking-tight">
          La LEAD Academy
        </h1>
        
        <h2 className="text-3xl md:text-4xl font-bold text-[#FAF9F6] mb-4 custom-text-shadow mt-5 opacity-90">
          Shine. Grow. Succeed!
        </h2>

        <p className="text-lg md:text-2xl max-w-3xl text-white drop-shadow-md custom-text-shadow mt-10 leading-relaxed">
          World-class English and Leadership programs built on <span className="font-bold border-b-2 border-amber-400">28 years</span> of
          expertise from Harvard, Cambridge, and The Aga Khan Academy.
        </p>

        <div className="mt-12">
          {/* DaisyUI Button with your custom hex styling */}
          <Link
            to="/courses"
            className="
              btn btn-lg border-none normal-case text-lg px-10 py-4
              bg-[#0b0d11] text-[#7BF1A8]
              hover:bg-gradient-to-r hover:from-[rgba(72,112,142,0.9)] hover:to-[rgba(20,35,62,0.9)]
              hover:text-white transition-all duration-500
              transform hover:scale-105 shadow-2xl
            "
          >
            Explore Our Signature Courses
          </Link>
        </div>
      </div>

      {/* Animation & Custom Styles */}
      <style>{`
        .custom-text-shadow {
          text-shadow: 2px 4px 12px rgba(0, 0, 0, 0.9);
        }

        @keyframes slideInFromBottom {
  0% {
    transform: translateY(80px);
    opacity: 0; /* Start from off-screen bottom */
    filter: brightness(0.2);
  }
  25% {
    opacity: 0.2;
    filter: brightness(0.4);
    
  }
  50% {
    opacity: 0.6;
    filter: brightness(0.6);
    
  }
  75% {
    opacity: 0.8;
    filter: brightness(0.8);
    
  }
  100% {
    transform: translateY(0);
    opacity: 1; /* End at normal position */
    filter: brightness(1);
  }
}

.animate-bg-slide-in {
  animation: slideInFromBottom 1s ease-out forwards;
  opacity: 0;
  transform: translateY(100%);
}
      `}</style>
    </header>
  );
}