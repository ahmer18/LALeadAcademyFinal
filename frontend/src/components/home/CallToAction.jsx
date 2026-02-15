// CallToAction.jsx
import { Link } from "react-router";
import bgImage from "../../assets/images/c2a.jpg";
import Footer from "../../components/common/Footer"; // Import your footer here

export default function CallToAction() {
  return (
    // This wrapper becomes the snapped element
    <div className="h-screen w-full flex flex-col snap-start snap-always">
      
      {/* The CTA Content Area */}
      <section
        className="relative flex-grow w-full flex items-center justify-center px-6 text-white text-center"
        style={{
          backgroundImage: `url(${bgImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-black/100 via-black/80 to-black/60"></div>

        <div className="relative z-10 max-w-4xl mx-auto flex flex-col items-center">
          <h2 className="text-4xl md:text-5xl font-extrabold leading-tight mb-4 drop-shadow-md">
            Ready to Transform Your Learning?
          </h2>
          <p className="mb-8 text-lg md:text-xl text-gray-200">
            Join thousands leveling up their careers with LA Lead Academy.
          </p>
          <Link
            to="/courses"
            className="inline-block bg-white text-blue-800 font-semibold px-8 py-3 rounded-lg shadow-lg hover:bg-gray-200 transition"
          >
            Browse Courses
          </Link>
        </div>
      </section>

      {/* The Footer - Sits at the bottom of the same snapped screen */}
      <Footer />
    </div>
  );
}