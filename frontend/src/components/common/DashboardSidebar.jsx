import { FaBookOpen } from "react-icons/fa";
import { IoIosPerson } from "react-icons/io";
import { IoDocumentsSharp } from "react-icons/io5";
import { LuBookUser } from "react-icons/lu";
import { MdAddToPhotos } from "react-icons/md";
import { PiChalkboardTeacherBold } from "react-icons/pi";
import { NavLink } from "react-router";
import useAuth from "../../hooks/useAuth";

export default function DashboardSidebar() {
  const { user } = useAuth();

  const linkStyle = ({ isActive }) =>
    `flex items-center gap-3 p-3 rounded-xl transition-all duration-300 ${
      isActive 
        ? "bg-blue-900 text-white shadow-lg shadow-blue-500/20" 
        : "text-slate-300 hover:bg-slate-700/50 hover:text-white"
    }`;

  return (
    <div className="drawer-side z-50">
      {/* The Overlay allows users to tap outside the menu to close it on mobile */}
      <label htmlFor="dashboard-drawer" aria-label="close sidebar" className="drawer-overlay"></label>
      
      <div className="w-72 min-h-full bg-[#1B2635] text-white p-6 shadow-2xl flex flex-col">
        {/* Branding */}
        <div className="mb-10 mt-4 px-2">
          <h2 className="text-2xl font-black tracking-tighter uppercase italic text-[#8D6E3E]">
            LALEAD <span className="text-white not-italic">Dashboard</span>
          </h2>
          <p className="text-[10px] text-slate-500 uppercase tracking-[0.3em] font-bold mt-1">
            {user?.role} Portal
          </p>
        </div>

        {/* Navigation Links */}
        <nav className="flex flex-col space-y-2 flex-grow">
          {user?.role === "admin" && (
            <>
              <NavLink to="/dashboard/teachers" className={linkStyle}>
                <PiChalkboardTeacherBold size={20} /> <span>All Teachers</span>
              </NavLink>
              <NavLink to="/dashboard/users" className={linkStyle}>
                <LuBookUser size={20} /> <span>All Users</span>
              </NavLink>
              <NavLink to="/dashboard/courses" className={linkStyle}>
                <FaBookOpen size={20} /> <span>All Courses</span>
              </NavLink>
            </>
          )}

          {user?.role === "student" && (
            <NavLink to="/dashboard/courses" className={linkStyle}>
              <IoDocumentsSharp size={20} /> <span>Enrolled Courses</span>
            </NavLink>
          )}

          {user?.role === "teacher" && (
            <>
              <NavLink to="/dashboard/courses" className={linkStyle}>
                <IoDocumentsSharp size={20} /> <span>My Courses</span>
              </NavLink>
              <NavLink to="/dashboard/courses/add" className={linkStyle}>
                <MdAddToPhotos size={20} /> <span>Add Course</span>
              </NavLink>
            </>
          )}

          <NavLink to="/dashboard/profile" className={linkStyle}>
            <IoIosPerson size={20} /> <span>My Profile</span>
          </NavLink>
        </nav>

        {/* Footer info inside sidebar */}
        <div className="mt-auto pt-6 border-t border-slate-700/50">
          <div className="p-4 rounded-2xl bg-slate-800/50 border border-slate-700 text-center">
            <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">
              v2.0 
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}