import { Box, CssBaseline } from "@mui/material";
import React from "react";
import { Outlet } from "react-router-dom";
import Header from "./Header"; // Assuming you have a Header component

const AdminDashboardSideNav = () => {
  return (
    <Box sx={{ display: "flex", minHeight: "100vh", backgroundColor: "white" }}>
      <CssBaseline />

      {/* Sidebar should be fixed */}
      <Header />

      {/* Main content area */}
      <Box
        sx={{
          flexGrow: 1,
          width: { md: `calc(100% - 250px)` }, // Adjust sidebar width
          backgroundColor: "#f1f1f4",
          borderRadius: "20px",
          height: "100vh",
          overflowY: "auto",
          paddingTop: "100px", // Assuming you want space for header
        }}
        component="main"
      >
        <Outlet />
      </Box>
    </Box>
  );
};

export default AdminDashboardSideNav;
