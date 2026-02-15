// About.jsx
import heroImage from "../assets/images/banner.jpg";
import trainerImage from "../assets/images/teacher.jpeg";
import { Link } from "react-router";

export default function About() {
  return (
    <div className="space-y-20 max-w-7xl mx-auto px-6 pb-20">

      {/* 1. HERO SECTION */}
      <section className="relative text-center py-32 overflow-hidden rounded-3xl mt-10">
        {/* Premium Background Layer */}
        <div className="absolute inset-0 -z-10">
          {/* Base Light Background */}
          <div className="absolute inset-0 bg-[#f8fafc]" />

          {/* Soft Mesh Glows */}
          <div className="absolute -top-24 -left-24 w-96 h-96 bg-blue-100 rounded-full blur-[100px] opacity-60" />
          <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-indigo-100 rounded-full blur-[100px] opacity-60" />

          {/* Optional: Subtle Dot Grid Pattern */}
          <div className="absolute inset-0 opacity-[0.03]"
            style={{ backgroundImage: `radial-gradient(#4f46e5 0.5px, transparent 0.5px)`, strokeWidth: '1', backgroundSize: '24px 24px' }} />
        </div>

        <div className="relative z-10 px-4">
          <h1 className="text-4xl md:text-6xl font-extrabold mb-6 text-gray-900 leading-tight tracking-tight">
            Shaping <span className="text-blue-800">confident leaders</span> and <br className="hidden md:block" />
            effective educators for today’s schools.
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-10 leading-relaxed font-medium">
            Practical, research-informed training programmes for school leaders and teachers navigating modern learning challenges.
          </p>

          <div className="flex flex-wrap justify-center gap-4">
            <a
              href="#contact"
              className="px-8 py-4 bg-blue-800 text-white font-bold rounded-xl shadow-xl shadow-blue-200 hover:bg-blue-700 hover:-translate-y-1 transition-all duration-300"
            >
              Request Programme Details
            </a>
            <a
              href="#contact"
              className="px-8 py-4 border-2 border-gray-200 text-gray-700 bg-white font-bold rounded-xl hover:border-blue-600 hover:text-blue-600 transition-all duration-300 shadow-sm"
            >
              Book a Consultation
            </a>
          </div>
        </div>
      </section>

      {/* 2. TRAINER PROFILE */}
      <section id="trainer" className="md:flex md:items-center md:gap-16 py-8  border-gray-400">
        <div className="md:w-1/3 mb-8 md:mb-0">
          <img
            src={trainerImage}
            alt="Muhammad Ahmed"
            className="rounded-2xl shadow-2xl w-full object-cover aspect-[4/4]"
          />
        </div>
        <div className="md:w-2/3">
          <h2 className="text-3xl font-bold text-gray-900">Muhammad Ahmed</h2>
          <p className="text-lg text-blue-600 font-medium mb-4">
            Founder, La LEAD Academy — MA Education (UK)
          </p>
          <div className="space-y-4 text-gray-700 text-lg leading-relaxed">
            <p>
              An education consultant and leadership trainer with over 25 years of experience across the UK, Turkey, Saudi Arabia, and Pakistan.
            </p>
            <p>
              Educated in the UK and professionally trained through programmes at Harvard University, his work centres on leadership formation, reflective decision-making, and inquiry-driven teaching aligned with international standards and local school realities.
            </p>
          </div>
        </div>
      </section>

      {/* 3. ABOUT & PURPOSE (Premium Mesh Version) */}
      <section className="relative overflow-hidden py-24 rounded-[3rem] border border-gray-100 shadow-sm">
        {/* The Background Logic */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-white" />
          {/* Subtle Mesh Glows - repositioned for this section */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-blue-50 rounded-full blur-[100px] opacity-70" />
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-indigo-50 rounded-full blur-[100px] opacity-70" />

          {/* Optional: Very faint grid to keep it feeling "academic" */}
          <div className="absolute inset-0 opacity-[0.02]"
            style={{ backgroundImage: `radial-gradient(#4f46e5 0.5px, transparent 0.5px)`, backgroundSize: '30px 30px' }} />
        </div>

        <div className="max-w-6xl mx-auto px-8 grid md:grid-cols-2 gap-16 relative z-10">
          {/* About Column */}
          <div className="space-y-6">
            <div className="inline-block px-4 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-bold tracking-widest uppercase">
              Discovery
            </div>
            <h3 className="text-3xl font-black text-gray-900 uppercase tracking-tight">
              About La LEAD Academy
            </h3>
            <p className="text-gray-600 leading-relaxed text-lg border-l-4 border-blue-600 pl-6 py-2 bg-white/50 backdrop-blur-sm rounded-r-xl">
              La LEAD Academy (Leadership, Education, and Development) supports schools through
              leadership formation and effective teaching practices designed for today’s
              complex educational environments.
            </p>
          </div>

          {/* Purpose Column */}
          <div className="space-y-6">
            <div className="inline-block px-4 py-1 bg-indigo-50 text-indigo-700 rounded-full text-xs font-bold tracking-widest uppercase">
              Our Mission
            </div>
            <h3 className="text-3xl font-black text-gray-900 uppercase tracking-tight">
              Our Purpose
            </h3>
            <p className="text-gray-600 mb-6 text-lg font-medium">
              To support schools in developing strong leadership, effective teaching, and sustainable growth.
            </p>
            <ul className="space-y-4">
              {[
                "To form reflective and principled educational leaders",
                "To strengthen teaching through inquiry-driven and research-informed practice",
                "To support schools in building cultures of clarity and accountability"
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-4 group">
                  <div className="mt-1 flex-shrink-0 w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-[10px] shadow-lg shadow-blue-200 group-hover:scale-110 transition-transform">
                    ✓
                  </div>
                  <span className="text-gray-700 text-lg leading-snug">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* 4. FINAL CALL TO ACTION */}
      <section id="contact" className="relative overflow-hidden py-14 rounded-[3rem] text-white px-6 shadow-2xl mx-auto max-w-7xl mb-10">

        {/* Premium Background Logic */}
        <div className="absolute inset-0 -z-10">
          {/* Base Deep Navy (Academic/Professional) */}
          <div className="absolute inset-0 bg-[#0a192f]" />

          {/* Dynamic Glowing Mesh Layers */}
          <div
            className="absolute -top-[20%] -right-[10%] w-[70%] h-[80%] rounded-full opacity-30 blur-[120px]"
            style={{ background: 'radial-gradient(circle, #3b82f6 0%, transparent 70%)' }}
          />
          <div
            className="absolute -bottom-[20%] -left-[10%] w-[70%] h-[80%] rounded-full opacity-20 blur-[120px]"
            style={{ background: 'radial-gradient(circle, #6366f1 0%, transparent 70%)' }}
          />

          {/* Subtle Architectural Grid Overlay */}
          <div
            className="absolute inset-0 opacity-[0.05]"
            style={{
              backgroundImage: `linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)`,
              backgroundSize: '40px 40px'
            }}
          />
        </div>

        {/* Content Container */}
        <div className="relative z-10 text-center max-w-4xl mx-auto">
          <h3 className="text-3xl md:text-5xl font-black mb-6 leading-tight tracking-tight">
            Interested in bringing these <span className="text-blue-400">programmes</span> to your school?
          </h3>

          <p className="text-blue-100/80 mb-12 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
            Choose from leadership training, full-day teacher training, or short focused workshops designed for modern educational challenges.
          </p>

          <div className="flex flex-wrap justify-center gap-6">
            {/* 1. Programme Details */}
            <Link
              to="/courses"
              className="inline-block bg-white text-blue-900 px-10 py-4 rounded-full font-extrabold text-lg hover:bg-gray-100 hover:-translate-y-1 transition-all duration-300 shadow-xl shadow-blue-900/20 active:scale-95"
            >
              Programme Details
            </Link>

            {/* 2. WhatsApp Link - Schedule Consultation */}
            <a
              href="https://wa.me/905078648498"
              target="_blank"
              rel="noreferrer"
              className="inline-block bg-blue-500 text-white px-10 py-4 rounded-full font-extrabold text-lg hover:bg-blue-400 hover:-translate-y-1 transition-all duration-300 shadow-xl shadow-blue-900/20 active:scale-95"
            >
              Schedule a Consultation
            </a>

            {/* 3. WhatsApp Link - Contact Us */}
            <a
              href="https://wa.me/905078648498"
              target="_blank"
              rel="noreferrer"
              className="inline-block border-2 border-white/20 text-white px-10 py-4 rounded-full font-extrabold text-lg hover:bg-white/10 hover:border-white/50 transition-all duration-300 active:scale-95"
            >
              Contact Us
            </a>
          </div>

          {/* Footer Badge */}
          <p className="mt-12 text-blue-200/40 text-[10px] font-bold tracking-[0.3em] uppercase">
            International Standards • Research Informed • Practical Impact
          </p>
        </div>
      </section>

    </div>
  );
}
