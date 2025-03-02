import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  AppBar,
  Button,
  Toolbar,
  Box,
  Typography,
  IconButton,
  Menu,
  MenuItem,
  Avatar,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { IoIosLogOut, IoIosArrowDown } from "react-icons/io";
import { IoPerson, IoSettingsSharp } from "react-icons/io5";
import { auth, db } from "../firebase";
import { doc, getDoc } from "firebase/firestore";
import NotificationBell from "../components/NotificationBell";

const Navbar = ({ handleDrawerToggle }) => {
  const [user, setUser] = useState(null);
  const [avatarMenuAnchorEl, setAvatarMenuAnchorEl] = useState(null);
  const navigate = useNavigate();
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));

  useEffect(() => {
    const fetchUserData = async () => {
      const currentUser = auth.currentUser;
      if (currentUser) {
        const userRef = doc(db, "doctors", currentUser.uid);
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) {
          setUser(userSnap.data());
        }
      }
    };

    fetchUserData();
  }, []);

  const handleAvatarMenuClick = (event) => setAvatarMenuAnchorEl(event.currentTarget);
  const handleCloseAvatarMenu = () => setAvatarMenuAnchorEl(null);

  const handleLogout = async () => {
    try {
      await auth.signOut();
      navigate("/");
    } catch (error) {
      console.error("Logout Error:", error);
    }
  };

  return (
    <Box>
      <AppBar position="fixed" sx={{ backgroundColor: "#f1f1f4", boxShadow: "none" }}>
        <Toolbar
          sx={{
            display: "flex",
            padding: "0 16px",
            backgroundColor: "#ffff",
            margin: "10px",
            borderRadius: "10px",
            marginLeft: { xs: 2, sm: 2, md: "250px", lg: "250px" },
          }}
        >
          <Box sx={{ display: "flex", alignItems: "start", justifyContent: "flex-start" }}>
            <Button variant="text" sx={{ display: { xs: "block", md: "none" } }} onClick={handleDrawerToggle}>
              <MenuIcon style={{ color: "black" }} />
            </Button>
          </Box>

          <Box sx={{ display: "flex", alignItems: "start", justifyContent: "flex-start", flexGrow: 1, mr: 2 }}>
            <Typography variant="h6" sx={{ fontWeight: "bold", color: "#000", display: { xs: "none", sm: "block" } }}>
              Doctor Dashboard
            </Typography>
          </Box>

          {!isSmallScreen && (
            <Box sx={{ display: "flex", alignItems: "center", mr: 2 }}>
              <NotificationBell />
            </Box>
          )}

          <Box sx={{ display: "flex", alignItems: "center" }}>
            <IconButton onClick={handleAvatarMenuClick}>
              <Avatar src={user?.profilePicture || "/default-avatar.png"} alt={user?.name || "User"} sx={{ width: 40, height: 40 }} />
            </IconButton>
            {!isSmallScreen && (
              <>
                <Box sx={{ ml: 1, textAlign: "left", padding: "10px" }}>
                  <Typography variant="subtitle2" sx={{ fontWeight: "bold", color: "black" }}>
                    {user?.username || "Loading..."}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {user?.Role || "Doctor"}
                  </Typography>
                </Box>
                <IoIosArrowDown size={25} onClick={handleAvatarMenuClick} style={{ color: "black" }} />
              </>
            )}
          </Box>

          <Menu anchorEl={avatarMenuAnchorEl} open={Boolean(avatarMenuAnchorEl)} onClose={handleCloseAvatarMenu}>
            <MenuItem onClick={handleCloseAvatarMenu}>
              <IoPerson style={{ marginRight: 8 }} /> Profile
            </MenuItem>
            <MenuItem onClick={handleCloseAvatarMenu}>
              <IoSettingsSharp style={{ marginRight: 8 }} /> Settings
            </MenuItem>
            <MenuItem onClick={handleLogout}>
              <IoIosLogOut style={{ marginRight: 8 }} /> Logout
            </MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>
    </Box>
  );
};

export default Navbar;
