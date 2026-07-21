import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import React from "react";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "../../styles/slick-fix.css";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import Slider from "react-slick";
import ContentNotFound from "../common/ContentNotFound";
import CourseCard from "../common/CourseCard";

// Custom Arrows for Dark Theme
const PrevArrow = ({ onClick }) => (
  <button
    onClick={onClick}
    className="absolute -left-6 top-1/2 transform -translate-y-1/2 z-20 bg-[#0A192F]/90 backdrop-blur-md shadow-2xl p-3 rounded-full hover:bg-cyan-500/20 hidden md:block border border-white/10 transition-all hover:scale-110 group/arrow"
  >
    <FaArrowLeft className="text-white group-hover/arrow:text-cyan-400 transition-colors" />
  </button>
);

const NextArrow = ({ onClick }) => (
  <button
    onClick={onClick}
    className="absolute -right-6 top-1/2 transform -translate-y-1/2 z-20 bg-[#0A192F]/90 backdrop-blur-md shadow-2xl p-3 rounded-full hover:bg-cyan-500/20 hidden md:block border border-white/10 transition-all hover:scale-110 group/arrow"
  >
    <FaArrowRight className="text-white group-hover/arrow:text-cyan-400 transition-colors" />
  </button>
);

export default function NewCourses() {
  const { data: courses = [], isLoading } = useQuery({
    queryKey: ["NewCourses"],
    queryFn: async () => {
      const response = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/courses/new`
      );
      return response.data?.courses || [];
    },
  });

  // Pad the courses array to ensure at least 3 cards are displayed
  const displayCourses = [];
  if (courses.length > 0) {
    displayCourses.push(...courses);
    while (displayCourses.length < 3) {
      displayCourses.push(...courses);
    }
  }

  const settings = {
    dots: true,
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

  if (isLoading) {
    return (
      <div className="py-20 text-center text-cyan-400">
        <span className="loading loading-dots loading-lg"></span>
      </div>
    );
  }

  if (courses.length === 0) {
    return <ContentNotFound title="No Recent Courses available" />;
  }

  return (
    <section className="relative min-h-screen bg-[#050505] overflow-hidden snap-start snap-always flex flex-col justify-center py-20">
      {/* ========================================================= */}
      {/*  FULL DARK HIGH-TECH BACKGROUND                          */}
      {/* ========================================================= */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Deep Dark Base Gradient */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(circle at 50% 30%, #0A192F 0%, #050505 80%)",
          }}
        />

        {/* Giant Watermark Typography */}
        <div className="absolute inset-0 flex items-center justify-center">
          <h1
            className="uppercase font-black tracking-[-0.08em] select-none text-transparent"
            style={{
              fontSize: "clamp(10rem, 24vw, 24rem)",
              WebkitTextStroke: "2px rgba(255, 255, 255, 0.025)",
              transform: "rotate(-6deg)",
            }}
          >
            COURSES
          </h1>
        </div>

        {/* Ambient Glows */}
        <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[900px] h-[500px] bg-cyan-500/10 rounded-full blur-[160px]" />
        <div className="absolute -left-40 bottom-10 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[140px]" />
        <div className="absolute -right-40 top-1/3 w-[500px] h-[500px] bg-cyan-400/5 rounded-full blur-[150px]" />

        {/* Tech Blueprint Grid */}
        <div
          className="absolute inset-0 opacity-[0.035]"
          style={{
            backgroundImage: `
              radial-gradient(rgba(255,255,255,0.8) 1px, transparent 1px),
              linear-gradient(rgba(255,255,255,0.4) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,255,255,0.4) 1px, transparent 1px)
            `,
            backgroundSize: "40px 40px, 120px 120px, 120px 120px",
            backgroundPosition: "center center",
          }}
        />
      </div>

      {/* ========================================================= */}
      {/*  CONTENT AREA                                             */}
      {/* ========================================================= */}
      <div className="max-w-7xl mx-auto px-4 md:px-12 relative z-10 w-full">
        {/* HEADER */}
        <div className="mb-14 text-center">
          <div className="inline-block relative">

            <h2 className="text-4xl md:text-6xl font-black tracking-tighter uppercase italic leading-none text-white drop-shadow-lg">
              Latest Courses
            </h2>
          </div>
        </div>

        {/* SLIDER CAROUSEL */}
        <Slider {...settings} className="pb-12">
          {displayCourses.map((course, index) => (
            <div key={index} className="px-4 outline-none h-full">
              <CourseCard course={course} />
            </div>
          ))}
        </Slider>
      </div>

      {/* Slick Dots Styling */}
      <style>{`
        .slick-dots li button:before {
            color: #ffffff !important;
            opacity: 0.3;
            font-size: 10px;
        }
        .slick-dots li.slick-active button:before {
            color: #22d3ee !important;
            opacity: 1;
        }
      `}</style>
    </section>
  );
}