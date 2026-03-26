import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Box from "@mui/material/Box";
import Topbar from "../../components/Topbar";
import Sidebar from "../../components/Sidebar";
import { Outlet } from 'react-router-dom';
import { ADMIN_LINKS, USER_LINKS } from "../../utils/Links";
import { jwtDecode } from "jwt-decode";

const HomePage = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [links, setLinks] = useState(ADMIN_LINKS);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const decoded = jwtDecode(token);
    const role = decoded.role;

    // If no token, redirect to login
    if (!token) {
      navigate("/login");
      return;
    }

    // Set links based on role
    switch (role) {
      case "user":
        setLinks(USER_LINKS);
        break;
      case "admin":
        setLinks(ADMIN_LINKS);
        break;
      case "sub-admin":
        setLinks(SUBADMIN_LINKS);
        break;
      default:
        // If invalid role, redirect to login
        localStorage.clear();
        navigate("/login");
    }
  }, [navigate]);

  const toggleDrawer = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <Topbar toggleDrawer={toggleDrawer} onLogout={handleLogout} />
      <Box sx={{ display: "flex", flexGrow: 1, pt: "64px" }}>
        <Sidebar 
          open={sidebarOpen} 
          toggleDrawer={toggleDrawer} 
          links={links} 
        />
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            p: 3,
            transition: "margin 225ms cubic-bezier(0, 0, 0.2, 1) 0ms",
            marginLeft: sidebarOpen ? "250px" : 0,
          }}
        >
          {/* Content will be rendered here through nested routes */}
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
};

export default HomePage;
