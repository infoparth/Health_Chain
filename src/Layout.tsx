import React from "react";
import { Outlet } from "react-router-dom";
import Header from "./components/ui/Header/Header";
import Footer from "./components/ui/Footer/Footer";

function Layout() {
  return (
    <div>
      {/* <Header /> */}
      <Outlet  />
      {/* <Footer /> */}
    </div>
  );
}

export default Layout;
