import { FaFacebookF, FaInstagram, FaLinkedin, FaTiktok, FaWhatsapp, FaYoutube } from "react-icons/fa";
import { useSystemTheme } from "../../hooks/useSystemTheme";

export default function Footer() {
  const isLight = useSystemTheme();

  const topCourses = [
    { name: "Leading from Within", id: "698f22e6257f6c85b07b084e" },
    { name: "Reimagining Effective Teaching", id: "698f236a257f6c85b07b084f" },
    { name: "Student Focus in the Digital Age", id: "698f23e5257f6c85b07b0850" },
  ];

  // Updated underline color to brand brown (#8d6e3e)
  // Permanently use bright-theme styles
  const linkClass = `transition-all duration-300 relative after:content-[''] after:absolute after:w-0 after:h-[1px] after:bottom-0 after:left-0 after:bg-[#8d6e3e] hover:after:w-full after:transition-all hover:text-slate-900`;

  return (
    <footer
      className="py-12 px-6 bg-[#FAF9F6] text-slate-900 border-t border-slate-200"
    >
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">

        {/* About: Professional Brand Presence */}
        <div className="space-y-4">
          <h2 className="brand-text text-xl sm:text-2xl leading-none text-blue-900">
            LALEAD Academy
          </h2>
          <p className="text-sm leading-relaxed font-medium text-slate-500">
            Shaping confident leaders and effective educators through international, research-informed professional training.
          </p>
        </div>

        {/* Navigation: Architectural Headings */}
        <div>
          <h2 className="text-[12px] font-black uppercase tracking-[0.2em] mb-4 text-blue-900 opacity-80">
            Navigation
          </h2>
          <ul className="space-y-3 text-sm font-semibold text-slate-600">
            <li><a href="/about" className={linkClass}>About us</a></li>
            <li><a href="/programmes" className={linkClass}>Programmes</a></li>
            <li><a href="/courses" className={linkClass}>Courses</a></li>
            <li><a href="/about" className={linkClass}>Contact us</a></li>
          </ul>
        </div>

        {/* Top Courses */}
        <div>
          <h2 className="text-[12px] font-black uppercase tracking-[0.2em] mb-4 text-blue-900 opacity-80">
            Signature Programmes
          </h2>
          <ul className="space-y-3 text-sm font-semibold text-slate-600">
            {topCourses.map((course) => (
              <li key={course.id}>
                <a href={`/courses/${course.id}`} className={linkClass}>
                  {course.name}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Social Media */}
        <div>
          <h2 className="text-[12px] font-black uppercase tracking-[0.2em] mb-4 text-blue-900 opacity-80">
            Connect
          </h2>
          <div className="flex flex-wrap gap-3">
            <SocialIcon
              href="https://www.facebook.com/share/17FoaG5Xd6/?mibextid=wwXIfr"
              icon={<FaFacebookF />}
              hoverClass="hover:bg-blue-600"
            />
            <SocialIcon
              href="https://www.instagram.com/laleadacademy?igsh=eTdwNXBxOXJlZm9n&utm_source=qr"
              icon={<FaInstagram />}
              hoverClass="hover:bg-gradient-to-tr from-yellow-500 via-red-500 to-purple-500"
            />
            <SocialIcon
              href="https://wa.me/905346053958"
              icon={<FaWhatsapp />}
              hoverClass="hover:bg-green-500"
            />
            <SocialIcon
              href="https://www.tiktok.com/@laleadacademytiktok?_r=1&_t=ZS-93vYoAGGC8q"
              icon={<FaTiktok />}
              hoverClass="hover:bg-black"
            />
            <SocialIcon
              href="https://www.linkedin.com/company/la-lead-academy/8"
              icon={<FaLinkedin />}
              hoverClass="hover:bg-blue-700"
            />
            <SocialIcon
              href="https://www.youtube.com/@LALEADacademyYT"
              icon={<FaYoutube />}
              hoverClass="hover:bg-red-600"
            />
          </div>
        </div>
      </div>

      <div className="mt-12 border-t pt-8 text-center text-[10px] tracking-[0.2em] font-black uppercase border-slate-200 text-slate-400">
        &copy; {new Date().getFullYear()}
        <span> LA</span>
        <span>LEAD Academy.</span>
        <span className="ml-1">All Rights Reserved.</span>
        {" — "}
        <a
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-blue-900 text-slate-600 transition-colors duration-200 cursor-pointer"
        >
          Crafted by VCodePK
        </a>
      </div>
    </footer>
  );
}

function SocialIcon({ href, icon, hoverClass }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={`w-8 h-8 flex items-center justify-center rounded-full transition-all duration-300 border border-slate-200 text-slate-600 hover:border-transparent hover:text-white shadow-sm ${hoverClass}`}
    >
      <span className="text-xs">{icon}</span>
    </a>
  );
}

