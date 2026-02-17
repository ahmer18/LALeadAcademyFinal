import { useState, useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import { MdArrowRight } from "react-icons/md";
import { TiThMenu } from "react-icons/ti";
import { Link, NavLink } from "react-router";
import { toast } from "react-toastify";
import useAuth from "../../hooks/useAuth";
import { useSystemTheme } from "../../hooks/useSystemTheme";

// Import your logo from assets
import logoImg from "../../assets/images/Logo1.png";

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
  <div className="flex items-center space-x-4 transition-opacity duration-500 ease-in-out">
    <img
      src={logoImg}
      alt="LA Lead Academy Logo"
      className="h-16 w-auto object-contain" 
    />
    <div className="flex flex-col leading-tight">
      <span className={`text-xl font-bold font-logo-headline custom-text-shadow2 ${
        isLight ? "text-white" : "text-base-content"
      }`}>
        LALEAD Academy
      </span>
      <span className={`text-sm italic font-logo-headline opacity-70 custom-text-shadow2 ${
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

  // Updated linkStyle with Green/Emerald colors
  const linkStyle = ({ isActive }) => {
  const baseStyle = `text-xs font-black uppercase tracking-widest transition-all duration-300 h-full flex items-center border-b-2 py-1`;
  
  if (isLight) {
    return `${baseStyle} ${
      isActive
        ? "text-cyan-400 border-cyan-400"
        : "text-white/70 border-transparent hover:text-white hover:border-white/20"
    }`;
  }
  
  return `${baseStyle} ${
    isActive
      ? "text-[#1B365D] border-[#1B365D]"
      : "text-gray-500 border-transparent hover:text-[#1B365D] hover:border-[#1B365D]/20"
  }`;
};

  return (
    <nav
      className={`fixed top-0 left-0 w-full h-18 flex items-center z-50 transition-all duration-500 backdrop-blur-md ${
        isLight
          ? "bg-gray-900/90 text-white"
          : "bg-white/10 text-base-content"
      } ${
        showHeader ? "opacity-100 scale-100" : "opacity-0 scale-95 pointer-events-none"
      }`}
    >
      <div className="px-6 w-full flex items-center justify-between mx-auto max-w-7xl">
        
        <div className="flex items-center h-full">
          <div className="dropdown lg:hidden mr-2">
            <div tabIndex={0} role="button" className="btn btn-ghost text-2xl p-2 hover:bg-green-500/20">
              <TiThMenu />
            </div>
            <ul
              tabIndex={0}
              className="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] w-52 p-2 shadow mt-4 border border-white/10"
            >
              <li><NavLink to="/">Home</NavLink></li>
              <li><NavLink to="/courses">Courses</NavLink></li>
              {user && (
                <>
                  <div className="divider my-0"></div>
                  <li><NavLink to="/dashboard/profile">Profile</NavLink></li>
                  <li><NavLink to="/dashboard">Dashboard</NavLink></li>
                </>
              )}
            </ul>
          </div>

          <Link to="/" aria-label="Home" className="flex items-center h-full">
            <AppLogo isLight={isLight} />
          </Link>
        </div>

        <div className="flex items-center space-x-8 h-full">
          <div className="hidden lg:flex items-center space-x-6 h-full">
            <NavLink to="/" className={linkStyle}>Home</NavLink>
            <NavLink to="/courses" className={linkStyle}>Courses</NavLink>
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
  if (isUserLoading) return <span className="loading loading-spinner loading-md text-green-400"></span>;

  if (!user) {
  return (
    <Link
      to="/login"
      onClick={handleComingSoon}
      className={`btn font-black px-8 rounded-xl transition-all duration-300 transform hover:scale-105 border uppercase tracking-widest text-xs h-auto py-3 min-h-0 ${
        isLight
          ? "bg-white-100 hover:bg-white/20 text-blue-600 border-[#E9DFD5] backdrop-blur-md shadow-lg"
          : "bg-white-100 hover:bg-white-700 text-blue-600 border-[#E9DFD5] shadow-md shadow-cyan-900/10"
      }`}
    >
      Login
    </Link>
  );
}

  return (
    <div className="dropdown dropdown-end">
      <div
        tabIndex={1}
        role="button"
        className={`btn btn-ghost btn-circle avatar border-2 transition-colors ${
          isLight ? "border-green-400" : "border-emerald-500"
        }`}
      >
        <div className="w-10 rounded-full">
          <img src={user.photoURL || "https://via.placeholder.com/150"} alt="User profile" />
        </div>
      </div>
      <ul
        tabIndex={1}
        className={`menu menu-sm dropdown-content rounded-xl z-[1] mt-3 w-52 p-2 shadow-2xl border border-white/10 ${
          isLight
            ? "bg-gray-800 text-white"
            : "bg-base-100 text-base-content"
        }`}
      >
        <li className={`menu-title text-center border-b border-white/10 pb-2 mb-2 ${
          isLight ? "text-green-400" : "text-emerald-500"
        }`}>
          {user?.displayName}
        </li>
        <li>
          <Link to="/dashboard/profile" className="hover:text-green-400">
            <MdArrowRight className="text-xl" /> Profile
          </Link>
        </li>
        <li>
          <Link to="/dashboard" className="hover:text-green-400">
            <MdArrowRight className="text-xl" /> Dashboard
          </Link>
        </li>
        <li>
          <button onClick={() => logoutMutation.mutate()} className={`font-semibold transition-colors ${
            isLight ? "text-red-400 hover:bg-red-500/10" : "text-error hover:bg-error/10"
          }`}>
            <MdArrowRight className="text-xl" /> Logout
          </button>
        </li>
      </ul>
    </div>
  );
};