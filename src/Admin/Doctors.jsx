import React, { useState, useEffect } from "react";
import {
  collection,
  query,
  onSnapshot,
  updateDoc,
  doc,
  setDoc,
  serverTimestamp,
} from "firebase/firestore";
import axios from 'axios';
import { db } from "../firebase"; // Your Firebase configuration file
import {
  Container,
  Box,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Snackbar,
  Alert,
  Chip,
  CircularProgress,
  useTheme,
  Avatar,
  IconButton,
  Tooltip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Collapse,
  Grid,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
} from "@mui/material";
import {
  Expand as ExpandIcon,
  CheckCircle,
  Cancel,
  Edit,
} from "@mui/icons-material";

const AdminDoctorsDashboard = () => {
  const theme = useTheme();
  const [doctors, setDoctors] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [remarks, setRemarks] = useState("");
  const [openRejectDialog, setOpenRejectDialog] = useState(false);
  const [openStatusDialog, setOpenStatusDialog] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const [loading, setLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  // For status update dialog
  const [newStatus, setNewStatus] = useState("");
  const [statusRemarks, setStatusRemarks] = useState("");

  // Fetch doctors data in real-time
  useEffect(() => {
    const q = query(collection(db, "doctors"));
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const docs = [];
        snapshot.forEach((docSnap) => {
          docs.push({ id: docSnap.id, ...docSnap.data() });
        });
        setDoctors(docs);
      },
      (error) => {
        console.error("Error fetching doctors:", error);
        setSnackbar({
          open: true,
          message: "Error fetching doctors",
          severity: "error",
        });
      }
    );
    return () => unsubscribe();
  }, []);

  // ---------- Rejection Dialog Handlers ----------
  const handleOpenRejectDialog = (doctor) => {
    setSelectedDoctor(doctor);
    setOpenRejectDialog(true);
  };

  const handleCloseRejectDialog = () => {
    setSelectedDoctor(null);
    setRemarks("");
    setOpenRejectDialog(false);
  };

  const submitRejection = async () => {
    if (!selectedDoctor) return;
    setLoading(true);
    try {
      await updateDoc(doc(db, "doctors", selectedDoctor.id), {
        status: "rejected",
        rejectionRemarks: remarks,
      });

      // Create notification for rejection
      const notification = {
        userId: selectedDoctor.id,
        email: selectedDoctor.email,
        message: `Your application was rejected. Remarks: ${remarks}`,
        type: "statusUpdate",
        read: false,
        createdAt: serverTimestamp(),
      };
      
      await setDoc(doc(collection(db, "notifications")), notification);
      await axios.post('http://localhost:3000/api/send-notification', notification);


      setSnackbar({
        open: true,
        message: "Doctor rejected successfully",
        severity: "info",
      });
      handleCloseRejectDialog();
    } catch (error) {
      console.error("Error rejecting doctor: ", error);
      setSnackbar({
        open: true,
        message: "Error rejecting doctor",
        severity: "error",
      });
    }
    setLoading(false);
  };

  // ---------- Approval Handler ----------
  const handleApprove = async (doctor) => {
    setLoading(true);
    try {
      await updateDoc(doc(db, "doctors", doctor.id), { status: "approved" });

      // Create notification for approval
      const notification = {
        userId: doctor.id,
        email: doctor.email,
        message: "Your account has been approved! You can now start accepting appointments.",
        type: "statusUpdate",
        read: false,
        createdAt: serverTimestamp(),
      };
      
      await setDoc(doc(collection(db, "notifications")), notification);
      await axios.post('http://localhost:3000/api/send-notification', notification);


      setSnackbar({
        open: true,
        message: "Doctor approved successfully",
        severity: "success",
      });
    } catch (error) {
      console.error("Error approving doctor: ", error);
      setSnackbar({
        open: true,
        message: "Error approving doctor",
        severity: "error",
      });
    }
    setLoading(false);
  };

  // ---------- Update Status Dialog Handlers ----------
  const handleOpenStatusDialog = (doctor) => {
    setSelectedDoctor(doctor);
    setNewStatus(doctor.status);
    setStatusRemarks("");
    setOpenStatusDialog(true);
  };

  const handleCloseStatusDialog = () => {
    setSelectedDoctor(null);
    setNewStatus("");
    setStatusRemarks("");
    setOpenStatusDialog(false);
  };

  const submitStatusUpdate = async () => {
    if (!selectedDoctor) return;
    setLoading(true);
    try {
      const updateData = { status: newStatus };
      if (newStatus === "rejected") {
        updateData.rejectionRemarks = statusRemarks;
      } else {
        updateData.rejectionRemarks = ""; // Clear remarks if not rejected
      }
      await updateDoc(doc(db, "doctors", selectedDoctor.id), updateData);

      // Create notification for status update
      const notification = {
        userId: selectedDoctor.id,
        email: selectedDoctor.email,
        message: `Your account status has been updated to "${newStatus}"${
          newStatus === "rejected" ? `. Remarks: ${statusRemarks}` : ""
        }`,
        type: "statusUpdate",
        read: false,
        createdAt: serverTimestamp(),
      };
      
      await setDoc(doc(collection(db, "notifications")), notification);
      await axios.post('http://localhost:3000/api/send-notification', notification);


      setSnackbar({
        open: true,
        message: "Doctor status updated successfully",
        severity: "success",
      });
      handleCloseStatusDialog();
    } catch (error) {
      console.error("Error updating status: ", error);
      setSnackbar({
        open: true,
        message: "Error updating status",
        severity: "error",
      });
    }
    setLoading(false);
  };

  // ---------- Snackbar Handler ----------
  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  // ---------- Status Chip ----------
  const getStatusChip = (status) => {
    const statusColors = {
      pending: { bg: "#ffd70033", text: "#ffd700" },
      approved: { bg: "#00ff0033", text: "#00ff00" },
      rejected: { bg: "#ff000033", text: "#ff0000" },
    };

    return (
      <Chip
        label={status}
        sx={{
          backgroundColor: statusColors[status]?.bg,
          color: statusColors[status]?.text,
          fontWeight: 600,
          textTransform: "uppercase",
          letterSpacing: 0.5,
        }}
      />
    );
  };

  return (
    <Container maxWidth="xl" sx={{ py: 4, background: theme.palette.background.default }}>
      <Typography
        variant="h3"
        align="center"
        gutterBottom
        sx={{
          color: theme.palette.text.primary,
          fontWeight: 700,
          mb: 6,
          textShadow: "0 2px 4px rgba(0,0,0,0.1)",
        }}
      >
        Doctors Management
      </Typography>

      <TableContainer component={Paper} sx={{ boxShadow: theme.shadows[4] }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell />
              <TableCell>Avatar</TableCell>
              <TableCell>Full Name</TableCell>
              <TableCell>Username</TableCell>
              <TableCell>Specialization</TableCell>
              <TableCell>Experience</TableCell>
              <TableCell>Location</TableCell>
              <TableCell>Contact</TableCell>
              <TableCell>Status</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {doctors.map((doctor) => (
              <DoctorRow
                key={doctor.id}
                doctor={doctor}
                onApprove={handleApprove}
                onReject={handleOpenRejectDialog}
                onUpdateStatus={handleOpenStatusDialog}
                loading={loading}
                getStatusChip={getStatusChip}
                setSelectedImage={setSelectedImage}
              />
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Rejection Dialog */}
      <Dialog open={openRejectDialog} onClose={handleCloseRejectDialog} fullWidth maxWidth="sm">
        <DialogTitle sx={{ bgcolor: theme.palette.background.paper }}>Reject Application</DialogTitle>
        <DialogContent sx={{ bgcolor: theme.palette.background.paper }}>
          <Typography variant="body1" sx={{ mb: 2 }}>
            Rejecting application for <strong>Dr. {selectedDoctor?.fullName}</strong>
          </Typography>
          <TextField
            fullWidth
            multiline
            minRows={4}
            variant="outlined"
            label="Rejection Remarks"
            value={remarks}
            onChange={(e) => setRemarks(e.target.value)}
            sx={{ mb: 2 }}
          />
        </DialogContent>
        <DialogActions sx={{ bgcolor: theme.palette.background.paper }}>
          <Button onClick={handleCloseRejectDialog} color="inherit">
            Cancel
          </Button>
          <Button onClick={submitRejection} color="error" variant="contained" disabled={!remarks || loading}>
            {loading ? <CircularProgress size={24} /> : "Confirm Rejection"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Update Status Dialog */}
      <Dialog open={openStatusDialog} onClose={handleCloseStatusDialog} fullWidth maxWidth="sm">
        <DialogTitle sx={{ bgcolor: theme.palette.background.paper }}>Update Status</DialogTitle>
        <DialogContent sx={{ bgcolor: theme.palette.background.paper }}>
          <Typography variant="body1" sx={{ mb: 2 }}>
            Updating status for <strong>Dr. {selectedDoctor?.fullName}</strong>
          </Typography>
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel id="status-select-label">Status</InputLabel>
            <Select
              labelId="status-select-label"
              label="Status"
              value={newStatus}
              onChange={(e) => setNewStatus(e.target.value)}
            >
              <MenuItem value="pending">Pending</MenuItem>
              <MenuItem value="approved">Approved</MenuItem>
              <MenuItem value="rejected">Rejected</MenuItem>
            </Select>
          </FormControl>
          {newStatus === "rejected" && (
            <TextField
              fullWidth
              multiline
              minRows={3}
              variant="outlined"
              label="Rejection Remarks"
              value={statusRemarks}
              onChange={(e) => setStatusRemarks(e.target.value)}
            />
          )}
        </DialogContent>
        <DialogActions sx={{ bgcolor: theme.palette.background.paper }}>
          <Button onClick={handleCloseStatusDialog} color="inherit">
            Cancel
          </Button>
          <Button
            onClick={submitStatusUpdate}
            color="primary"
            variant="contained"
            disabled={newStatus === "rejected" && !statusRemarks || loading}
          >
            {loading ? <CircularProgress size={24} /> : "Update Status"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert severity={snackbar.severity} sx={{ width: "100%", boxShadow: theme.shadows[6], alignItems: "center" }}>
          {snackbar.message}
        </Alert>
      </Snackbar>

      {/* Image Preview Dialog */}
      <Dialog open={Boolean(selectedImage)} onClose={() => setSelectedImage(null)} maxWidth="md">
        <img src={selectedImage} alt="Document Preview" style={{ width: "100%", height: "auto" }} />
      </Dialog>
    </Container>
  );
};

// Collapsible Table Row Component for Each Doctor
const DoctorRow = (props) => {
  const { doctor, onApprove, onReject, onUpdateStatus, loading, getStatusChip, setSelectedImage } = props;
  const [open, setOpen] = useState(false);
  const theme = useTheme();

  return (
    <>
      <TableRow hover>
        <TableCell>
          <IconButton size="small" onClick={() => setOpen(!open)}>
            <ExpandIcon
              sx={{
                transform: open ? "rotate(180deg)" : "rotate(0deg)",
                transition: "transform 0.3s",
              }}
            />
          </IconButton>
        </TableCell>
        <TableCell>
          <Avatar src={doctor.profilePicture || "/default-avatar.png"} alt={doctor.fullName} />
        </TableCell>
        <TableCell>{doctor.fullName}</TableCell>
        <TableCell>{doctor.username}</TableCell>
        <TableCell>{doctor.specialist}</TableCell>
        <TableCell>{doctor.experience} yrs</TableCell>
        <TableCell>
          {doctor.city}, {doctor.address}
        </TableCell>
        <TableCell>{doctor.contactNo}</TableCell>
        <TableCell>{getStatusChip(doctor.status)}</TableCell>
        <TableCell align="right">
          <Tooltip title="Approve Application">
            <IconButton color="success" onClick={() => onApprove(doctor)} disabled={loading}>
              {loading ? <CircularProgress size={24} /> : <CheckCircle fontSize="large" />}
            </IconButton>
          </Tooltip>
          <Tooltip title="Reject Application">
            <IconButton color="error" onClick={() => onReject(doctor)} disabled={loading}>
              <Cancel fontSize="large" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Update Status">
            <IconButton color="primary" onClick={() => onUpdateStatus(doctor)} disabled={loading}>
              <Edit fontSize="large" />
            </IconButton>
          </Tooltip>
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={10}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box margin={1}>
              <Typography variant="subtitle2" gutterBottom>
                Documents Verification
              </Typography>
              <Grid container spacing={2}>
                <DocumentThumbnail
                  src={doctor.governmentID}
                  label="Government ID"
                  onClick={() => setSelectedImage(doctor.governmentID)}
                />
                <DocumentThumbnail
                  src={doctor.medicalLicenseCertificate}
                  label="Medical License"
                  onClick={() => setSelectedImage(doctor.medicalLicenseCertificate)}
                />
                <DocumentThumbnail
                  src={doctor.degreeCertificate}
                  label="Degree Certificate"
                  onClick={() => setSelectedImage(doctor.degreeCertificate)}
                />
              </Grid>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  );
};

// Reusable Document Thumbnail Component
const DocumentThumbnail = ({ src, label, onClick }) => (
  <Grid item xs={4} sm={3} md={2}>
    <Box
      sx={{
        position: "relative",
        borderRadius: 2,
        overflow: "hidden",
        cursor: "pointer",
        "&:hover .expand-overlay": {
          opacity: 1,
        },
      }}
      onClick={onClick}
    >
      <img src={src || "/document-placeholder.png"} alt={label} style={{ width: "100%", height: 100, objectFit: "cover" }} />
      <Box
        className="expand-overlay"
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          bgcolor: "rgba(0,0,0,0.5)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          opacity: 0,
          transition: "opacity 0.3s",
        }}
      >
        <ExpandIcon sx={{ color: "white", fontSize: 32 }} />
      </Box>
    </Box>
    <Typography variant="caption" display="block" align="center" sx={{ mt: 0.5 }}>
      {label}
    </Typography>
  </Grid>
);

export default AdminDoctorsDashboard;
