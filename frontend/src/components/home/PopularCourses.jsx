import React from "react";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "../../styles/slick-fix.css";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import Slider from "react-slick";
import { useNavigate } from "react-router";
import courseimage1 from "../../assets/images/1.jpeg";
import courseimage2 from "../../assets/images/2.jpeg";
import courseimage3 from "../../assets/images/3.jpeg";

// Custom Arrows
const PrevArrow = ({ onClick }) => (
  <button
    onClick={onClick}
    className="absolute -left-6 top-1/2 transform -translate-y-1/2 z-20 bg-white shadow-xl p-2.5 rounded-full hover:bg-gray-50 hidden md:block border border-gray-100 transition-all"
  >
    <FaArrowLeft className="text-[#1B365D]" />
  </button>
);

const NextArrow = ({ onClick }) => (
  <button
    onClick={onClick}
    className="absolute -right-6 top-1/2 transform -translate-y-1/2 z-20 bg-white shadow-xl p-2.5 rounded-full hover:bg-gray-50 hidden md:block border border-gray-100 transition-all"
  >
    <FaArrowRight className="text-[#1B365D]" />
  </button>
);

export default function PopularCourses() {
  const navigate = useNavigate();

  const staticCourses = [
    {
      _id: "698f22e6257f6c85b07b084e",
      title: "Leading from Within",
      subtitle: "Strengthening your inner leadership for lasting impact.",
      duration: "5 hrs",
      image: courseimage3
    },
    {
      _id: "698f236a257f6c85b07b084f",
      title: "Reimagining Effective Teaching Through Inquiry",
      subtitle: "Elevating practice through purposeful inquiry.",
      duration: "7 hrs",
      image: courseimage2
    },
    {
      _id: "698f23e5257f6c85b07b0850",
      title: "Student Focus in the Digital Age",
      subtitle: "Restoring human depth in a digital world.",
      duration: "3 hrs",
      image: courseimage1
    }
  ];

  const settings = {
    dots: false,
    infinite: true,
    speed: 800,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 4000,
    arrows: true,
    prevArrow: <PrevArrow />,
    nextArrow: <NextArrow />,
    responsive: [
      { breakpoint: 1024, settings: { slidesToShow: 2 } },
      { breakpoint: 768, settings: { slidesToShow: 1 } },
    ],
  };

  return (
    <section
      className="relative min-h-screen overflow-hidden snap-start snap-always flex flex-col justify-center py-20"
      style={{ background: 'linear-gradient(to bottom, #050505 0%, #0a192f 40%, #FAF9F6 100%)' }}
    >
      {/* --- CLEAN ELITE BACKGROUND --- */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        {/* Soft Ambient Glows */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[120px] -mr-32 -mt-32" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-cyan-600/5 rounded-full blur-[100px] -ml-20 -mb-20" />
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-12 relative z-10 w-full">

        {/* HEADER - Single Line & Clean */}
        <div className="mb-12 text-center">
          <h2 className="text-3xl md:text-6xl font-black tracking-tighter uppercase italic leading-none whitespace-normal md:whitespace-nowrap">
            <span
              className="text-white block md:inline-block mb-2 md:mb-0 md:mr-4"
              style={{ WebkitTextStroke: "1px rgba(255,255,255,0.1)", paintOrder: "stroke fill" }}
            >
              Our Signature
            </span>
            <span className="text-transparent tracking-wide bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-400 to-cyan-500 md:from-[#1B365D] md:to-cyan-700 text-glow block md:inline-block"
              style={{
                WebkitTextStroke: "0.5px #FAF9F6",
                paintOrder: "stroke fill"
              }}>
              Programmes
            </span>
          </h2>
        </div>

        <Slider {...settings} className="pb-12">
          {staticCourses.map((course, index) => (
            <div key={index} className="px-4 outline-none">
              <div
                onClick={() => navigate(`/Programmes/${course._id}`)}
                className="bg-white rounded-[24px] overflow-hidden border border-gray-100 transition-all duration-700 hover:-translate-y-4 shadow-[0_20px_50px_rgba(0,0,0,0.06)] hover:shadow-[0_60px_120px_rgba(27,54,93,0.2)] flex flex-col cursor-pointer h-[440px] group relative"
              >
                {/* IMAGE AREA - FIXED HEIGHT */}
                <div className="relative w-full h-[230px] overflow-hidden shrink-0">
                  <img
                    src={course.image}
                    alt={course.title}
                    className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                  />
                  <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md text-[#1B365D] px-3 py-1 rounded-full text-[10px] font-black shadow-sm">
                    {course.duration}
                  </div>
                </div>

                {/* CONTENT AREA - DISCIPLINED LEFT ALIGNMENT */}
                <div className="p-6 flex-grow flex flex-col text-left">

                  {/* Title Block - Reserved height for 2 lines */}
                  <div className="min-h-[56px] mb-2">
                    <h3 className="text-xl font-black text-[#1B365D] leading-tight line-clamp-2 uppercase tracking-tight group-hover:text-cyan-600 transition-colors">
                      {course.title}
                    </h3>
                  </div>

                  {/* Subtitle Block - Reserved height for 2 lines */}
                  <div className="min-h-[40px] mb-4">
                    <p className="text-gray-500 text-sm leading-relaxed font-medium line-clamp-2">
                      {course.subtitle}
                    </p>
                  </div>

                  {/* Button Block - Anchored to bottom */}
                  <div className="mt-auto pt-4 border-t border-gray-50 flex items-center justify-between group/btn">
                    <span className="text-[10px] font-black tracking-widest text-[#1B365D]/40 uppercase">View Programmes Details</span>
                    <div className="bg-[#1B365D] text-white p-3 rounded-xl transition-all group-hover:bg-cyan-600 group-hover:translate-x-1 shadow-md">
                      <FaArrowRight size={12} />
                    </div>
                  </div>

                </div>
              </div>
            </div>
          ))}
        </Slider>
      </div>

      <style>{`
        .text-glow {
          filter: drop-shadow(0 0 15px rgba(56, 189, 248, 0.4));
        }
        .slick-dots li button:before {
            color: #1B365D !important;
            font-size: 10px;
        }
        .slick-dots li.slick-active button:before {
            color: #22d3ee !important;
        }
      `}</style>
    </section>
  );
}