import { useState, useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import { MdArrowRight } from "react-icons/md";
import { TiThMenu } from "react-icons/ti";
import { Link, NavLink } from "react-router";
import { toast } from "react-toastify";
import useAuth from "../../hooks/useAuth";
import { useSystemTheme } from "../../hooks/useSystemTheme";

// Import your logo from assets
import logoImg from "../../assets/images/Logo.png.png";

 const handleComingSoon = (e) => {
  e.preventDefault(); // Prevents the link from navigating to "/login"
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
      // Increased size: h-16 (64px) or h-20 (80px) usually matches a large header logo
      className="h-16 w-auto object-contain" 
    />
    <div className="flex flex-col leading-tight">
      <span className={`text-xl font-bold font-logo-headline custom-text-shadow2 ${
        isLight ? "text-white" : "text-base-content"
      }`}>
        LA LEAD Academy
      </span>
      <span className={`text-sm italic font-logo-headline opacity-70 custom-text-shadow2 ${
        isLight ? "text-white/70" : "text-base-content"
      }`}>
        Learn, Lead, Succeed.
      </span>
    </div>
  </div>
);

export default function Navbar() {
  const { user, isUserLoading, userLogout } = useAuth();
  const isLight = useSystemTheme();
  const [showHeader, setShowHeader] = useState(true);

  // Logout Mutation
  const logoutMutation = useMutation({
    mutationFn: userLogout,
    onSuccess: () => toast.success("Logged out successfully!"),
    onError: (error) => {
      toast.error("Logout failed!");
      console.error(error);
    },
  });

 

  // Scroll logic: Intersection Observer to hide/show header
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

  // Styling for active links (Matches the bottom border style)
  const linkStyle = ({ isActive }) => {
    const baseStyle = `text-sm font-medium transition-colors h-full flex items-center border-b-2 py-2`;
    if (isLight) {
      return `${baseStyle} ${
        isActive
          ? "text-indigo-300 border-indigo-300 font-semibold"
          : "text-white/80 border-transparent hover:text-indigo-300 hover:border-indigo-300"
      }`;
    }
    return `${baseStyle} ${
      isActive
        ? "text-primary border-primary font-semibold"
        : "text-base-content border-transparent hover:text-primary hover:border-primary"
    }`;
  };

  return (
    <nav
      className={`fixed top-0 left-0 w-full h-18 flex items-center z-50 transition-all duration-500 backdrop-blur-sm ${
        isLight
          ? "bg-gray-900/95 text-white"
          : "bg-white/10 text-base-content"
      } ${
        showHeader ? "opacity-100 scale-100" : "opacity-0 scale-90 pointer-events-none"
      }`}
    >
      <div className="px-6 w-full flex items-center justify-between mx-auto max-w-7xl">
        
        {/* Navbar Start: Mobile Menu & Logo */}
        <div className="flex items-center h-full">
          <div className="dropdown lg:hidden mr-2">
            <div tabIndex={0} role="button" className="btn btn-ghost text-2xl p-2">
              <TiThMenu />
            </div>
            <ul
              tabIndex={0}
              className="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] w-52 p-2 shadow mt-4"
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

        {/* Navbar Center/End: Desktop Links & Auth */}
        <div className="flex items-center space-x-8 h-full">
          <div className="hidden lg:flex items-center space-x-6 h-full">
            <NavLink to="/" className={linkStyle}>Home</NavLink>
            <NavLink to="/courses" className={linkStyle}>Courses</NavLink>
            <NavLink to="/about" className={linkStyle}>About</NavLink>
            {/* <NavLink to="/contact" className={linkStyle}>Contact</NavLink> */}
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

/**
 * UserData Component
 * Handles the right-side profile dropdown or login button
 */
const UserData = ({ user, isUserLoading, logoutMutation, isLight }) => {
  if (isUserLoading) return <span className="loading loading-spinner loading-md"></span>;

  if (!user) {
    return (
      <Link
        
        to="/login"
        onClick={handleComingSoon}
        className={`btn font-semibold border-none px-5 ${
          isLight
            ? "bg-indigo-500 hover:bg-indigo-300 text-gray-900"
            : "bg-[#C0F2FB] hover:bg-[#a9e2f2] text-white-900"
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
        className={`btn btn-ghost btn-circle avatar border-2 ${
          isLight ? "border-cyan-300" : "border-primary"
        }`}
      >
        <div className="w-10 rounded-full">
          <img src={user.photoURL || "https://via.placeholder.com/150"} alt="User profile" />
        </div>
      </div>
      <ul
        tabIndex={1}
        className={`menu menu-sm dropdown-content rounded-box z-[1] mt-3 w-52 p-2 shadow ${
          isLight
            ? "bg-gray-800 text-white"
            : "bg-base-100 text-base-content"
        }`}
      >
        <li className={`menu-title text-center border-b pb-2 mb-2 ${
          isLight ? "text-white" : "text-base-content"
        }`}>
          {user?.displayName}
        </li>
        <li>
          <Link to="/dashboard/profile">
            <MdArrowRight /> Profile
          </Link>
        </li>
        <li>
          <Link to="/dashboard">
            <MdArrowRight /> Dashboard
          </Link>
        </li>
        <li>
          <button onClick={() => logoutMutation.mutate()} className={`font-semibold ${
            isLight ? "text-red-400" : "text-error"
          }`}>
            <MdArrowRight /> Logout
          </button>
        </li>
      </ul>
    </div>
  );
};