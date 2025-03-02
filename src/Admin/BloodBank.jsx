import React, { useState, useEffect } from "react";
import {
  Fade,
  Box,
  Fab,
  Dialog,
  DialogTitle,
  DialogContent,
  Button,
  Snackbar,
  Alert,
  IconButton,
  Typography,
  Grid,
  Paper,
  Chip,
  Tooltip,
} from "@mui/material";
import { Add, Delete, Edit, Visibility, Bloodtype, AccessTime, LocationOn } from "@mui/icons-material";
import { db } from "../firebase";
import { collection, getDocs, addDoc, doc, updateDoc, deleteDoc } from "firebase/firestore";
import BloodBankForm from "./BloodBankForm";
import EnhancedTable from "./EnhancedTable";

const BloodBank = () => {
  const [bloodBanks, setBloodBanks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openForm, setOpenForm] = useState(false);
  const [selectedBank, setSelectedBank] = useState(null);
  const [viewDetails, setViewDetails] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });

  const columns = [
    { id: "organizationName", label: "Organization Name", minWidth: 200 },
    { 
      id: "location", 
      label: "Location", 
      minWidth: 200,
      render: (row) => (
        <Typography variant="body2">
          {`${row.location}, ${row.city}, ${row.state} ${row.zipCode}`}
        </Typography>
      )
    },
    { 
      id: "bloodInventory", 
      label: "Available Blood Types", 
      minWidth: 200,
      render: (row) => (
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
          {Object.entries(row.bloodInventory || {}).map(([type, units]) => (
            units > 0 && (
              <Chip
                key={type}
                label={`${type}: ${units}`}
                size="small"
                color="error"
                icon={<Bloodtype />}
              />
            )
          ))}
        </Box>
      )
    },
    { id: "contact", label: "Contact", minWidth: 150 },
    {
      id: "actions",
      label: "Actions",
      minWidth: 150,
      align: "right",
      render: (row) => (
        <>
          <Tooltip title="View Details">
            <IconButton onClick={() => handleView(row)} color="primary">
              <Visibility />
            </IconButton>
          </Tooltip>
          <Tooltip title="Edit">
            <IconButton onClick={() => handleEdit(row)} color="secondary">
              <Edit />
            </IconButton>
          </Tooltip>
          <Tooltip title="Delete">
            <IconButton onClick={() => handleDelete(row.id)} color="error">
              <Delete />
            </IconButton>
          </Tooltip>
        </>
      )
    }
  ];

  useEffect(() => {
    const fetchBloodBanks = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "bloodbanks"));
        const data = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setBloodBanks(data);
        setLoading(false);
      } catch (error) {
        setSnackbar({ open: true, message: "Error fetching data", severity: "error" });
        setLoading(false);
      }
    };

    fetchBloodBanks();
  }, []);

  const handleEdit = (row) => {
    setSelectedBank(row);
    setOpenForm(true);
  };

  const handleView = (row) => {
    setViewDetails(row);
  };

  const handleCreate = async (data) => {
    try {
      const docRef = await addDoc(collection(db, "bloodbanks"), data);
      setBloodBanks([...bloodBanks, { ...data, id: docRef.id }]);
      setSnackbar({ open: true, message: "Blood bank created successfully!", severity: "success" });
    } catch (error) {
      setSnackbar({ open: true, message: "Error creating blood bank", severity: "error" });
    }
    setOpenForm(false);
  };

  const handleUpdate = async (data) => {
    try {
      await updateDoc(doc(db, "bloodbanks", selectedBank.id), data);
      setBloodBanks(bloodBanks.map(bank => bank.id === selectedBank.id ? { ...data, id: selectedBank.id } : bank));
      setSnackbar({ open: true, message: "Blood bank updated successfully!", severity: "success" });
    } catch (error) {
      setSnackbar({ open: true, message: "Error updating blood bank", severity: "error" });
    }
    setSelectedBank(null);
    setOpenForm(false);
  };

  const handleDelete = async (id) => {
    try {
      await deleteDoc(doc(db, "bloodbanks", id));
      setBloodBanks(bloodBanks.filter(bank => bank.id !== id));
      setSnackbar({ open: true, message: "Blood bank deleted successfully!", severity: "success" });
    } catch (error) {
      setSnackbar({ open: true, message: "Error deleting blood bank", severity: "error" });
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  return (
    <Fade in timeout={500}>
      <Box sx={{ p: 3, background: "linear-gradient(45deg, #f3f4f6 30%, #f8f9fa 90%)", minHeight: "100vh" }}>
        <Box sx={{ maxWidth: 1200, margin: "0 auto" }}>
          <EnhancedTable
            columns={columns}
            rows={bloodBanks}
            loading={loading}
            sx={{
              borderRadius: 4,
              boxShadow: 3,
              overflow: "hidden",
              "& .MuiTableCell-root": { py: 1.5 }
            }}
          />

          <Fab
            color="primary"
            sx={{ position: "fixed", bottom: 32, right: 32 }}
            onClick={() => setOpenForm(true)}
          >
            <Add />
          </Fab>

          <BloodBankForm
            open={openForm}
            onClose={() => {
              setOpenForm(false);
              setSelectedBank(null);
            }}
            onSubmit={selectedBank ? handleUpdate : handleCreate}
            initialData={selectedBank}
          />

          <Dialog 
            open={Boolean(viewDetails)} 
            onClose={() => setViewDetails(null)}
            maxWidth="md"
            fullWidth
          >
            {viewDetails && (
              <>
                <DialogTitle sx={{ bgcolor: "primary.main", color: "white" }}>
                  {viewDetails.organizationName}
                </DialogTitle>
                <DialogContent>
                  <Grid container spacing={3} sx={{ mt: 1 }}>
                    {/* Location Information */}
                    <Grid item xs={12}>
                      <Paper elevation={2} sx={{ p: 2 }}>
                        <Typography variant="h6" gutterBottom>
                          <LocationOn sx={{ mr: 1, verticalAlign: 'middle' }} />
                          Location Details
                        </Typography>
                        <Typography>
                          {viewDetails.location}<br />
                          {viewDetails.city}, {viewDetails.state} {viewDetails.zipCode}
                        </Typography>
                        {viewDetails.latitude && viewDetails.longitude && (
                          <Typography variant="body2" color="textSecondary">
                            Coordinates: {viewDetails.latitude}, {viewDetails.longitude}
                          </Typography>
                        )}
                      </Paper>
                    </Grid>

                    {/* Blood Inventory */}
                    <Grid item xs={12}>
                      <Paper elevation={2} sx={{ p: 2 }}>
                        <Typography variant="h6" gutterBottom>
                          <Bloodtype sx={{ mr: 1, verticalAlign: 'middle' }} />
                          Blood Inventory
                        </Typography>
                        <Grid container spacing={1}>
                          {Object.entries(viewDetails.bloodInventory || {}).map(([type, units]) => (
                            <Grid item key={type}>
                              <Chip
                                label={`${type}: ${units} units`}
                                color={units > 0 ? "error" : "default"}
                                variant={units > 0 ? "filled" : "outlined"}
                              />
                            </Grid>
                          ))}
                        </Grid>
                      </Paper>
                    </Grid>

                    {/* Operating Hours */}
                    <Grid item xs={12}>
                      <Paper elevation={2} sx={{ p: 2 }}>
                        <Typography variant="h6" gutterBottom>
                          <AccessTime sx={{ mr: 1, verticalAlign: 'middle' }} />
                          Operating Hours
                        </Typography>
                        <Grid container spacing={2}>
                          {Object.entries(viewDetails.operatingHours || {}).map(([day, hours]) => (
                            <Grid item xs={12} sm={6} md={4} key={day}>
                              <Typography variant="subtitle2">{day}</Typography>
                              <Typography variant="body2" color="textSecondary">
                                {hours.closed ? 'Closed' : `${hours.open} - ${hours.close}`}
                              </Typography>
                            </Grid>
                          ))}
                        </Grid>
                      </Paper>
                    </Grid>

                    {/* Contact Information */}
                    <Grid item xs={12}>
                      <Paper elevation={2} sx={{ p: 2 }}>
                        <Typography variant="h6" gutterBottom>Contact Information</Typography>
                        <Grid container spacing={2}>
                          <Grid item xs={12} sm={6}>
                            <Typography variant="subtitle2">Primary Contact</Typography>
                            <Typography>{viewDetails.contact}</Typography>
                          </Grid>
                          {viewDetails.emergencyContact && (
                            <Grid item xs={12} sm={6}>
                              <Typography variant="subtitle2">Emergency Contact</Typography>
                              <Typography>{viewDetails.emergencyContact}</Typography>
                            </Grid>
                          )}
                          <Grid item xs={12}>
                            <Typography variant="subtitle2">Email</Typography>
                            <Typography>{viewDetails.email}</Typography>
                          </Grid>
                          {viewDetails.website && (
                            <Grid item xs={12}>
                              <Typography variant="subtitle2">Website</Typography>
                              <Typography>{viewDetails.website}</Typography>
                            </Grid>
                          )}
                        </Grid>
                      </Paper>
                    </Grid>
                  </Grid>
                </DialogContent>
              </>
            )}
          </Dialog>

          <Snackbar
            open={snackbar.open}
            autoHideDuration={4000}
            onClose={handleCloseSnackbar}
            anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
          >
            <Alert severity={snackbar.severity} sx={{ width: "100%" }}>
              {snackbar.message}
            </Alert>
          </Snackbar>
        </Box>
      </Box>
    </Fade>
  );
};

export default BloodBank;
