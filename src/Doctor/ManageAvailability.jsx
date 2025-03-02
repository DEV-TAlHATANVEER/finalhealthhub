import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  Grid,
  Paper,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import { DateField, TimeField } from '../mui';
import { db, auth } from '../firebase';
import { collection, addDoc, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { format } from 'date-fns';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix leaflet marker icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Map click handler component
const MapClickHandler = ({ onMapClick }) => {
  useMapEvents({
    click: (e) => onMapClick(e.latlng),
  });
  return null;
};

// RecenterMap component: updates the map view when the center prop changes
const RecenterMap = ({ center }) => {
  const map = useMap();
  useEffect(() => {
    map.setView(center);
  }, [center, map]);
  return null;
};

// Main Component
const ManageAvailability = () => {
  const [date, setDate] = useState(null);
  const [startTime, setStartTime] = useState(null);
  const [endTime, setEndTime] = useState(null);
  const [mode, setMode] = useState('online');
  const [price, setPrice] = useState('');
  const [slotDuration, setSlotDuration] = useState('30');
  const [availabilities, setAvailabilities] = useState([]);
  const [selectedPosition, setSelectedPosition] = useState(null);
  const [mapCenter, setMapCenter] = useState([33.6844, 73.0479]); // Default center
  const [locationAddress, setLocationAddress] = useState(''); // For storing the address

  console.log(selectedPosition);

  useEffect(() => {
    fetchAvailabilities();
    // Get current location for map center
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setMapCenter([latitude, longitude]);
          if (!selectedPosition) {
            setSelectedPosition({ lat: latitude, lng: longitude });
          }
        },
        (error) => {
          console.error('Error getting location:', error);
        }
      );
    }
  }, []);

  const fetchAvailabilities = async () => {
    if (!auth.currentUser) return;
    try {
      const availabilitiesRef = collection(db, `doctors/${auth.currentUser.uid}/availabilities`);
      const querySnapshot = await getDocs(availabilitiesRef);
      const availabilityData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setAvailabilities(availabilityData);
    } catch (error) {
      console.error('Error fetching availabilities:', error);
    }
  };

  // Function to reverse geocode lat/lng to a human-readable address using Nominatim API
  const getAddressFromLatLng = async (lat, lng) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`
      );
      const data = await response.json();
      return data.display_name;
    } catch (error) {
      console.error('Error fetching address:', error);
      return null;
    }
  };

  const handleMapClick = async (latlng) => {
    if (mode === 'physical') {
      setSelectedPosition({ lat: latlng.lat, lng: latlng.lng });
      const address = await getAddressFromLatLng(latlng.lat, latlng.lng);
      setLocationAddress(address);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!date || !startTime || !endTime || !price) {
      alert('Please fill in all required fields');
      return;
    }

    if (mode === 'physical' && !selectedPosition) {
      alert('Please select a location for physical consultation');
      return;
    }

    if (!auth.currentUser) {
      alert('Please login first');
      return;
    }

    const startDateTime = new Date(date);
    startDateTime.setHours(startTime.getHours(), startTime.getMinutes());
    const endDateTime = new Date(date);
    endDateTime.setHours(endTime.getHours(), endTime.getMinutes());

    try {
      const availabilityRef = collection(db, `doctors/${auth.currentUser.uid}/availabilities`);
      await addDoc(availabilityRef, {
        date: date.toISOString(),
        startTime: startDateTime.toISOString(),
        endTime: endDateTime.toISOString(),
        mode: mode,
        price: parseFloat(price),
        location:
          mode === 'physical'
            ? { lat: selectedPosition.lat, lng: selectedPosition.lng, address: locationAddress }
            : null,
        slotDuration: parseInt(slotDuration),
        numberOfSlots: calculateSlots(startDateTime, endDateTime, slotDuration),
        createdAt: new Date().toISOString(),
      });

      alert('Availability added successfully!');
      setDate(null);
      setStartTime(null);
      setEndTime(null);
      setPrice('');
      setLocationAddress('');
      fetchAvailabilities();
    } catch (error) {
      console.error('Error adding availability:', error);
      alert('Error adding availability. Please try again.');
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteDoc(doc(db, `doctors/${auth.currentUser.uid}/availabilities`, id));
      alert('Availability deleted successfully!');
      fetchAvailabilities();
    } catch (error) {
      console.error('Error deleting availability:', error);
      alert('Error deleting availability. Please try again.');
    }
  };

  const formatDate = (dateString) => {
    try {
      return format(new Date(dateString), 'PP');
    } catch (error) {
      return 'Invalid date';
    }
  };

  const formatTime = (timeString) => {
    try {
      return format(new Date(timeString), 'p');
    } catch (error) {
      return 'Invalid time';
    }
  };

  const calculateSlots = (start, end, duration) => {
    const startTime = new Date(start);
    const endTime = new Date(end);
    const durationMinutes = parseInt(duration);
    const totalMinutes = (endTime - startTime) / (1000 * 60);
    return Math.floor(totalMinutes / durationMinutes);
  };

  const formatMode = (mode) => {
    if (!mode) return 'N/A';
    return mode.charAt(0).toUpperCase() + mode.slice(1);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Manage Availability
      </Typography>

      <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
        <Typography variant="h6" gutterBottom>
          Add New Availability
        </Typography>

        <Box component="form" onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={4}>
              <DateField
                label="Select Date"
                value={date}
                onChange={setDate}
                inputProps={{
                  min: new Date().toISOString().split('T')[0],
                }}
              />
            </Grid>

            <Grid item xs={12} md={4}>
              <TimeField label="Start Time" value={startTime} onChange={setStartTime} />
            </Grid>

            <Grid item xs={12} md={4}>
              <TimeField label="End Time" value={endTime} onChange={setEndTime} />
            </Grid>

            <Grid item xs={12} md={4}>
              <FormControl fullWidth>
                <InputLabel>Slot Duration (minutes)</InputLabel>
                <Select
                  value={slotDuration}
                  label="Slot Duration (minutes)"
                  onChange={(e) => setSlotDuration(e.target.value)}
                >
                  <MenuItem value="15">15 minutes</MenuItem>
                  <MenuItem value="30">30 minutes</MenuItem>
                  <MenuItem value="45">45 minutes</MenuItem>
                  <MenuItem value="60">60 minutes</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} md={4}>
              <FormControl fullWidth>
                <InputLabel>Consultation Mode</InputLabel>
                <Select
                  value={mode}
                  label="Consultation Mode"
                  onChange={(e) => setMode(e.target.value)}
                >
                  <MenuItem value="online">Online</MenuItem>
                  <MenuItem value="physical">Physical</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Price (Rs.)"
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                InputProps={{
                  inputProps: { min: 0 },
                }}
              />
            </Grid>

            {mode === 'physical' && (
              <Grid item xs={12}>
                <Typography variant="subtitle2" gutterBottom>
                  Click on the map to select your clinic location:
                </Typography>
                <div style={{ height: '300px', width: '100%', marginTop: '10px' }}>
                  <MapContainer center={mapCenter} zoom={13} style={{ height: '100%', width: '100%' }}>
                    <>
                      <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                      />
                      <RecenterMap center={mapCenter} />
                      <MapClickHandler onMapClick={handleMapClick} />
                      {selectedPosition && (
                        <Marker position={[selectedPosition.lat, selectedPosition.lng]}>
                          <Popup>
                            Selected Location: <br />
                            Latitude: {selectedPosition.lat.toFixed(4)} <br />
                            Longitude: {selectedPosition.lng.toFixed(4)}
                            <br />
                            {locationAddress && <>Address: {locationAddress}</>}
                          </Popup>
                        </Marker>
                      )}
                    </>
                  </MapContainer>
                </div>
              </Grid>
            )}
          </Grid>

          <Button type="submit" variant="contained" color="primary" sx={{ mt: 3 }}>
            Add Availability
          </Button>
        </Box>
      </Paper>

      <Paper elevation={3} sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
          Current Availabilities
        </Typography>

        <Grid container spacing={2}>
          {availabilities.map((availability) => (
            <Grid item xs={12} sm={6} md={4} key={availability.id}>
              <Paper elevation={2} sx={{ p: 2 }}>
                <Typography variant="subtitle1">
                  Date: {formatDate(availability.date)}
                </Typography>
                <Typography variant="body1">
                  Time: {formatTime(availability.startTime)} - {formatTime(availability.endTime)}
                </Typography>
                <Typography variant="body1">
                  Mode: {formatMode(availability.mode)}
                </Typography>
                <Typography variant="body1">
                  Slot Duration: {availability.slotDuration} minutes
                </Typography>
                <Typography variant="body1">
                  Price: Rs. {availability.price || 'N/A'}
                </Typography>

                {availability.location && (
                  <Typography variant="body1">
                    Location:- <br />
                    Latitude: {availability.location.lat?.toFixed(4) || 'N/A'} <br />
                    Longitude: {availability.location.lng?.toFixed(4) || 'N/A'} <br />
                    Address: {availability.location.address || 'N/A'}
                  </Typography>
                )}
                <Button
                  variant="outlined"
                  color="error"
                  size="small"
                  onClick={() => handleDelete(availability.id)}
                  sx={{ mt: 1 }}
                >
                  Delete
                </Button>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Paper>
    </Box>
  );
};

export default ManageAvailability;
