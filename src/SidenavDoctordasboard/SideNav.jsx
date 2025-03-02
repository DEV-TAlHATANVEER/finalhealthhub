import PropTypes from "prop-types";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import Typography from "@mui/material/Typography";
import { NavLink, useNavigate } from "react-router-dom";
import {
  IoHomeOutline,
  IoPersonOutline,
  IoCalendarOutline,
  IoVideocamOutline,
  IoTimeOutline,
  IoPeopleOutline,
  IoCashOutline,
  IoHeart,
} from "react-icons/io5";
import LogoutIcon from "@mui/icons-material/Logout";
import { auth } from "../firebase";

const drawerWidth = 260;

const listItemData = [
  {
    label: "Dashboard",
    link: "/doctor/dashboard",
    icon: <IoHomeOutline size={20} />,
  },
  {
    label: "Profile",
    link: "/doctor/profile",
    icon: <IoPersonOutline size={20} />,
  },
  {
    label: "Appointments",
    link: "/doctor/appointment",
    icon: <IoCalendarOutline size={20} />,
  },

  {
    label: "Manage Availability",
    link: "/doctor/manage-availability",
    icon: <IoTimeOutline size={20} />,
  },
  {
    label: "Patients",
    link: "/doctor/patients",
    icon: <IoPeopleOutline size={20} />,
  },
  {
    label: "Payments",
    link: "/doctor/payments",
    icon: <IoCashOutline size={20} />,
  },
];

function SideNav(props) {
  const { window, mobileOpen, handleDrawerToggle } = props;
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await auth.signOut();
      navigate("/");
    } catch (error) {
      console.error("Logout Error:", error);
    }
  };

  const drawer = (
    <div
      style={{
        backgroundColor: "#F4F4F5",
        height: "100vh",
        borderRight: "1px solid #E5E7EB",
        display: "flex",
        flexDirection: "column",
        padding: "10px",
      }}
    >
      {/* Health Hub Header */}
      <div
        className="p-4 mx-auto"
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          gap: "10px",
        }}
      >
        <IoHeart size={28} color="#1F2937" />
        <span
          style={{
            fontFamily: "Poppins",
            fontSize: "24px",
            fontWeight: 700,
            color: "#1F2937",
          }}
        >
          Health Hub
        </span>
      </div>

      {/* Sidebar Links */}
      <List
        sx={{
          flexGrow: 1,
          overflowY: "auto",
          "&::-webkit-scrollbar": {
            width: "4px",
          },
          "&::-webkit-scrollbar-thumb": {
            backgroundColor: "#b5b5b5",
            borderRadius: "10px",
          },
        }}
      >
        {listItemData.map((value, i) => (
          <RenderItem key={i} value={value} />
        ))}
      </List>

      {/* Logout */}
      <List style={{ padding: "20px" }}>
        <ListItem
          disablePadding
          onClick={handleLogout}
          sx={{
            justifyContent: "center",
            cursor: "pointer",
            width: "150px",
            borderRadius: "8px",
            "&:hover .MuiTypography-root": {
              color: "#DC2626",
            },
          }}
        >
          <ListItemText
            primary={
              <Typography
                variant="body2"
                sx={{
                  fontSize: 16,
                  color: "#374151",
                  textAlign: "center",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  fontFamily: "Poppins",
                  marginTop: "32px",
                }}
                title="Logout"
              >
                <LogoutIcon fontSize="small" />
                Logout
              </Typography>
            }
          />
        </ListItem>
      </List>
    </div>
  );

  return (
    <Box
      component="nav"
      sx={{
        width: { md: drawerWidth },
        flexShrink: { md: 0 },
      }}
      aria-label="mailbox folders"
    >
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true,
        }}
        sx={{
          display: { xs: "block", md: "none" },
          "& .MuiDrawer-paper": {
            boxSizing: "border-box",
            width: drawerWidth,
            backgroundColor: "#F4F4F5",
          },
        }}
      >
        {drawer}
      </Drawer>
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: "none", md: "block" },
          "& .MuiDrawer-paper": {
            boxSizing: "border-box",
            width: drawerWidth,
            backgroundColor: "#F4F4F5",
          },
        }}
        open
      >
        {drawer}
      </Drawer>
    </Box>
  );
}

const RenderItem = ({ value }) => {
  const isActive = window.location.pathname === value.link;

  return (
    <ListItem disablePadding>
      <ListItemButton
        component={NavLink}
        to={value.link}
        sx={{
          backgroundColor: isActive ? "#E5E7EB" : "transparent",
          color: "#374151",
          "&:hover": {
            backgroundColor: "#ECF4E9",
            color: "#1D4ED8",
            borderLeft: "4px solid #1D4ED8",
          },
          borderLeft: isActive ? "4px solid #1D4ED8" : "none",
          paddingLeft: "16px",
          marginTop: "12px",
        }}
      >
        {value.icon}
        <ListItemText
          primary={
            <Typography
              variant="body2"
              sx={{
                fontSize: 16,
                color: isActive ? "#1D4ED8" : "#374151",
                fontFamily: "Poppins",
                paddingLeft: "10px",
              }}
              title={value.label}
            >
              {value.label}
            </Typography>
          }
        />
      </ListItemButton>
    </ListItem>
  );
};

SideNav.propTypes = {
  window: PropTypes.func,
  mobileOpen: PropTypes.bool.isRequired,
  handleDrawerToggle: PropTypes.func.isRequired,
};

export default SideNav;
