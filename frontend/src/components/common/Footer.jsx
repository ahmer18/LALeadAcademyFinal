import { FaFacebookF, FaInstagram, FaLinkedin, FaTiktok, FaWhatsapp } from "react-icons/fa";
import { useSystemTheme } from "../../hooks/useSystemTheme";

export default function Footer() {
  const isLight = useSystemTheme();

  const topCourses = [
    { name: "Leading from Within", id: "698f22e6257f6c85b07b084e" },
    { name: "Reimagining Effective Teaching", id: "698f236a257f6c85b07b084f" },
    { name: "Student Focus in the Digital Age", id: "698f23e5257f6c85b07b0850" },
  ];

  const linkClass = `transition-all duration-300 relative after:content-[''] after:absolute after:w-0 after:h-[1px] after:bottom-0 after:left-0 after:bg-blue-500 hover:after:w-full after:transition-all ${
    isLight ? "hover:text-gray-900" : "hover:text-white"
  }`;

  return (
    <footer
      // Reduced py-12/py-4 to py-6
      className={`py-6 px-6 transition-colors duration-500 border-t ${
        isLight ? "bg-white text-gray-900 border-gray-100" : "bg-gray-950 text-white border-gray-800"
      }`}
    >
      {/* Reduced gap-12 to gap-8 and mt-5 to mt-2 */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 mt-2 md:grid-cols-4 gap-8">
        {/* About */}
        <div className="space-y-2">
          <h2 className="text-lg font-black uppercase tracking-tighter italic">
            LA <span className="text-blue-800">LEAD Academy</span>
          </h2>
          <p className={`text-xs leading-relaxed ${isLight ? "text-gray-500" : "text-gray-400"}`}>
            Shaping confident leaders and effective educators for today’s schools through research-informed training.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h2 className="text-xs font-bold uppercase tracking-widest mb-3 text-blue-800">Navigation</h2>
          <ul className={`space-y-1.5 text-xs font-medium ${isLight ? "text-gray-600" : "text-gray-400"}`}>
            <li><a href="/about" className={linkClass}>Our Story</a></li>
            <li><a href="/courses" className={linkClass}>All Courses</a></li>
            <li><a href="/#" className={linkClass}>Help & FAQ</a></li>
            <li><a href="/about" className={linkClass}>Contact Us</a></li>
          </ul>
        </div>

        {/* Top Courses */}
        <div>
          <h2 className="text-xs font-bold uppercase tracking-widest mb-3 text-blue-800">Popular Courses</h2>
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
          <h2 className="text-xs font-bold uppercase tracking-widest mb-3 text-blue-800">Connect</h2>
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
              hoverClass="hover:bg-green-500"
              isLight={isLight}
            />
            <SocialIcon 
              href="https://www.linkedin.com/company/la-lead-academy/8" 
              icon={<FaLinkedin />} 
              hoverClass="hover:bg-green-500"
              isLight={isLight}
            />
          </div>
        </div>
      </div>

      {/* Reduced mt-16 to mt-8 and pt-8 to pt-4 */}
      <div className={`mt-4 border-t pt-4 text-center text-[10px] tracking-widest font-bold uppercase ${
          isLight ? "border-gray-100 text-gray-400" : "border-gray-800 text-gray-600"
        }`}
      >
        &copy; {new Date().getFullYear()} La LEAD Academy. Crafted for Excellence.
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
      // Shrink icon box from w-10 h-10 to w-8 h-8
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