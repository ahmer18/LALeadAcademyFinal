import { useState, useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import { MdArrowRight } from "react-icons/md";
import { TiThMenu } from "react-icons/ti";
import { Link, NavLink, useLocation } from "react-router";
import useAuth from "../../hooks/useAuth";
import logoImg from "../../assets/images/logoagain.png";
import { useFeedback } from "../../providers/FeedbackProvider";



const AppLogo = ({ isLight }) => (
  <div className="flex items-center space-x-2 sm:space-x-4 transition-all duration-500 ease-in-out">
    <img
      src={logoImg}
      alt="LALEAD Academy Logo"
      className="h-10 w-auto sm:h-16 object-contain"
    />
    <div className="flex flex-col leading-tight">
      <div className={`text-sm sm:text-xl brand-text custom-text-shadow2 whitespace-nowrap ${isLight ? "text-white" : "text-blue-900"}`}>
        <span style={{ WebkitTextStroke: isLight ? "0.1px white" : "0.1px #1B365D", paintOrder: "stroke fill" }}>LALEAD</span>
        <span className="ml-1">Academy</span>
      </div>
      <span className={`text-[9px] sm:text-sm italic font-logo-headline custom-text-shadow2 whitespace-nowrap ${isLight ? "text-blue-50" : "text-blue-950"}`}>
        Grow, Shine, Succeed!
      </span>
    </div>
  </div>
);

export default function Navbar() {
  const { user, isUserLoading, userLogout } = useAuth();
  const location = useLocation();
  const { showFeedback } = useFeedback();
  const [isNavbarDark, setIsNavbarDark] = useState(true);
  const [showHeader, setShowHeader] = useState(true);

  const handleComingSoon = (e) => {
    e.preventDefault();
    showFeedback("Login is coming soon! We are currently finalizing our LMS meanwhile explore our courses.", "info");
  };

  // Intelligent Background Detection Logic
  useEffect(() => {
    const handleScroll = () => {
      const navEl = document.querySelector('.navbar-container');
      if (!navEl) return;

      const rect = navEl.getBoundingClientRect();
      const elements = document.elementsFromPoint(rect.left + rect.width / 2, rect.top + rect.height / 2);

      // Look for the first non-nav element behind the navbar
      const backgroundEl = elements.find(el => !navEl.contains(el) && el !== navEl);

      if (backgroundEl) {
        let current = backgroundEl;
        let bgColor = 'rgb(255, 255, 255)';
        while (current && current !== document.body) {
          const style = window.getComputedStyle(current);
          if (style.backgroundColor !== 'rgba(0, 0, 0, 0)' && style.backgroundColor !== 'transparent') {
            bgColor = style.backgroundColor;
            break;
          }
          current = current.parentElement;
        }

        const rgb = bgColor.match(/\d+/g);
        if (rgb && rgb.length >= 3) {
          const brightness = (parseInt(rgb[0]) * 299 + parseInt(rgb[1]) * 587 + parseInt(rgb[2]) * 114) / 1000;
          setIsNavbarDark(brightness < 160);
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    // Run detection on mount and whenever the route changes
    const timeoutId = setTimeout(handleScroll, 100);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearTimeout(timeoutId);
    };
  }, [location.pathname]);

  const logoutMutation = useMutation({
    mutationFn: userLogout,
    onSuccess: () => showFeedback("Logged out successfully!", "success"),
    onError: (error) => {
      showFeedback("Logout failed!", "error");
      console.error(error);
    },
  });

  const linkStyle = ({ isActive }) => {
    const baseStyle = `text-[10px] font-black uppercase tracking-[0.15em] transition-all duration-500 h-full flex items-center border-b-2 py-1`;
    const textColor = isNavbarDark ? "text-blue-50" : "text-blue-950";
    const hoverColor = isNavbarDark ? "hover:text-blue-950 hover:border-blue-950" : "hover:text-blue-400 hover:border-blue-400";
    return `${baseStyle} ${isActive ? "text-[#8d6e3e] border-[#8d6e3e]" : `${textColor} border-transparent ${hoverColor}`}`;
  };

  return (
    <nav
      className={`navbar-container fixed top-0 left-0 w-full z-[100] transition-all duration-500 flex items-center backdrop-blur-3xl border-b ${isNavbarDark ? "bg-[#0a192f]/60 border-white/10" : "bg-white/40 border-black/5"
        } ${showHeader ? "opacity-100 scale-100 h-16 sm:h-20" : "opacity-0 scale-95 pointer-events-none h-16 sm:h-20"}`}
    >
      <div className={`px-4 sm:px-6 w-full flex items-center justify-between mx-auto max-w-7xl transition-colors duration-500 ${isNavbarDark ? "text-white" : "text-blue-900"}`}>
        <div className="flex items-center h-full">
          {/* MOBILE DROPDOWN */}
          <div className="dropdown lg:hidden mr-1 sm:mr-2">
            <div tabIndex={0} role="button" className="btn btn-ghost text-xl sm:text-2xl p-1 sm:p-2 hover:bg-white/10">
              <TiThMenu />
            </div>
            <ul tabIndex={0} onClick={() => document.activeElement.blur()} className="menu menu-sm dropdown-content bg-white rounded-box z-[1] w-64 p-4 shadow-2xl mt-4 border border-gray-200">
              <li className="mb-2 text-slate-900">
                <NavLink to="/" className={({ isActive }) => `py-4 text-lg font-bold ${isActive ? "text-[#8d6e3e]" : "text-blue-900"}`}>Home</NavLink>
              </li>
              <li className="mb-2 text-slate-900">
                <NavLink to="/Programmes" className={({ isActive }) => `py-4 text-lg font-bold ${isActive ? "text-[#8d6e3e]" : "text-slate-900"}`}>Programmes</NavLink>
              </li>
              <li className="mb-2 text-slate-900">
                <NavLink to="/courses" className={({ isActive }) => `py-4 text-lg font-bold ${isActive ? "text-[#8d6e3e]" : "text-slate-900"}`}>Courses</NavLink>
              </li>
              <li className="mb-2 text-slate-900">
                <NavLink to="/about" className={({ isActive }) => `py-4 text-lg font-bold ${isActive ? "text-[#8d6e3e]" : "text-slate-900"}`}>About</NavLink>
              </li>
              {user && (
                <>
                  <div className="divider my-2"></div>
                  <li className="text-slate-900"><NavLink to="/dashboard" className="py-4 text-lg font-bold">Dashboard</NavLink></li>
                </>
              )}
            </ul>
          </div>

          <Link to="/" className="flex items-center h-full">
            <AppLogo isLight={isNavbarDark} />
          </Link>
        </div>

        <div className="flex items-center space-x-3 sm:space-x-8 h-full">
          <div className="hidden lg:flex items-center space-x-6 h-full">
            <NavLink to="/" className={linkStyle}>Home</NavLink>
            <NavLink to="/Programmes" className={linkStyle}>Programmes</NavLink>
            <NavLink to="/courses" className={linkStyle}>Courses</NavLink>
            <NavLink to="/about" className={linkStyle}>About</NavLink>
          </div>

          <UserData
            user={user}
            isUserLoading={isUserLoading}
            logoutMutation={logoutMutation}
            isDark={isNavbarDark}
          />
        </div>
      </div>
    </nav>
  );
}

const UserData = ({ user, isUserLoading, logoutMutation, isDark }) => {
  if (isUserLoading) return <span className="loading loading-spinner loading-md text-[#8d6e3e]"></span>;

  if (!user) {
    return (
      <Link
        to="/login"
        className={`btn font-black px-4 sm:px-8 rounded-xl transition-all duration-300 transform hover:scale-105 border uppercase tracking-tighter sm:tracking-widest text-[10px] sm:text-xs h-auto py-2 sm:py-3 min-h-0 ${isDark
            ? "bg-white/80 hover:bg-white/90 text-blue-950 border-white shadow-lg"
            : "bg-blue-900 hover:bg-blue-700 text-white border-blue-900 shadow-md shadow-blue-900/10"
          }`}
      >
        Login
      </Link>
    );
  }

  return (
    <div className="dropdown dropdown-end">
      <div tabIndex={1} role="button" className="btn btn-ghost btn-circle btn-sm sm:btn-md avatar border-2 border-[#8d6e3e]">
        <div className="w-8 sm:w-10 rounded-full">
          <img src={user.photoURL || "https://via.placeholder.com/150"} alt="User profile" />
        </div>
      </div>
      <ul tabIndex={1}
        onClick={() => document.activeElement.blur()}
        className={`menu menu-sm dropdown-content rounded-[2rem] z-[1] mt-5 w-64 p-4 transition-all duration-500 transform origin-top backdrop-blur-xl border ${isDark
            ? "bg-slate-900/95 border-slate-700 text-white shadow-[0_20px_60px_-15px_rgba(0,0,0,0.3)]"
            : "bg-white/95 border-slate-200 text-slate-900 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)]"
          }`}>
        <li className="px-5 py-4 mb-3 border-b border-white/10">
          <p className="text-sm font-bold truncate opacity-90">{user?.displayName || user?.email}</p>
        </li>
        <li>
          <Link to="/dashboard" className={`group flex items-center gap-3 py-3 rounded-xl transition-all ${isDark ? "hover:bg-white/10" : "hover:bg-slate-50"}`}>
            <span className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600 group-hover:scale-110 transition-transform">
              <MdArrowRight className="text-2xl" />
            </span>
            <span className="font-bold text-xs uppercase tracking-widest">Dashboard</span>
          </Link>
        </li>
        <li>
          <button onClick={() => logoutMutation.mutate()} className={`group flex items-center gap-3 py-3 rounded-xl mt-1 transition-all w-full text-left ${isDark ? "hover:bg-red-500/10" : "hover:bg-rose-50"}`}>
            <span className="w-8 h-8 rounded-lg bg-rose-50 flex items-center justify-center text-rose-600 group-hover:scale-110 transition-transform">
              <MdArrowRight className="text-2xl" />
            </span>
            <span className="font-bold text-xs uppercase tracking-widest text-rose-600">Logout</span>
          </button>
        </li>
      </ul>
    </div>
  );
};
