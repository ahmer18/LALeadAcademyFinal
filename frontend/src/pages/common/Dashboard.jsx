import { Outlet } from "react-router";
import DashboardSidebar from "../../components/common/DashboardSidebar";
import HeadTag from "../../components/common/HeadTag";
import LoaderDotted from "../../components/common/LoaderDotted";
import useAuth from "../../hooks/useAuth";
import { FaBars } from "react-icons/fa";

export default function DashBoard() {
  const { isUserLoading, user } = useAuth();

  if (isUserLoading) return <LoaderDotted />;

  return (
    <>
      <HeadTag title="LA Lead Academy | Dashboard" />
      
      {/* MAIN DRAWER WRAPPER */}
      <div className="drawer lg:drawer-open min-h-screen pt-20 bg-slate-50 transition-colors">
        {/* The Toggle: This hidden checkbox controls the sidebar state */}
        <input id="dashboard-drawer" type="checkbox" className="drawer-toggle" />

        {/* RIGHT SIDE: Main Content */}
        <div className="drawer-content flex flex-col">
          
          {/* MOBILE HEADER: Only visible on small screens */}
          <div className="lg:hidden p-4 flex items-center justify-between bg-[#1B2635] text-white sticky top-0 z-40 shadow-lg">
            <div className="flex items-center gap-3">
              <label htmlFor="dashboard-drawer" className="btn btn-ghost btn-circle drawer-button">
                <FaBars size={20} />
              </label>
              <span className="font-bold uppercase tracking-[0.2em] text-[10px] text-blue-400">
                {user?.role} Portal
              </span>
            </div>
          </div>

          {/* CONTENT STAGE: Full width, pages handle their own padding and max width */}
          <main className="flex-grow overflow-x-hidden relative flex flex-col">
            <Outlet />
          </main>
        </div>

        {/* LEFT SIDE: Sidebar */}
        <DashboardSidebar />
      </div>
    </>
  );
}