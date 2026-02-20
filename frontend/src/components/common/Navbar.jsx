import { useState, useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import { MdArrowRight } from "react-icons/md";
import { TiThMenu } from "react-icons/ti";
import { Link, NavLink } from "react-router";
import { toast } from "react-toastify";
import useAuth from "../../hooks/useAuth";
import { useSystemTheme } from "../../hooks/useSystemTheme";

// Import your logo from assets
import logoImg from "../../assets/images/logoagain.png";

const handleComingSoon = (e) => {
  e.preventDefault(); 
  toast.info("Login is coming soon! We are currently finalizing our LMS meanwhile explore our courses.", {
    position: "top-center",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    theme: "colored",
  });
};

const AppLogo = ({ isLight }) => (
  <div className="flex items-center space-x-2 sm:space-x-4 transition-all duration-500 ease-in-out">
    <img
      src={logoImg}
      alt="LA Lead Academy Logo"
      className="h-10 w-auto sm:h-16 object-contain" 
    />
    <div className="flex flex-col leading-tight">
      <div className="text-sm sm:text-xl brand-text custom-text-shadow2 whitespace-nowrap">
        <span className="brand-la">LA</span>
        <span className={isLight ? "brand-lead" : "brand-lead2"}>LEAD</span>
        <span className={`ml-1 ${isLight ? "text-white" : "text-gray-900"}`}>
          Academy
        </span>
      </div>
      <span className={`text-[9px] sm:text-sm italic font-logo-headline opacity-70 custom-text-shadow2 ${
        isLight ? "text-white/70" : "text-base-content"
      }`}>
        Grow, Shine, Succeed!
      </span>
    </div>
  </div>
);

export default function Navbar() {
  const { user, isUserLoading, userLogout } = useAuth();
  const isLight = useSystemTheme();
  const [showHeader, setShowHeader] = useState(true);

  const logoutMutation = useMutation({
    mutationFn: userLogout,
    onSuccess: () => toast.success("Logged out successfully!"),
    onError: (error) => {
      toast.error("Logout failed!");
      console.error(error);
    },
  });

  useEffect(() => {
    const section3El = document.getElementById("section3");
    const section4El = document.getElementById("section4");
    if (!section3El || !section4El) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const isMobile = window.innerWidth < 640;
        entries.forEach((entry) => {
          const id = entry.target.id;
          if (isMobile) {
            if (id === "section3" || id === "section4") {
              setShowHeader(!entry.isIntersecting);
            }
          } else {
            if (id === "section4") {
              setShowHeader(!entry.isIntersecting);
            }
          }
        });
      },
      { threshold: 0.5 }
    );

    observer.observe(section3El);
    observer.observe(section4El);
    return () => observer.disconnect();
  }, []);

  const linkStyle = ({ isActive }) => {
    const baseStyle = `text-xs font-black uppercase tracking-widest transition-all duration-300 h-full flex items-center border-b-2 py-1`;
    if (isLight) {
      return `${baseStyle} ${isActive ? "text-[#8d6e3e] border-[#8d6e3e]" : "text-white border-transparent hover:text-white"}`;
    }
    return `${baseStyle} ${isActive ? "text-[#8d6e3e] border-[#8d6e3e]" : "text-gray-500 border-transparent hover:text-[#1B365D]"}`;
  };

  return (
    <nav
      className={`navbar-container fixed top-0 left-0 w-full z-50 transition-all duration-500 flex items-center ${
        isLight ? "bg-gray-900 text-white" : "bg-white/10 text-base-content"
      } ${showHeader ? "opacity-100 scale-100 h-16 sm:h-20" : "opacity-0 scale-95 pointer-events-none h-16 sm:h-20"}`}
    >
      <div className="px-4 sm:px-6 w-full flex items-center justify-between mx-auto max-w-7xl">
        <div className="flex items-center h-full">
          {/* MOBILE DROPDOWN */}
          <div className="dropdown lg:hidden mr-1 sm:mr-2">
            <div tabIndex={0} role="button" className="btn btn-ghost text-xl sm:text-2xl p-1 sm:p-2 hover:bg-green-500/20">
              <TiThMenu />
            </div>
            <ul
              tabIndex={0}
              className="menu menu-sm dropdown-content bg-white rounded-box z-[1] w-64 p-4 shadow-2xl mt-4 border border-gray-200"
            >
              {/* Force text-slate-900 so links are visible against white bg */}
              <li className="mb-2 text-slate-900">
                <NavLink to="/" className={({isActive}) => `py-4 text-lg font-bold ${isActive ? "text-[#8d6e3e]" : "text-slate-900"}`}>Home</NavLink>
              </li>
              <li className="mb-2 text-slate-900">
                <NavLink to="/courses" className={({isActive}) => `py-4 text-lg font-bold ${isActive ? "text-[#8d6e3e]" : "text-slate-900"}`}>Programmes</NavLink>
              </li>
              <li className="mb-2 text-slate-900">
                <NavLink to="/about" className={({isActive}) => `py-4 text-lg font-bold ${isActive ? "text-[#8d6e3e]" : "text-slate-900"}`}>About</NavLink>
              </li>
              {user && (
                <>
                  <div className="divider my-2"></div>
                  <li className="text-slate-900"><NavLink to="/dashboard/profile" className="py-4 text-lg font-bold">Profile</NavLink></li>
                  <li className="text-slate-900"><NavLink to="/dashboard" className="py-4 text-lg font-bold">Dashboard</NavLink></li>
                </>
              )}
            </ul>
          </div>

          <Link to="/" className="flex items-center h-full">
            <AppLogo isLight={isLight} />
          </Link>
        </div>

        <div className="flex items-center space-x-3 sm:space-x-8 h-full">
          <div className="hidden lg:flex items-center space-x-6 h-full">
            <NavLink to="/" className={linkStyle}>Home</NavLink>
            <NavLink to="/courses" className={linkStyle}>Programmes</NavLink>
            <NavLink to="/about" className={linkStyle}>About</NavLink>
          </div>

          <UserData
            user={user}
            isUserLoading={isUserLoading}
            logoutMutation={logoutMutation}
            isLight={isLight}
          />
        </div>
      </div>
    </nav>
  );
}

const UserData = ({ user, isUserLoading, logoutMutation, isLight }) => {
  if (isUserLoading) return <span className="loading loading-spinner loading-md text-[#8d6e3e]"></span>;

  if (!user) {
    return (
      <Link
        to="/login"
        onClick={handleComingSoon}
        className={`btn font-black px-4 sm:px-8 rounded-xl transition-all duration-300 transform hover:scale-105 border uppercase tracking-tighter sm:tracking-widest text-[10px] sm:text-xs h-auto py-2 sm:py-3 min-h-0 ${
          isLight
            ? "bg-white-100 hover:bg-white/20 text-blue-600 border-[#E9DFD5] shadow-lg"
            : "bg-white-100 hover:bg-white-700 text-blue-600 border-[#E9DFD5] shadow-md shadow-cyan-900/10"
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
      <ul tabIndex={1} className={`menu menu-sm dropdown-content rounded-xl z-[1] mt-3 w-52 p-2 shadow-2xl border border-white/10 ${
          isLight ? "bg-gray-800 text-white" : "bg-white text-slate-900"
        }`}>
        <li className="menu-title text-center border-b border-gray-200 pb-2 mb-2 text-[#8d6e3e]">
          {user?.displayName}
        </li>
        <li><Link to="/dashboard/profile" className="hover:text-[#8d6e3e] py-3 text-slate-900"><MdArrowRight className="text-xl" /> Profile</Link></li>
        <li><Link to="/dashboard" className="hover:text-[#8d6e3e] py-3 text-slate-900"><MdArrowRight className="text-xl" /> Dashboard</Link></li>
        <li>
          <button onClick={() => logoutMutation.mutate()} className="font-semibold py-3 text-red-500 hover:bg-red-50/50">
            <MdArrowRight className="text-xl" /> Logout
          </button>
        </li>
      </ul>
    </div>
  );
};