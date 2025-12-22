import { Outlet, useLocation } from "react-router-dom";
import Header from "./components/Header/Header";
import Footer from "./components/Footer/Footer";

function Layout() {
  const location = useLocation();
  const isLandingPage = location.pathname === "/";

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1">
        <Outlet />
      </main>
      {!isLandingPage && <Footer />}
    </div>
  );
}

export default Layout;
