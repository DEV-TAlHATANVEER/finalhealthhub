import { useState } from "react";
import { Button, TextInput } from "flowbite-react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Link, useNavigate } from "react-router-dom";
import { getAuth, createUserWithEmailAndPassword, sendEmailVerification } from "firebase/auth";
import { getFirestore, doc, setDoc, collection, query, where, getDocs } from "firebase/firestore";

import image from "../assets/Wavy_Lst-21_Single-12 1.png";
import logo from "../assets/Social icon.png";
import app from "../firebase";
import axios from "axios";
import { cloudName, uploadPreset } from "../utils/cloudinary";

// List of specialist options for the dropdown
const specialistOptions = [
  "Cardiology",
  "Dermatology",
  "Endocrinology",
  "Gastroenterology",
  "Neurology",
  "Oncology",
  "Orthopedics",
  "Pediatrics",
  "Psychiatry",
  "Radiology",
  "Urology",
];

export default function Signup() {
  const auth = getAuth(app);
  const db = getFirestore(app);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: "",
    username: "",
    phone: "",
    email: "",
    password: "",
    confirmPassword: "",
    specialist: "",
    experience: "",
    age: "",
    degree: "",
    city: "",
    address: "",
    contactNo: "",
    Role: "doctor",
    medicalLicenseNumber: "",
    profilePicture: null,
    medicalLicenseCertificate: null,
    governmentID: null,
    degreeCertificate: null,
  });

  const [loading, setLoading] = useState(false);

  // Function to upload files to Cloudinary
  const uploadToCloudinary = async (file) => {
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", uploadPreset);

      const response = await axios.post(
        `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
        formData
      );

      return response.data.secure_url;
    } catch (error) {
      throw new Error("Image upload failed");
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
      fullName,
      username,
      phone,
      email,
      password,
      confirmPassword,
      specialist,
      experience,
      age,
      degree,
      city,
      address,
      contactNo,
      medicalLicenseNumber,
      profilePicture,
      medicalLicenseCertificate,
      governmentID,
      degreeCertificate,
      Role,
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

    // Validation: Check if medical license number is exactly 10 characters
    if (medicalLicenseNumber.length !== 10) {
      toast.error("Medical license must be 10 characters long!", { autoClose: 3000 });
      return;
    }

    // File validation: Check file types and sizes
    const validFileTypes = ["image/jpeg", "image/png", "application/pdf"];
    const files = [profilePicture, medicalLicenseCertificate, governmentID, degreeCertificate];

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

      // Check if the medical license number is already registered
      const doctorsRef = collection(db, "doctors");
      const q = query(doctorsRef, where("medicalLicenseNumber", "==", medicalLicenseNumber));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        toast.error("This medical license is already registered", { autoClose: 3000 });
        return;
      }

      // Create user account in Firebase Authentication
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Upload files to Cloudinary
      const uploadTasks = [
        uploadToCloudinary(formData.profilePicture),
        uploadToCloudinary(formData.medicalLicenseCertificate),
        uploadToCloudinary(formData.governmentID),
        uploadToCloudinary(formData.degreeCertificate),
      ];

      const [profileURL, licenseURL, govIDURL, degreeURL] = await Promise.all(uploadTasks);

      // Save doctor data to Firestore
      await setDoc(doc(db, "doctors", user.uid), {
        fullName,
        username,
        phone,
        email,
        specialist,
        experience: Number(experience) || 0,
        age: Number(age) || 0,
        degree,
        city,
        address,
        contactNo,
        medicalLicenseNumber,
        Role,
        profilePicture: profileURL,
        medicalLicenseCertificate: licenseURL,
        governmentID: govIDURL,
        degreeCertificate: degreeURL,
        emailVerified: false, // Track email verification status
        status: "pending",
        createdAt: new Date(),
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
            Doctor Registration
          </h1>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Personal Info */}
            {[
              { id: "fullName", label: "Full Name", placeholder: "Dr. Hannah Green", type: "text" },
              { id: "username", label: "Username", placeholder: "@hannahgreen76", type: "text" },
              { id: "phone", label: "Phone", placeholder: "123 465 7890", type: "tel" },
              { id: "email", label: "Email", placeholder: "doctor@example.com", type: "email" },
              { id: "age", label: "Age", placeholder: "35", type: "number" },
              { id: "city", label: "City", placeholder: "New York", type: "text" },
            ].map((field) => (
              <div key={field.id} className="space-y-1">
                <label className="block text-sm font-medium text-gray-700">{field.label}</label>
                <TextInput
                  {...field}
                  value={formData[field.id]}
                  onChange={handleChange}
                  className="w-full"
                />
              </div>
            ))}

            {/* Professional Info */}
            {[
              { id: "experience", label: "Experience (years)", placeholder: "10", type: "number" },
              { id: "degree", label: "Degree", placeholder: "MD, Cardiology", type: "text" },
              { id: "medicalLicenseNumber", label: "License No.", placeholder: "ML-12345", type: "text" },
              { id: "contactNo", label: "Emergency Contact", placeholder: "9876543210", type: "tel" },
              { id: "address", label: "Clinic Address", placeholder: "123 Medical Street", type: "text" },
            ].map((field) => (
              <div key={field.id} className="space-y-1">
                <label className="block text-sm font-medium text-gray-700">{field.label}</label>
                <TextInput
                  {...field}
                  value={formData[field.id]}
                  onChange={handleChange}
                  className="w-full"
                />
              </div>
            ))}

            {/* Specialist Dropdown */}
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">Specialization</label>
              <select
                id="specialist"
                value={formData.specialist}
                onChange={handleChange}
                className="w-full border rounded-lg px-3 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">Select Specialization</option>
                {specialistOptions.map((option) => (
                  <option key={option} value={option}>{option}</option>
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
              { id: "profilePicture", label: "Profile Photo" },
              { id: "medicalLicenseCertificate", label: "Medical License" },
              { id: "governmentID", label: "Government ID" },
              { id: "degreeCertificate", label: "Degree Certificate" },
            ].map((field) => (
              <div key={field.id} className="space-y-1">
                <label className="block text-sm font-medium text-gray-700">{field.label}</label>
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
              {loading ? "Processing..." : "Register Now"}
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