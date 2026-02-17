import { Link } from "react-router";
import { Mail, MessageCircle, FileText, Calendar, ArrowRight } from "lucide-react";
import bgImage from "../../assets/images/c2a.jpg";
import Footer from "../../components/common/Footer";

export default function CallToAction() {
  return (
    <div className="h-screen w-full flex flex-col snap-start snap-always overflow-hidden">
      
      {/* The CTA Content Area */}
      <section
        className="relative flex-grow w-full flex items-center justify-center px-6 text-white text-center"
        style={{
          backgroundImage: `url(${bgImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        {/* Darkened overlay to make text pop */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#020617] via-[#020617]/90 to-[#020617]/80"></div>

        <div className="relative z-10 max-w-5xl mx-auto flex flex-col items-center">
          
          {/* HEADING */}
          <h2 className="text-4xl md:text-7xl font-black tracking-tighter uppercase italic leading-[0.9] mt-12 mb-6">
            <span className="text-white opacity-60 block">Ready to strengthen your</span>
            <span 
  className="text-transparent bg-clip-text bg-gradient-to-r from-white via-cyan-400 to-white"
  style={{ 
    // We use a sharp text-shadow instead of -webkit-text-stroke to avoid fill gaps
    textShadow: `
      -1px -1px 0 #FAF9F6,  
       1px -1px 0 #FAF9F6,
      -1px  1px 0 #FAF9F6,
       1px  1px 0 #FAF9F6
    `,
    filter: "drop-shadow(0 0 15px rgba(34, 211, 238, 0.4))"
  }}
>
  School’s Leadership ?
</span>
          </h2>

          <p className="mb-12 text-lg md:text-xl text-gray-400 max-w-2xl font-medium">
            Partner with LALEAD Academy to implement evidence-based coaching and 
            rigorous international standards in your institution.
          </p>

          {/* PRIMARY BUTTONS */}
          <div className="flex flex-col md:flex-row gap-6 mb-16 w-full md:w-auto">
            <Link
              to="/request-proposal" // Link to your Google Form or Internal Page
              className="flex items-center justify-center gap-3 bg-cyan-600 hover:bg-cyan-500 text-white font-black px-10 py-5 rounded-2xl shadow-[0_20px_40px_rgba(8,145,178,0.3)] transition-all hover:-translate-y-1 tracking-widest uppercase text-sm"
            >
              <FileText size={20} /> Request a School Proposal
            </Link>

            <Link
              to="/schedule-call" // Link to Calendly or similar
              className="flex items-center justify-center gap-3 bg-white/10 hover:bg-white/20 backdrop-blur-md text-white border border-white/20 font-black px-10 py-5 rounded-2xl transition-all hover:-translate-y-1 tracking-widest uppercase text-sm"
            >
              <Calendar size={20} /> Schedule a Strategy Call
            </Link>
          </div>

          {/* QUICK CONNECT ROW */}
          <div className="flex items-center gap-8 pt-8 border-t border-white/10 w-full justify-center">
            <a href="mailto:info@lalead.academy" className="flex items-center gap-2 text-gray-400 hover:text-cyan-400 transition-colors text-xs font-bold uppercase tracking-widest">
              <Mail size={18} /> Email
            </a>
            <a href="https://wa.me/yournumber" className="flex items-center gap-2 text-gray-400 hover:text-green-400 transition-colors text-xs font-bold uppercase tracking-widest">
              <MessageCircle size={18} /> WhatsApp
            </a>
            <a href="#" className="flex items-center gap-2 text-gray-400 hover:text-cyan-400 transition-colors text-xs font-bold uppercase tracking-widest">
              <ArrowRight size={18} /> Google Form
            </a>
          </div>
        </div>
      </section>

      {/* The Footer */}
      <Footer />

      <style>{`
        .text-glow {
          filter: drop-shadow(0 0 15px rgba(34, 211, 238, 0.4));
        }
      `}</style>
    </div>
  );
}