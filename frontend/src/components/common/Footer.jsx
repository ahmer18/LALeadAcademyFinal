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
  const linkClass = `transition-all duration-300 relative after:content-[''] after:absolute after:w-0 after:h-[1px] after:bottom-0 after:left-0 after:bg-[#8d6e3e] hover:after:w-full after:transition-all ${
    isLight ? "hover:text-gray-900" : "hover:text-white"
  }`;

  return (
    <footer
      className={`py-6 px-6 transition-colors duration-500 border-t ${
        isLight ? "bg-white text-gray-900 border-gray-100" : "bg-gray-950 text-white border-gray-800"
      }`}
    >
      <div className="max-w-7xl mx-auto grid grid-cols-1 mt-2 md:grid-cols-4 gap-8">
        
        {/* About: Updated with Global Brand Classes */}
        <div className="space-y-2">
          <h2 className="brand-text text-lg leading-none">
            <span className="brand-la">LA</span>
            <span className={isLight ? "text-blue-900" : "brand-lead"}>LEAD Academy</span>
          </h2>
          <p className={`text-xs leading-relaxed ${isLight ? "text-gray-500" : "text-gray-400"}`}>
            Shaping confident leaders and effective educators for today’s schools through research-informed training.
          </p>
        </div>

        {/* Quick Links: Updated heading to Brand Brown */}
        <div>
          <h2 className="text-xs font-bold uppercase tracking-widest mb-3 text-blue-900">Navigation</h2>
          <ul className={`space-y-1.5 text-xs font-medium ${isLight ? "text-gray-600" : "text-gray-400"}`}>
            <li><a href="/about" className={linkClass}>About us</a></li>
            <li><a href="/courses" className={linkClass}>All Programmes</a></li>
            <li><a href="/#" className={linkClass}>Help & FAQ</a></li>
            <li><a href="/about" className={linkClass}>Contact Us</a></li>
          </ul>
        </div>

        {/* Top Courses: Updated heading to Brand Brown */}
        <div>
          <h2 className="text-xs font-bold uppercase tracking-widest mb-3 text-blue-900">Popular Programmes</h2>
          <ul className={`space-y-1.5 text-xs font-medium ${isLight ? "text-gray-600" : "text-gray-400"}`}>
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
          <h2 className="text-xs font-bold uppercase tracking-widest mb-3 text-blue-900">Connect</h2>
          <div className="flex space-x-2">
            <SocialIcon 
              href="https://www.facebook.com/share/17FoaG5Xd6/?mibextid=wwXIfr" 
              icon={<FaFacebookF />} 
              hoverClass="hover:bg-blue-600"
              isLight={isLight}
            />
            <SocialIcon 
              href="https://www.instagram.com/laleadacademy?igsh=eTdwNXBxOXJlZm9n&utm_source=qr" 
              icon={<FaInstagram />} 
              hoverClass="hover:bg-gradient-to-tr from-yellow-500 via-red-500 to-purple-500"
              isLight={isLight}
            />
            <SocialIcon 
              href="https://wa.me/905078648498" 
              icon={<FaWhatsapp />} 
              hoverClass="hover:bg-green-500"
              isLight={isLight}
            />
            <SocialIcon 
              href="https://www.tiktok.com/@laleadacademytiktok?_r=1&_t=ZS-93vYoAGGC8q" 
              icon={<FaTiktok />} 
              hoverClass="hover:bg-black"
              isLight={isLight}
            />
            <SocialIcon 
              href="https://www.linkedin.com/company/la-lead-academy/8" 
              icon={<FaLinkedin />} 
              hoverClass="hover:bg-blue-700"
              isLight={isLight}
            />
            <SocialIcon 
              href="https://www.youtube.com/@LALEADacademyYT" 
              icon={<FaYoutube />} 
              hoverClass="hover:bg-blue-700"
              isLight={isLight}
            />
          </div>
        </div>
      </div>

      <div className={`mt-4 border-t pt-4 text-center text-[10px] tracking-widest font-bold  ${
          isLight ? "border-gray-100 text-gray-400" : "border-gray-800 text-gray-600"
        }`}
      >
        &copy; {new Date().getFullYear()} <span className="brand-la">LA</span><span className="text-blue-900">LEAD Academy.</span> CRAFTED FOR EXCELLENCE.
      </div>
    </footer>
  );
}

function SocialIcon({ href, icon, hoverClass, isLight }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={`w-8 h-8 flex items-center justify-center rounded-full transition-all duration-300 border ${
        isLight 
          ? "border-gray-200 text-gray-600 hover:border-transparent hover:text-white shadow-sm" 
          : "border-gray-800 text-gray-400 hover:border-transparent hover:text-white"
      } ${hoverClass}`}
    >
      <span className="text-xs">{icon}</span>
    </a>
  );
}