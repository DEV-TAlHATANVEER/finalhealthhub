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
import { db } from "../firebase";
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

const AdminLabsDashboard = () => {
  const theme = useTheme();
  const [labs, setLabs] = useState([]);
  const [selectedLab, setSelectedLab] = useState(null);
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
  const [newStatus, setNewStatus] = useState("");
  const [statusRemarks, setStatusRemarks] = useState("");

  // Fetch labs data in real-time
  useEffect(() => {
    const q = query(collection(db, "labs"));
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const docs = [];
        snapshot.forEach((docSnap) => {
          docs.push({ id: docSnap.id, ...docSnap.data() });
        });
        setLabs(docs);
      },
      (error) => {
        console.error("Error fetching labs:", error);
        setSnackbar({
          open: true,
          message: "Error fetching labs",
          severity: "error",
        });
      }
    );
    return () => unsubscribe();
  }, []);

  // Rejection Dialog Handlers
  const handleOpenRejectDialog = (lab) => {
    setSelectedLab(lab);
    setOpenRejectDialog(true);
  };

  const handleCloseRejectDialog = () => {
    setSelectedLab(null);
    setRemarks("");
    setOpenRejectDialog(false);
  };

  const submitRejection = async () => {
    if (!selectedLab) return;
    setLoading(true);
    try {
      await updateDoc(doc(db, "labs", selectedLab.id), {
        status: "rejected",
        rejectionRemarks: remarks,
      });

      // Create notification for rejection
      const notification = {
        userId: selectedLab.id,
        email: selectedLab.email,
        message: `Your lab application was rejected. Remarks: ${remarks}`,
        type: "statusUpdate",
        read: false,
        createdAt: serverTimestamp(),
      };
      
      await setDoc(doc(collection(db, "notifications")), notification);

      setSnackbar({
        open: true,
        message: "Lab rejected successfully",
        severity: "info",
      });
      handleCloseRejectDialog();
    } catch (error) {
      console.error("Error rejecting lab: ", error);
      setSnackbar({
        open: true,
        message: "Error rejecting lab",
        severity: "error",
      });
    }
    setLoading(false);
  };

  // Approval Handler
  const handleApprove = async (lab) => {
    setLoading(true);
    try {
      await updateDoc(doc(db, "labs", lab.id), { status: "approved" });

      // Create notification for approval
      const notification = {
        userId: lab.id,
        email: lab.email,
        message: "Your lab has been approved! You can now start accepting test requests.",
        type: "statusUpdate",
        read: false,
        createdAt: serverTimestamp(),
      };
      
      await setDoc(doc(collection(db, "notifications")), notification);

      setSnackbar({
        open: true,
        message: "Lab approved successfully",
        severity: "success",
      });
    } catch (error) {
      console.error("Error approving lab: ", error);
      setSnackbar({
        open: true,
        message: "Error approving lab",
        severity: "error",
      });
    }
    setLoading(false);
  };

  // Update Status Dialog Handlers
  const handleOpenStatusDialog = (lab) => {
    setSelectedLab(lab);
    setNewStatus(lab.status);
    setStatusRemarks("");
    setOpenStatusDialog(true);
  };

  const handleCloseStatusDialog = () => {
    setSelectedLab(null);
    setNewStatus("");
    setStatusRemarks("");
    setOpenStatusDialog(false);
  };

  const submitStatusUpdate = async () => {
    if (!selectedLab) return;
    setLoading(true);
    try {
      const updateData = { status: newStatus };
      if (newStatus === "rejected") {
        updateData.rejectionRemarks = statusRemarks;
      } else {
        updateData.rejectionRemarks = "";
      }
      await updateDoc(doc(db, "labs", selectedLab.id), updateData);

      // Create notification for status update
      const notification = {
        userId: selectedLab.id,
        email: selectedLab.email,
        message: `Your lab status has been updated to "${newStatus}"${
          newStatus === "rejected" ? `. Remarks: ${statusRemarks}` : ""
        }`,
        type: "statusUpdate",
        read: false,
        createdAt: serverTimestamp(),
      };
      
      await setDoc(doc(collection(db, "notifications")), notification);

      setSnackbar({
        open: true,
        message: "Lab status updated successfully",
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

  // Snackbar Handler
  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  // Status Chip
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
        Labs Management
      </Typography>

      <TableContainer component={Paper} sx={{ boxShadow: theme.shadows[4] }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell />
              <TableCell>Logo</TableCell>
              <TableCell>Lab Name</TableCell>
              <TableCell>Type</TableCell>
              <TableCell>Location</TableCell>
              <TableCell>Contact</TableCell>
              <TableCell>Status</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {labs.map((lab) => (
              <LabRow
                key={lab.id}
                lab={lab}
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
            Rejecting application for <strong>{selectedLab?.labName}</strong>
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
            Updating status for <strong>{selectedLab?.labName}</strong>
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

// Collapsible Table Row Component for Each Lab
const LabRow = (props) => {
  const { lab, onApprove, onReject, onUpdateStatus, loading, getStatusChip, setSelectedImage } = props;
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
          <Avatar src={lab.labPhotos || "/default-lab.png"} alt={lab.labName} />
        </TableCell>
        <TableCell>{lab.labName}</TableCell>
        <TableCell>{lab.labType}</TableCell>
        <TableCell>{lab.city}</TableCell>
        <TableCell>{lab.phone}</TableCell>
        <TableCell>{getStatusChip(lab.status)}</TableCell>
        <TableCell align="right">
          <Tooltip title="Approve Application">
            <IconButton color="success" onClick={() => onApprove(lab)} disabled={loading}>
              {loading ? <CircularProgress size={24} /> : <CheckCircle fontSize="large" />}
            </IconButton>
          </Tooltip>
          <Tooltip title="Reject Application">
            <IconButton color="error" onClick={() => onReject(lab)} disabled={loading}>
              <Cancel fontSize="large" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Update Status">
            <IconButton color="primary" onClick={() => onUpdateStatus(lab)} disabled={loading}>
              <Edit fontSize="large" />
            </IconButton>
          </Tooltip>
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={8}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box margin={1}>
              <Typography variant="subtitle2" gutterBottom>
                Documents Verification
              </Typography>
              <Grid container spacing={2}>
                <DocumentThumbnail
                  src={lab.labLicenseCertificate}
                  label="Lab License"
                  onClick={() => setSelectedImage(lab.labLicenseCertificate)}
                />
                <DocumentThumbnail
                  src={lab.registrationCertificate}
                  label="Registration Certificate"
                  onClick={() => setSelectedImage(lab.registrationCertificate)}
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

export default AdminLabsDashboard;
