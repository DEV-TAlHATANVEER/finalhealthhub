import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import SideNav from "./SideNav";
import Navbar from "./Navbar";

function Header(props) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation(); // Get the current location
  const [currentRoute, setCurrentRoute] = useState({
    title: "Users",
    buttonText: "Show",
    buttonLink: "#",
  });

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  return (
    <div>
      {/* Pass the current route to the Navbar */}
      <Navbar handleDrawerToggle={handleDrawerToggle} />
      <SideNav
        mobileOpen={mobileOpen}
        handleDrawerToggle={handleDrawerToggle}
      />
    </div>
  );
}

export default Header;
