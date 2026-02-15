import { Outlet, useLocation } from "react-router"; // 1. Added useLocation
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "slick-carousel/slick/slick-theme.css";
import "slick-carousel/slick/slick.css";
import Footer from "./components/common/Footer";
import GoToTopButton from "./components/common/GoToTopButton";
import Navbar from "./components/common/Navbar";
import { AuthProvider } from "./providers/AuthProvider";

function App() {
  const location = useLocation(); // 2. Get the current URL path

  // 3. Determine if we should show the global footer
  // We hide it on the Home page ('/') because CTA.jsx has its own snap-footer
  const isHomePage = location.pathname === "/";

  return (
    <AuthProvider>
      <Navbar />
      <Outlet />
      
      {/* 4. Only render global footer if NOT on the home page */}
      {!isHomePage && <Footer />}
      
      <ToastContainer position="top-right" autoClose={3000} />
      <GoToTopButton />
    </AuthProvider>
  );
}

export default App;