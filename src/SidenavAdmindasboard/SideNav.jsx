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
  IoSettingsOutline,
  IoHomeOutline,
  IoPeopleOutline,
  IoMedkitOutline,
  IoCalendarOutline,
  IoCashOutline,
  IoDocumentTextOutline,
  IoPencilOutline,
  IoHeart,
} from "react-icons/io5";
import LogoutIcon from "@mui/icons-material/Logout";

const drawerWidth = 260;

const listItemData = [
  {
    label: "Dashboards",
    link: "/admin/dashboard",
    icon: <IoHomeOutline size={20} />,
  },
  {
    label: "Patients",
    link: "/admin/patients",
    icon: <IoPeopleOutline size={20} />,
  },
  {
    label: "Doctors",
    link: "/admin/doctors",
    icon: <IoMedkitOutline size={20} />,
  },
  {
    label: "Blood Bank",
    link: "/admin/bloodbank",
    icon: <IoMedkitOutline size={20} />,
  },
  // {
  //   label: "Appointments",
  //   link: "/admin/appointments",
  //   icon: <IoCalendarOutline size={20} />,
  // },
  // {
  //   label: "EHR",
  //   link: "/admin/ehr",
  //   icon: <IoDocumentTextOutline size={20} />,
  // },
  {
    label: "Payments",
    link: "/admin/payments",
    icon: <IoCashOutline size={20} />,
  },
  {
    label: "Lab",
    link: "/admin/lab",
    icon: <IoCashOutline size={20} />,
  },
  
];

function SideNav(props) {
  const { window, mobileOpen, handleDrawerToggle } = props;
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    navigate("/");
  };

  const handleProfile = () => {
    navigate("/admin/setting");
  };

  const drawer = (
    <div
      style={{
        backgroundColor: "#F4F4F5", // Light gray (gray-200)
        height: "100vh",
        borderRight: "1px solid #E5E7EB", // Slightly darker border
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
        <IoHeart size={28} color="#1F2937" /> {/* Dark gray icon */}
        <span
          style={{
            fontFamily: "Poppins",
            fontSize: "24px",
            fontWeight: 700,
            color: "#1F2937", // Text color: dark gray
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
            backgroundColor: "#b5b5b5", // Lighter gray for scrollbar
            borderRadius: "10px",
          },
        }}
      >
        {listItemData.map((value, i) => (
          <RenderItem key={i} value={value} />
        ))}
      </List>

      {/* Profile and Logout */}
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
              color: "#DC2626", // Red hover
            },
          }}
        >
          <ListItemText
            primary={
              <Typography
                variant="body2"
                sx={{
                  fontSize: 16,
                  color: "#374151", // Dark gray
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
          backgroundColor: isActive ? "#E5E7EB" : "transparent", // Active: gray-300
          color: "#374151", // Dark gray
          "&:hover": {
            backgroundColor: "#ECF4E9", // Hover: light gray
            color: "#1D4ED8", // Hover: blue
            borderLeft: "4px solid #1D4ED8",
          },
          borderLeft: isActive ? "4px solid #1D4ED8" : "none", // Active border
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
