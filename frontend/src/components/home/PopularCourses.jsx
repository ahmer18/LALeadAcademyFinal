import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";
import "../../styles/slick-fix.css";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import Slider from "react-slick";
import ContentNotFound from "../common/ContentNotFound";
import CourseCard from "../common/CourseCard";

// Custom Arrows (Keep as is, they look great!)
const PrevArrow = ({ onClick }) => (
  <button
    onClick={onClick}
    className="absolute -left-6 top-1/2 transform -translate-y-1/2 z-10 bg-white shadow p-2 rounded-full hover:bg-gray-100 hidden md:block"
  >
    <FaArrowLeft className="text-gray-700" />
  </button>
);

const NextArrow = ({ onClick }) => (
  <button
    onClick={onClick}
    className="absolute -right-6 top-1/2 transform -translate-y-1/2 z-10 bg-white shadow p-2 rounded-full hover:bg-gray-100 hidden md:block"
  >
    <FaArrowRight className="text-gray-700" />
  </button>
);

export default function PopularCourses() {
  const { data: courses = [], isLoading } = useQuery({
    queryKey: ["courses"],
    queryFn: async () => {
      const response = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/courses/popular`
      );
      return response.data.courses;
    },
  });

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
      { breakpoint: 640, settings: { slidesToShow: 1 } },
    ],
  };

  if (isLoading) return <div className="text-center py-20 text-white">Loading...</div>;
  if (courses.length === 0) return <ContentNotFound title="No Popular Courses available" />;

  return (
    <section 
      className="relative pt-16 pb-16 md:pt-32 md:pb-32 overflow-hidden snap-start snap-always"
      // USING YOUR EXACT BG FROM WHY CHOOSE
      style={{
        background: 'radial-gradient(circle at center, #1f2937 0%, #111827 50%, #000000 100%)'
      }}
    >
      {/* Premium Gradient Effect Overlays (Matching WhyChoose) */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-900/20 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-gray-700/20 rounded-full blur-[120px]" />
      </div>

      <div className="max-w-7xl mx-auto px-12 relative z-10">
        <h2 className="text-4xl font-bold text-[#FAF9F6] mb-12 text-center tracking-tight">
          Most <span className="text-blue-500">Popular Courses</span>
        </h2>

        <Slider {...settings}>
          {courses.map((course, index) => (
            <div key={index} className="px-2 outline-none flex-shrink-0 w-80 h-96">
              <CourseCard course={course} />
            </div>
          ))}
        </Slider>
      </div>
    </section>
  );
}