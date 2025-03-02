import React, { useState } from 'react';
import { db } from '../firebase';
import { collection, addDoc, query, where, getDocs } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

function Availability() {
  const [formData, setFormData] = useState({
    date: '',
    startTime: '',
    endTime: '',
    price: '',
    slotDuration: '', // This is the duration (in minutes) of each consultation slot.
    mode: 'online',
    location: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Update form data as the user types/selects values.
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle form submission with validations.
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Validate that the selected date is not in the past.
    if (formData.date) {
      const selectedDate = new Date(formData.date);
      const today = new Date();
      today.setHours(0, 0, 0, 0); // Normalize today's date.
      if (selectedDate < today) {
        setError("Availability cannot be set for a past date. Please choose today or a future date.");
        setLoading(false);
        return;
      }
    }

    // Validate start and end times.
    if (!formData.startTime || !formData.endTime) {
      setError("Both start time and end time are required.");
      setLoading(false);
      return;
    }

    const startDateTime = new Date(`${formData.date}T${formData.startTime}`);
    const endDateTime = new Date(`${formData.date}T${formData.endTime}`);

    if (endDateTime <= startDateTime) {
      setError("End time must be after start time.");
      setLoading(false);
      return;
    }

    // Calculate the total available duration in minutes.
    const finalDurationInMinutes = (endDateTime - startDateTime) / 60000;

    // Validate slotDuration input and compute number of slots.
    const slotDuration = parseInt(formData.slotDuration, 10);
    if (isNaN(slotDuration) || slotDuration <= 0) {
      setError("Please enter a valid slot duration in minutes.");
      setLoading(false);
      return;
    }

    if (finalDurationInMinutes < slotDuration) {
      setError("Slot duration is too long for the selected time range.");
      setLoading(false);
      return;
    }

    const numberOfSlots = Math.floor(finalDurationInMinutes / slotDuration);

    // Validate mode-specific fields: if physical, location is required.
    if (formData.mode === 'physical' && !formData.location.trim()) {
      setError("Location is required for physical consultations.");
      setLoading(false);
      return;
    }

    // Get the currently authenticated doctor.
    const auth = getAuth();
    const currentUser = auth.currentUser;
    if (!currentUser) {
      setError("User not authenticated. Please sign in.");
      setLoading(false);
      return;
    }
    const doctorId = currentUser.uid;

    // Check for overlapping availabilities for this doctor on the same date.
    try {
      const availabilitiesRef = collection(db, 'doctors', doctorId, 'availabilities');
      const q = query(availabilitiesRef, where("date", "==", formData.date));
      const snapshot = await getDocs(q);

      for (const docSnap of snapshot.docs) {
        const data = docSnap.data();
        const existingStart = new Date(`${data.date}T${data.startTime}`);
        const existingEnd = new Date(`${data.date}T${data.endTime}`);

        // Check if the time ranges overlap:
        // Two intervals [a, b) and [c, d) overlap if a < d and c < b.
        if (startDateTime < existingEnd && existingStart < endDateTime) {
          setError("The selected time range overlaps with an existing availability.");
          setLoading(false);
          return;
        }
      }
    } catch (err) {
      console.error("Error checking existing availabilities:", err);
      setError("There was an error verifying your availability.");
      setLoading(false);
      return;
    }

    // Save the availability data to Firestore.
    try {
      await addDoc(collection(db, 'doctors', doctorId, 'availabilities'), {
        date: formData.date,
        startTime: formData.startTime,
        endTime: formData.endTime,
        price: formData.price,
        slotDuration: slotDuration,
        slots: numberOfSlots, // The computed number of consultation slots.
        mode: formData.mode,
        location: formData.mode === 'physical' ? formData.location : '',
        createdAt: new Date(),
      });
      alert("Availability successfully saved!");

      // Optionally, reset the form after successful submission.
      setFormData({
        date: '',
        startTime: '',
        endTime: '',
        price: '',
        slotDuration: '',
        mode: 'online',
        location: '',
      });
    } catch (err) {
      console.error("Error writing document:", err);
      setError("There was an error saving your availability.");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-green-400 to-blue-500 p-4">
      <div className="bg-white shadow-xl rounded-lg p-6 w-full max-w-2xl">
        <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">
          Set Your Availability
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Row 1: Date */}
          <div className="flex items-center">
            <label htmlFor="date" className="w-1/3 text-gray-700 font-medium">
              Select Date:
            </label>
            <input
              type="date"
              name="date"
              id="date"
              value={formData.date}
              onChange={handleChange}
              className="w-2/3 p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400"
              required
            />
          </div>

          {/* Row 2: Start Time */}
          <div className="flex items-center">
            <label htmlFor="startTime" className="w-1/3 text-gray-700 font-medium">
              Start Time:
            </label>
            <input
              type="time"
              name="startTime"
              id="startTime"
              value={formData.startTime}
              onChange={handleChange}
              className="w-2/3 p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400"
              required
            />
          </div>

          {/* Row 3: End Time */}
          <div className="flex items-center">
            <label htmlFor="endTime" className="w-1/3 text-gray-700 font-medium">
              End Time:
            </label>
            <input
              type="time"
              name="endTime"
              id="endTime"
              value={formData.endTime}
              onChange={handleChange}
              className="w-2/3 p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400"
              required
            />
          </div>

          {/* Row 4: Price */}
          <div className="flex items-center">
            <label htmlFor="price" className="w-1/3 text-gray-700 font-medium">
              Consultation Price ($):
            </label>
            <input
              type="number"
              name="price"
              id="price"
              value={formData.price}
              onChange={handleChange}
              className="w-2/3 p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400"
              placeholder="Enter price"
              required
              min="0"
              step="0.01"
            />
          </div>

          {/* Row 5: Slot Duration (for each consultation) */}
          <div className="flex items-center">
            <label htmlFor="slotDuration" className="w-1/3 text-gray-700 font-medium">
              Slot Duration (minutes):
            </label>
            <input
              type="number"
              name="slotDuration"
              id="slotDuration"
              value={formData.slotDuration}
              onChange={handleChange}
              className="w-2/3 p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400"
              placeholder="e.g., 30"
              required
              min="1"
              step="1"
            />
          </div>

          {/* Row 6: Consultation Mode */}
          <div className="flex items-center">
            <label className="w-1/3 text-gray-700 font-medium">
              Consultation Mode:
            </label>
            <div className="w-2/3 flex space-x-4">
              <label className="flex items-center space-x-1">
                <input
                  type="radio"
                  name="mode"
                  value="online"
                  checked={formData.mode === 'online'}
                  onChange={handleChange}
                  className="form-radio"
                />
                <span>Online (Video Call)</span>
              </label>
              <label className="flex items-center space-x-1">
                <input
                  type="radio"
                  name="mode"
                  value="physical"
                  checked={formData.mode === 'physical'}
                  onChange={handleChange}
                  className="form-radio"
                />
                <span>Physical</span>
              </label>
            </div>
          </div>

          {/* Conditional Row: Physical - Location */}
          {formData.mode === 'physical' && (
            <div className="flex items-center">
              <label htmlFor="location" className="w-1/3 text-gray-700 font-medium">
                Clinic/Hospital Location:
              </label>
              <input
                type="text"
                name="location"
                id="location"
                value={formData.location}
                onChange={handleChange}
                className="w-2/3 p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400"
                placeholder="Enter your clinic or hospital address"
                required
              />
            </div>
          )}

          {/* Error Message */}
          {error && <p className="text-red-500 text-sm">{error}</p>}

          {/* Submit Button */}
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition duration-200 disabled:opacity-50"
            >
              {loading ? 'Saving...' : 'Save Availability'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Availability;
