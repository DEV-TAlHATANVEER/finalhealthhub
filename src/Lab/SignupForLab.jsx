import { useState } from "react";
import { Button, TextInput } from "flowbite-react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { LAB_TYPES, LAB_SPECIALIZATIONS } from "../constants/labOptions";
import { Link, useNavigate } from "react-router-dom";
import { 
  getAuth, 
  createUserWithEmailAndPassword, 
  sendEmailVerification 
} from "firebase/auth";
import { 
  getFirestore, 
  doc, 
  setDoc, 
  collection, 
  query, 
  where, 
  getDocs 
} from "firebase/firestore";
import image from "../assets/Wavy_Lst-21_Single-12 1.png";
import logo from "../assets/Social icon.png";
import app from "../firebase";
import axios from "axios";
import { cloudName, uploadPreset } from "../utils/cloudinary";

export default function SignupForLab() {
  const auth = getAuth(app);
  const db = getFirestore(app);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    labName: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    address: "",
    city: "",
    licenseNumber: "",
    specialization: "",
    operatingHours: "",
    contactPerson: "",
    Role: "lab",
    labType: "",
    labLicenseCertificate: null,
    labPhotos: null,
    registrationCertificate: null
  });

  const [loading, setLoading] = useState(false);

  // Function to upload files to Cloudinary
  const uploadToCloudinary = async (file) => {
    try {
      const data = new FormData();
      data.append("file", file);
      data.append("upload_preset", uploadPreset);

      const response = await axios.post(
        `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
        data
      );

      return response.data.secure_url;
    } catch (error) {
      throw new Error("Image upload failed");
    }
  };

  // Free geocoding function using Nominatim (OpenStreetMap)
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

  // Handle input changes for text fields
  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  // Handle file input changes
  const handleFileChange = (e) => {
    const { id, files } = e.target;
    setFormData((prev) => ({ ...prev, [id]: files[0] }));
  };

  // Handle signup form submission
  const handleSignup = async () => {
    const {
      labName,
      email,
      password,
      confirmPassword,
      phone,
      address,
      city,
      licenseNumber,
      specialization,
      operatingHours,
      contactPerson,
      Role,
      labLicenseCertificate,
      labPhotos,
      registrationCertificate,
      labType,
    } = formData;

    // Validation: Check if all fields are filled
    if (Object.values(formData).some((val) => !val)) {
      toast.error("All fields are required!", { autoClose: 3000 });
      return;
    }

    // Validation: Check if passwords match
    if (password !== confirmPassword) {
      toast.error("Passwords do not match!", { autoClose: 3000 });
      return;
    }

    // Validation: Check if license number is exactly 10 characters
    if (licenseNumber.length !== 10) {
      toast.error("License number must be 10 characters long!", { autoClose: 3000 });
      return;
    }

    // File validation: Check file types and sizes
    const validFileTypes = ["image/jpeg", "image/png", "application/pdf"];
    const files = [labLicenseCertificate, labPhotos, registrationCertificate];

    if (files.some((file) => !validFileTypes.includes(file.type))) {
      toast.error("Only JPG, PNG, and PDF files are allowed", { autoClose: 3000 });
      return;
    }

    if (files.some((file) => file.size > 5 * 1024 * 1024)) {
      toast.error("File size should be less than 5MB", { autoClose: 3000 });
      return;
    }

    try {
      setLoading(true);

      // Check if the license number is already registered
      const labsRef = collection(db, "labs");
      const q = query(labsRef, where("licenseNumber", "==", licenseNumber));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        toast.error("This license number is already registered", { autoClose: 3000 });
        return;
      }

      // Create user account in Firebase Authentication
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Upload files to Cloudinary concurrently
      const uploadTasks = [
        uploadToCloudinary(labLicenseCertificate),
        uploadToCloudinary(labPhotos),
        uploadToCloudinary(registrationCertificate)
      ];

      const [licenseURL, photosURL, registrationURL] = await Promise.all(uploadTasks);

      // Get latitude and longitude from the address using Nominatim
      const coordinates = await getLatLngFromAddress(address);

      // Save lab data to Firestore (including computed lat and lng)
      await setDoc(doc(db, "labs", user.uid), {
        labName,
        email,
        phone,
        address,
        city,
        licenseNumber,
        specialization,
        operatingHours,
        contactPerson,
        Role,
        labType,
        labLicenseCertificate: licenseURL,
        labPhotos: photosURL,
        registrationCertificate: registrationURL,
        lat: coordinates ? coordinates.lat : null,
        lng: coordinates ? coordinates.lng : null,
        emailVerified: false,
        status: "pending",
        createdAt: new Date()
      });

      // Send email verification
      await sendEmailVerification(user);

      // Sign out the user immediately
      await auth.signOut();

      // Show success message and redirect to login page
      toast.success("Registration successful! Please check your email to verify your account.");
      setTimeout(() => navigate("/"), 2000);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen">
      <ToastContainer position="top-right" autoClose={3000} />

      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img src={image} alt="Background" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-black/50" />
      </div>

      {/* Registration Form */}
      <div className="relative z-10 flex justify-center items-center min-h-screen p-4">
        <div className="w-full max-w-4xl bg-white/95 backdrop-blur-sm rounded-xl p-8 shadow-2xl">
          <h1 className="text-3xl font-bold text-center mb-2 text-gray-800">
            Laboratory Registration
          </h1>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Lab Info Fields */}
            {[
              { id: "labName", label: "Laboratory Name", placeholder: "City Medical Lab", type: "text" },
              { id: "email", label: "Email", placeholder: "lab@example.com", type: "email" },
              { id: "phone", label: "Phone", placeholder: "123 456 7890", type: "tel" },
              { id: "city", label: "City", placeholder: "New York", type: "text" },
              { id: "address", label: "Laboratory Address", placeholder: "123 Medical Street", type: "text" },
              { id: "contactPerson", label: "Contact Person", placeholder: "John Doe", type: "text" },
              { id: "operatingHours", label: "Operating Hours", placeholder: "9 AM - 6 PM", type: "text" },
              { id: "licenseNumber", label: "License Number", placeholder: "LAB1234567", type: "text" }
            ].map((field) => (
              <div key={field.id} className="space-y-1">
                <label className="block text-sm font-medium text-gray-700">
                  {field.label}
                </label>
                <TextInput
                  {...field}
                  value={formData[field.id]}
                  onChange={handleChange}
                  className="w-full"
                />
              </div>
            ))}

            {/* Lab Type Dropdown */}
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">Lab Type</label>
              <select
                id="labType"
                value={formData.labType}
                onChange={handleChange}
                className="w-full border rounded-lg px-3 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">Select Lab Type</option>
                {LAB_TYPES.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>

            {/* Lab Specialization Dropdown */}
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">Specialization</label>
              <select
                id="specialization"
                value={formData.specialization}
                onChange={handleChange}
                className="w-full border rounded-lg px-3 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">Select Specialization</option>
                {LAB_SPECIALIZATIONS.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>

            {/* Password Fields */}
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">Password</label>
              <TextInput
                id="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">Confirm Password</label>
              <TextInput
                id="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
              />
            </div>

            {/* File Uploads */}
            {[
              { id: "labLicenseCertificate", label: "Lab License Certificate" },
              { id: "labPhotos", label: "Laboratory Photos" },
              { id: "registrationCertificate", label: "Registration Certificate" }
            ].map((field) => (
              <div key={field.id} className="space-y-1">
                <label className="block text-sm font-medium text-gray-700">
                  {field.label}
                </label>
                <input
                  type="file"
                  id={field.id}
                  onChange={handleFileChange}
                  className="block w-full text-sm text-gray-500
                    file:mr-4 file:py-2 file:px-4
                    file:rounded-full file:border-0
                    file:text-sm file:font-semibold
                    file:bg-blue-50 file:text-blue-700
                    hover:file:bg-blue-100"
                  required
                />
              </div>
            ))}
          </div>

          <div className="mt-8">
            <Button
              onClick={handleSignup}
              className="w-full bg-blue-600 hover:bg-blue-700"
              disabled={loading}
            >
              {loading ? "Processing..." : "Register Laboratory"}
            </Button>
          </div>

          <div className="mt-4 text-center text-sm text-gray-600">
            Already registered?{" "}
            <Link to="/" className="text-blue-600 hover:text-blue-700 font-medium">
              Login here
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
