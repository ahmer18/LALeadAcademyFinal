import img1 from "../../assets/images/1.jpg";
import img2 from "../../assets/images/2.png";
import img3 from "../../assets/images/3.jpg";
import { useEffect, useRef } from "react";
import bannerImg from "../../assets/images/section2bg.png";

const partners = [
  { name: "Asya Dilem", href: "http://asyadilem.com/", logoSrc: img1 },
  { name: "Master England And Training", href: "https://masterenglishtraining.com/", logoSrc: img2 },
  { name: "Cambridge Academy Istanbul", href: "http://www.cambridgeistanbul.com/", logoSrc: img3 },
];

export default function TrustedClients() {
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
            // Restart bottom-to-top fade animation
            animationEl.classList.remove("animate-bg-slide-up-fade");
            void animationEl.offsetWidth; // Force reflow
            animationEl.classList.add("animate-bg-slide-up-fade");
          }
        });
      },
      { threshold: 0.6 }
    );

    observer.observe(observerEl);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      id="section2"
      ref={sectionRef}
      className="relative w-full h-screen snap-start overflow-hidden bg-black"
    >
      {/* BACKGROUND */}
      {/* BACKGROUND */}
<div
  ref={bgRef}
  className="absolute inset-0 bg-black bg-cover bg-center z-0"
  style={{ backgroundImage: `url(${bannerImg})` }}
/>
<div className="absolute inset-0 bg-black/60 z-[1]" />


      {/* CONTENT */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full text-center px-6">
        <div className="p-10 rounded-xl max-w-4xl">
          <h1 className="text-6xl font-bold text-[#FAF9F6] mb-8">
            Our Global Footprint
          </h1>
          <h3 className="text-lg text-white">
            A globally recognized institution with decades of excellence in education and leadership development,
            trained 500+ Teachers across the globe.
          </h3>
        </div>

        <div className="py-4 text-center">
          <h4 className="text-sm sm:text-lg font-extrabold uppercase tracking-widest text-green-300 mb-6 animate-fadeInUp">
            Our Global Education Network
          </h4>

          <div className="flex justify-center items-center flex-wrap gap-6 sm:gap-10 md:gap-30 max-w-7xl mx-auto">
            {partners.map((partner) => (
              <a
                key={partner.name}
                href={partner.href}
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col items-center group w-20 sm:w-24 transition-transform duration-500 hover:scale-110 hover:shadow-2xl hover:z-20 transform hover:-translate-y-1"
              >
                <img
                  src={partner.logoSrc}
                  alt={`${partner.name} Logo`}
                  className="object-contain w-16 h-16 sm:w-20 sm:h-20 rounded-full p-2 bg-white ring-4 ring-blue-400/50 shadow-xl"
                />
                <p className="mt-2 text-xs font-semibold text-white/80 group-hover:text-white transition-colors duration-300">
                  {partner.name}
                </p>
              </a>
            ))}
          </div>

          <div className="flex justify-center mt-8">
            <div className="flex items-center gap-3 bg-green-300/50 border border-blue-400/40 px-5 py-2 rounded-full shadow-md backdrop-blur-sm">
              <span className="text-sm font-semibold text-white tracking-wide">
                &#9989; Licensed by the Turkish Ministry of Education
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
