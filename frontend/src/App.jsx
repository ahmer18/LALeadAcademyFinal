import { Outlet, useLocation } from "react-router"; // 1. Added useLocation
import "slick-carousel/slick/slick-theme.css";
import "slick-carousel/slick/slick.css";
import Footer from "./components/common/Footer";
import GoToTopButton from "./components/common/GoToTopButton";
import Navbar from "./components/common/Navbar";
import { AuthProvider } from "./providers/AuthProvider";
import { FeedbackProvider } from "./providers/FeedbackProvider";

function App() {
  const location = useLocation(); // 2. Get the current URL path

  // 3. Determine if we should show the global footer
  const path = location.pathname.toLowerCase();
  const isHomePage = path === "/";
  const showFooterPaths = ["/", "/about", "/courses", "/programmes"];
  const isAllowedFooterPath = showFooterPaths.includes(path) ||
    path.startsWith("/courses/") ||
    path.startsWith("/programmes/");

  // We hide the global footer on the Home page ('/') because CTA.jsx handles it inside the snap-scrolling container
  const showGlobalFooter = isAllowedFooterPath && !isHomePage;

  // Hide header and GoToTop button on Module Player pages
  const isModulePlayer = /^\/course\/[^/]+\/module\/[^/]+/.test(path);

  return (
    <FeedbackProvider>
      <AuthProvider>
        {!isModulePlayer && <Navbar />}
        <Outlet />

        {/* 4. Only render global footer if it's an allowed path AND not on the home page */}
        {showGlobalFooter && <Footer />}

        {!isModulePlayer && <GoToTopButton />}
      </AuthProvider>
    </FeedbackProvider>
  );
}

export default App;