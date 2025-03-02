import React, { useEffect, useState } from "react";
import { getAuth } from "firebase/auth";
import { getFirestore, doc, getDoc, updateDoc, onSnapshot } from "firebase/firestore";
import { initializeSocket } from "../utils/notifications";
import { uploadPreset, cloudName } from "../utils/cloudinary";
import { LAB_SPECIALIZATIONS } from "../constants/labOptions"; // Importing specialization options

function Profile() {
  // State for form data (includes new lat and lng fields)
  const [formData, setFormData] = useState({
    labType: "",
    labName: "",
    licenseNumber: "",
    address: "",
    city: "",
    contactPerson: "",
    phone: "",
    email: "",
    specialization: "",
    labLicenseCertificate: "",
    labPhotos: "",
    registrationCertificate: "",
    operatingHours: "",
    createdAt: "",
    status: "",
    lat: null, // New field for latitude
    lng: null  // New field for longitude
  });
  const [currentStatus, setCurrentStatus] = useState("");
  const [notification, setNotification] = useState(null);

  // State for file uploads
  const [newProfileImage, setNewProfileImage] = useState(null);
  const [newLabLicenseCertificate, setNewLabLicenseCertificate] = useState(null);
  const [newRegistrationCertificate, setNewRegistrationCertificate] = useState(null);

  // State for loading and updating
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  // Firebase auth and Firestore
  const auth = getAuth();
  const db = getFirestore();
  const user = auth.currentUser;

  // Function to upload images to Cloudinary
  const uploadImage = async (file) => {
    const data = new FormData();
    data.append("file", file);
    data.append("upload_preset", uploadPreset);
    const res = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
      { method: "POST", body: data }
    );
    return await res.json();
  };

  // Function to get latitude and longitude using Nominatim (OpenStreetMap)
  const getLatLngFromAddress = async (address) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
          address
        )}&format=json&limit=1`
      );
      const data = await response.json();
      if (data && data.length > 0) {
        const { lat, lon } = data[0];
        return { lat, lng: lon };
      } else {
        console.error("No results found for address");
        return null;
      }
    } catch (error) {
      console.error("Error fetching geocoding data:", error);
      return null;
    }
  };

  // Fetch profile data from Firestore
  useEffect(() => {
    if (user) {
      // Initialize socket for real-time notifications
      initializeSocket(user.uid);

      const fetchProfile = async () => {
        try {
          const docRef = doc(db, "labs", user.uid);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            const data = docSnap.data();
            setFormData(data);
            setCurrentStatus(data.status);
          }
        } catch (error) {
          console.error("Error fetching profile:", error);
        } finally {
          setLoading(false);
        }
      };

      // Set up real-time status listener
      const unsubscribe = onSnapshot(doc(db, "labs", user.uid), (docSnap) => {
        if (docSnap.exists()) {
          const newStatus = docSnap.data().status;
          if (newStatus !== currentStatus) {
            setCurrentStatus(newStatus);
            setNotification({
              message: `Your lab status has been updated to: ${newStatus}`,
              type: "statusUpdate"
            });
          }
        }
      });

      fetchProfile();
      return () => unsubscribe();
    }
  }, [user, db, currentStatus]);

  // Handle input changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle file changes
  const handleFileChange = (setter) => (e) => {
    if (e.target.files[0]) setter(e.target.files[0]);
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setUpdating(true);
    try {
      // Upload new images (if any)
      const [
        labPhotosUrl,
        labLicenseCertUrl,
        registrationCertUrl
      ] = await Promise.all([
        newProfileImage ? uploadImage(newProfileImage) : formData.labPhotos,
        newLabLicenseCertificate ? uploadImage(newLabLicenseCertificate) : formData.labLicenseCertificate,
        newRegistrationCertificate ? uploadImage(newRegistrationCertificate) : formData.registrationCertificate
      ]);

      // Prepare updated data
      const updatedData = {
        ...formData,
        labPhotos: labPhotosUrl.secure_url || labPhotosUrl,
        labLicenseCertificate: labLicenseCertUrl.secure_url || labLicenseCertUrl,
        registrationCertificate: registrationCertUrl.secure_url || registrationCertUrl
      };

      // Get latitude and longitude from the address using Nominatim
      const coordinates = await getLatLngFromAddress(formData.address);
      if (coordinates) {
        updatedData.lat = coordinates.lat;
        updatedData.lng = coordinates.lng;
      }

      // Update Firestore document with new data including lat and lng
      await updateDoc(doc(db, "labs", user.uid), updatedData);
      setFormData(updatedData);
      alert("Profile updated successfully!");
    } catch (error) {
      console.error("Update error:", error);
      alert("Error updating profile");
    } finally {
      setUpdating(false);
    }
  };

  // Loading state
  if (loading) return <div className="text-center p-8">Loading...</div>;

  // Documents array for rendering
  const docs = [
    { 
      key: "labLicenseCertificate",
      label: "Lab License Certificate",
      handler: handleFileChange(setNewLabLicenseCertificate)
    },
    { 
      key: "registrationCertificate",
      label: "Registration Certificate",
      handler: handleFileChange(setNewRegistrationCertificate)
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-r from-purple-600 to-pink-600 flex items-center justify-center p-6">
      <div className="w-full max-w-4xl bg-white rounded-xl shadow-2xl overflow-hidden">
        <div className="bg-gray-900 px-6 py-4">
          <h2 className="text-3xl text-white font-bold">Laboratory Profile</h2>
          <p className="text-gray-300">Manage your lab's information and certifications</p>
          {notification && (
            <div className="mt-4 p-3 bg-blue-100 rounded-lg">
              <p className="text-blue-800">{notification.message}</p>
            </div>
          )}
          <div className="mt-4">
            <p className="text-white">
              Current Status:{" "}
              <span className={`font-bold ${
                currentStatus === 'approved' ? 'text-green-400' : currentStatus === 'rejected' ? 'text-red-400' : 'text-yellow-400'
              }`}>
                {currentStatus}
              </span>
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-8">
          {/* Profile Image Section */}
          <div className="flex flex-col items-center mb-8">
            <img
              src={formData.labPhotos || "/default-lab.png"}
              alt="Lab Logo"
              className="w-32 h-32 rounded-full object-cover border-4 border-purple-600"
            />
            <input
              type="file"
              onChange={handleFileChange(setNewProfileImage)}
              className="mt-4 file:bg-purple-100 file:border-0 file:px-4 file:py-2 file:rounded-full file:text-purple-700 hover:file:bg-purple-200"
            />
          </div>

          {/* Lab Information Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-gray-700 font-semibold mb-2">Lab Name</label>
              <input
                type="text"
                name="labName"
                value={formData.labName}
                onChange={handleChange}
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-purple-600"
              />
            </div>

            <div>
              <label className="block text-gray-700 font-semibold mb-2">License Number</label>
              <input
                type="text"
                name="licenseNumber"
                value={formData.licenseNumber}
                onChange={handleChange}
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-purple-600"
              />
            </div>

            <div>
              <label className="block text-gray-700 font-semibold mb-2">Lab Type</label>
              <select
                name="labType"
                value={formData.labType}
                onChange={handleChange}
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-purple-600"
              >
                <option value="">Select Lab Type</option>
                <option value="pathology">Pathology</option>
                <option value="research">Research</option>
                <option value="clinical">Clinical</option>
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="block text-gray-700 font-semibold mb-2">Address</label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-purple-600"
              />
            </div>

            <div>
              <label className="block text-gray-700 font-semibold mb-2">City</label>
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleChange}
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-purple-600"
              />
            </div>

            <div>
              <label className="block text-gray-700 font-semibold mb-2">Contact Person</label>
              <input
                type="text"
                name="contactPerson"
                value={formData.contactPerson}
                onChange={handleChange}
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-purple-600"
              />
            </div>

            <div>
              <label className="block text-gray-700 font-semibold mb-2">Specialization</label>
              <select
                name="specialization"
                value={formData.specialization}
                onChange={handleChange}
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-purple-600"
              >
                <option value="">Select Specialization</option>
                {LAB_SPECIALIZATIONS.map((option) => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-gray-700 font-semibold mb-2">Contact Number</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-purple-600"
              />
            </div>

            <div>
              <label className="block text-gray-700 font-semibold mb-2">Operating Hours</label>
              <input
                type="text"
                name="operatingHours"
                value={formData.operatingHours}
                onChange={handleChange}
                placeholder="e.g., 8 AM - 8 PM"
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-purple-600"
              />
            </div>
          </div>

          {/* Documents Section */}
          <div className="mt-8">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Certifications</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {docs.map((doc) => (
                <div key={doc.key} className="p-4 border rounded-lg text-center">
                  <p className="font-semibold mb-2">{doc.label}</p>
                  {formData[doc.key] ? (
                    <a
                      href={formData[doc.key]}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-purple-600 hover:text-purple-800"
                    >
                      View Document
                    </a>
                  ) : (
                    <p className="text-gray-500">Not uploaded</p>
                  )}
                  <input
                    type="file"
                    onChange={doc.handler}
                    className="mt-2 file:bg-purple-100 file:border-0 file:px-4 file:py-2 file:rounded-full file:text-purple-700 hover:file:bg-purple-200"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={updating}
            className="w-full mt-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all"
          >
            {updating ? "Updating..." : "Save Changes"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Profile;
