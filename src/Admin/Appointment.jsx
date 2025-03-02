import React, { useState } from "react";
import MuiTable from "../mui/TableMuiCustom";
import { TextField, Menu, MenuItem, IconButton, InputAdornment } from "@mui/material";
import { MoreVert, Search } from "@mui/icons-material";

const tableHeaders = {
  appointmentId: "Appointment ID",
  patientName: "Patient Name",
  doctorName: "Doctor Name",
  appointmentTime: "Appointment Time",
    Action: "Action"
};

const tableData = [
  { appointmentId: "A001", patientName: "John Doe", doctorName: "Dr. A", appointmentTime: "10:00 AM" },
  { appointmentId: "A002", patientName: "Jane Smith", doctorName: "Dr. B", appointmentTime: "11:30 AM" },
  { appointmentId: "A003", patientName: "Alice Johnson", doctorName: "Dr. C", appointmentTime: "01:00 PM" },
  { appointmentId: "A004", patientName: "Bob Brown", doctorName: "Dr. D", appointmentTime: "02:15 PM" },
  { appointmentId: "A005", patientName: "Charlie White", doctorName: "Dr. E", appointmentTime: "03:45 PM" },
];

const Appointment = () => {
  const [search, setSearch] = useState("");
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedRow, setSelectedRow] = useState(null);

  const handleMenuClick = (event, row) => {
    setAnchorEl(event.currentTarget);
    setSelectedRow(row);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedRow(null);
  };

  const handleSearchChange = (event) => {
    setSearch(event.target.value);
  };

  const filteredAppointments = tableData.filter((appointment) =>
    appointment.patientName.toLowerCase().includes(search.toLowerCase())
  );

  const tableRows = filteredAppointments.map((appointment) => ({
    appointmentId: appointment.appointmentId,
    patientName: appointment.patientName,
    doctorName: appointment.doctorName,
    appointmentTime: appointment.appointmentTime,
    Action: (
      <>
        <IconButton onClick={(event) => handleMenuClick(event, appointment)}>
          <MoreVert />
        </IconButton>
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
        >
          <MenuItem onClick={handleMenuClose}>Details</MenuItem>
          <MenuItem onClick={handleMenuClose}>Delete</MenuItem>
        </Menu>
      </>
    ),
  }));

  return (
    <div className="p-2">
      <div className="w-1/4 mx-auto p-3">
        <TextField
          label={null} // or label=""
          variant="outlined"
          placeholder="Search..."
          fullWidth
          margin="normal"
          value={search}
          onChange={handleSearchChange}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search />
              </InputAdornment>
            ),
          }}
          sx={{
            '& .MuiOutlinedInput-root': {
              borderRadius: '8px', 
              boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
            },
          }}
        />
      </div>

      <MuiTable
        th={tableHeaders}
        td={tableRows}
        styleTableContainer={{ boxShadow: "none", borderRadius: "10px" }}
        styleTableThead={{ backgroundColor: "#F8F9FA" }}
        styleTableTh={{ fontWeight: "bold", color: "#333", fontSize: "16px" }}
        styleTableTbody={{ backgroundColor: "#FFFFFF" }}
        rowStyles={{ backgroundColor: "#FFFFFF", fontSize: "16px", color: "#333" }}
        headerRounded={true}
        rowRounded={true}
      />
    </div>
  );
};

export default Appointment;
