import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Grid,
  Avatar,
  Typography,
  Divider,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  Chip,
} from "@mui/material";
import { 
  LocalHospital, 
  Email, 
  Phone, 
  LocationOn, 
  AccessTime,
  Bloodtype,
  Language
} from "@mui/icons-material";

const bloodTypes = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

const BloodBankForm = ({ open, onClose, onSubmit, initialData }) => {
  const [formData, setFormData] = useState({
    organizationName: "",
    location: "",
    contact: "",
    email: "",
    website: "",
    city: "",
    state: "",
    zipCode: "",
    bloodInventory: Object.fromEntries(bloodTypes.map(type => [type, 0])),
    operatingHours: Object.fromEntries(days.map(day => [day, { open: "", close: "", closed: false }])),
    emergencyContact: "",
    facilities: [],
    latitude: "",
    longitude: ""
  });

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    }
  }, [initialData]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleBloodInventoryChange = (type, value) => {
    setFormData({
      ...formData,
      bloodInventory: {
        ...formData.bloodInventory,
        [type]: parseInt(value) || 0
      }
    });
  };

  const handleOperatingHoursChange = (day, field, value) => {
    setFormData({
      ...formData,
      operatingHours: {
        ...formData.operatingHours,
        [day]: {
          ...formData.operatingHours[day],
          [field]: value
        }
      }
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.organizationName || !formData.location || !formData.contact || !formData.email) {
      return;
    }
    onSubmit(formData);
    handleReset();
  };

  const handleReset = () => {
    setFormData({
      organizationName: "",
      location: "",
      contact: "",
      email: "",
      website: "",
      city: "",
      state: "",
      zipCode: "",
      bloodInventory: Object.fromEntries(bloodTypes.map(type => [type, 0])),
      operatingHours: Object.fromEntries(days.map(day => [day, { open: "", close: "", closed: false }])),
      emergencyContact: "",
      facilities: [],
      latitude: "",
      longitude: ""
    });
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleReset} maxWidth="md" fullWidth>
      <DialogTitle sx={{ bgcolor: "primary.main", color: "white" }}>
        <Grid container alignItems="center" spacing={2}>
          <Grid item>
            <Avatar sx={{ bgcolor: "white" }}>
              <LocalHospital color="primary" />
            </Avatar>
          </Grid>
          <Grid item>
            <Typography variant="h6">
              {initialData ? "Edit Blood Bank" : "New Blood Bank"}
            </Typography>
          </Grid>
        </Grid>
      </DialogTitle>
      
      <Divider />

      <DialogContent sx={{ py: 4 }}>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            {/* Basic Information */}
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>Basic Information</Typography>
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Organization Name"
                name="organizationName"
                value={formData.organizationName}
                onChange={handleChange}
                required
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LocalHospital color="action" />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Website"
                name="website"
                value={formData.website}
                onChange={handleChange}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Language color="action" />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>

            {/* Contact Information */}
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>Contact Information</Typography>
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Contact Number"
                name="contact"
                value={formData.contact}
                onChange={handleChange}
                required
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Phone color="action" />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Emergency Contact"
                name="emergencyContact"
                value={formData.emergencyContact}
                onChange={handleChange}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Phone color="action" />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Email Address"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                required
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Email color="action" />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>

            {/* Location Information */}
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>Location Information</Typography>
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Street Address"
                name="location"
                value={formData.location}
                onChange={handleChange}
                required
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LocationOn color="action" />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>

            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="City"
                name="city"
                value={formData.city}
                onChange={handleChange}
                required
              />
            </Grid>

            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="State"
                name="state"
                value={formData.state}
                onChange={handleChange}
                required
              />
            </Grid>

            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="ZIP Code"
                name="zipCode"
                value={formData.zipCode}
                onChange={handleChange}
                required
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Latitude"
                name="latitude"
                value={formData.latitude}
                onChange={handleChange}
                type="number"
                inputProps={{ step: "any" }}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Longitude"
                name="longitude"
                value={formData.longitude}
                onChange={handleChange}
                type="number"
                inputProps={{ step: "any" }}
              />
            </Grid>

            {/* Blood Inventory */}
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>Blood Inventory</Typography>
            </Grid>

            {bloodTypes.map((type) => (
              <Grid item xs={6} sm={3} key={type}>
                <TextField
                  fullWidth
                  label={`${type} Units`}
                  value={formData.bloodInventory[type]}
                  onChange={(e) => handleBloodInventoryChange(type, e.target.value)}
                  type="number"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Bloodtype color="action" />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
            ))}

            {/* Operating Hours */}
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>Operating Hours</Typography>
            </Grid>

            {days.map((day) => (
              <Grid item xs={12} key={day} container spacing={2} alignItems="center">
                <Grid item xs={12} sm={3}>
                  <Typography>{day}</Typography>
                </Grid>
                <Grid item xs={12} sm={3}>
                  <TextField
                    fullWidth
                    label="Open"
                    type="time"
                    value={formData.operatingHours[day].open}
                    onChange={(e) => handleOperatingHoursChange(day, 'open', e.target.value)}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <AccessTime color="action" />
                        </InputAdornment>
                      ),
                    }}
                    inputProps={{ step: 300 }}
                    disabled={formData.operatingHours[day].closed}
                  />
                </Grid>
                <Grid item xs={12} sm={3}>
                  <TextField
                    fullWidth
                    label="Close"
                    type="time"
                    value={formData.operatingHours[day].close}
                    onChange={(e) => handleOperatingHoursChange(day, 'close', e.target.value)}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <AccessTime color="action" />
                        </InputAdornment>
                      ),
                    }}
                    inputProps={{ step: 300 }}
                    disabled={formData.operatingHours[day].closed}
                  />
                </Grid>
                <Grid item xs={12} sm={3}>
                  <Button
                    variant={formData.operatingHours[day].closed ? "contained" : "outlined"}
                    color={formData.operatingHours[day].closed ? "error" : "primary"}
                    onClick={() => handleOperatingHoursChange(day, 'closed', !formData.operatingHours[day].closed)}
                  >
                    {formData.operatingHours[day].closed ? "Closed" : "Open"}
                  </Button>
                </Grid>
              </Grid>
            ))}
          </Grid>
        </form>
      </DialogContent>

      <DialogActions sx={{ px: 3, py: 2 }}>
        <Button onClick={handleReset} color="secondary" variant="outlined">
          Cancel
        </Button>
        <Button 
          onClick={handleSubmit} 
          color="primary" 
          variant="contained"
          disabled={!formData.organizationName || !formData.location || !formData.contact || !formData.email}
        >
          {initialData ? "Update" : "Create"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default BloodBankForm;
