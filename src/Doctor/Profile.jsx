import React, { useEffect, useState } from "react";
import { getAuth } from "firebase/auth";
import { getFirestore, doc, getDoc, updateDoc } from "firebase/firestore";
import { uploadPreset, cloudName } from "../utils/cloudinary";

function Profile() {
  const [formData, setFormData] = useState({
    fullName: "",
    username: "",
    phone: "",
    email: "",
    specialist: "",
    experience: 0,
    age: 0,
    degree: "",
    city: "",
    address: "",
    contactNo: "",
    medicalLicenseNumber: "",
    Role: "",
    profilePicture: "",
    medicalLicenseCertificate: "",
    governmentID: "",
    degreeCertificate: "",
    createdAt: "",
  });

  // New file states for image updates
  const [newProfileImage, setNewProfileImage] = useState(null);
  const [newMedicalLicenseCertificate, setNewMedicalLicenseCertificate] = useState(null);
  const [newGovernmentID, setNewGovernmentID] = useState(null);
  const [newDegreeCertificate, setNewDegreeCertificate] = useState(null);

  const [loading, setLoading] = useState(true);
  // New state for updating status
  const [updating, setUpdating] = useState(false);

  const auth = getAuth();
  const db = getFirestore();
  const user = auth.currentUser;

  // Cloudinary upload function
  const uploadImage = async (file) => {
    const data = new FormData();
    data.append("file", file);
    data.append("upload_preset", uploadPreset);
    const res = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
      {
        method: "POST",
        body: data,
      }
    );
    const json = await res.json();
    return json.secure_url;
  };

  useEffect(() => {
    if (user) {
      const fetchProfile = async () => {
        try {
          const docRef = doc(db, "doctors", user.uid); // Adjust collection as needed
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            setFormData({ ...docSnap.data() });
          }
        } catch (error) {
          console.error("Error fetching profile:", error);
        } finally {
          setLoading(false);
        }
      };
      fetchProfile();
    }
  }, [user, db]);

  // Generic input change handler for text fields
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  // File input change handlers for each image field
  const handleProfileImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setNewProfileImage(e.target.files[0]);
    }
  };

  const handleMedicalLicenseCertificateChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setNewMedicalLicenseCertificate(e.target.files[0]);
    }
  };

  const handleGovernmentIDChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setNewGovernmentID(e.target.files[0]);
    }
  };

  const handleDegreeCertificateChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setNewDegreeCertificate(e.target.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Set updating to true to indicate the process has started
    setUpdating(true);
    try {
      let profilePicUrl = formData.profilePicture;
      let medLicenseUrl = formData.medicalLicenseCertificate;
      let governmentIDUrl = formData.governmentID;
      let degreeCertUrl = formData.degreeCertificate;

      if (newProfileImage) {
        profilePicUrl = await uploadImage(newProfileImage);
      }
      if (newMedicalLicenseCertificate) {
        medLicenseUrl = await uploadImage(newMedicalLicenseCertificate);
      }
      if (newGovernmentID) {
        governmentIDUrl = await uploadImage(newGovernmentID);
      }
      if (newDegreeCertificate) {
        degreeCertUrl = await uploadImage(newDegreeCertificate);
      }

      const updatedData = {
        ...formData,
        profilePicture: profilePicUrl,
        medicalLicenseCertificate: medLicenseUrl,
        governmentID: governmentIDUrl,
        degreeCertificate: degreeCertUrl,
      };

      const docRef = doc(db, "doctors", user.uid);
      await updateDoc(docRef, updatedData);

      // Update local state to trigger re-render
      setFormData(updatedData);

      alert("Profile Updated Successfully!");
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Failed to update profile!");
    } finally {
      // Set updating back to false once processing is done
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-white text-xl">Loading...</p>
      </div>
    );
  }

  // Document items with their corresponding file input handlers
  const docs = [
    {
      key: "medicalLicenseCertificate",
      label: "Medical License Certificate",
      fileHandler: handleMedicalLicenseCertificateChange,
    },
    {
      key: "governmentID",
      label: "Government ID",
      fileHandler: handleGovernmentIDChange,
    },
    {
      key: "degreeCertificate",
      label: "Degree Certificate",
      fileHandler: handleDegreeCertificateChange,
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-r from-purple-600 to-pink-600 flex items-center justify-center p-6">
      <div className="w-full max-w-4xl bg-white rounded-xl shadow-2xl overflow-hidden">
        <div className="bg-gray-900 px-6 py-4">
          <h2 className="text-3xl text-white font-bold">Profile Settings</h2>
          <p className="text-gray-300">
            Update your details and images to keep your profile fresh.
          </p>
        </div>
        <form onSubmit={handleSubmit} className="p-8">
          {/* Profile Picture Section */}
          <div className="flex flex-col items-center mb-8">
            {formData.profilePicture ? (
              <img
                src={formData.profilePicture}
                alt="Profile"
                className="w-32 h-32 rounded-full object-cover border-4 border-purple-600 transition-transform transform hover:scale-105"
              />
            ) : (
              <div className="w-32 h-32 bg-gray-200 rounded-full flex items-center justify-center border-4 border-purple-600">
                <span className="text-gray-500">No Image</span>
              </div>
            )}
            <input
              type="file"
              accept="image/*"
              onChange={handleProfileImageChange}
              className="mt-4 block text-sm text-gray-500
                         file:mr-4 file:py-2 file:px-4
                         file:rounded-full file:border-0
                         file:text-sm file:font-semibold
                         file:bg-purple-50 file:text-purple-700
                         hover:file:bg-purple-100"
            />
          </div>

          {/* Form Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Full Name */}
            <div>
              <label className="block text-gray-700 text-sm font-semibold mb-2">
                Full Name
              </label>
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                placeholder="Enter your full name"
                className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600 transition duration-200"
              />
            </div>
            {/* Username */}
            <div>
              <label className="block text-gray-700 text-sm font-semibold mb-2">
                Username
              </label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                placeholder="Enter your username"
                className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600 transition duration-200"
              />
            </div>
            {/* Email */}
            <div>
              <label className="block text-gray-700 text-sm font-semibold mb-2">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                readOnly
                className="w-full bg-gray-100 border border-gray-300 p-3 rounded-lg"
              />
            </div>
            {/* Phone */}
            <div>
              <label className="block text-gray-700 text-sm font-semibold mb-2">
                Phone
              </label>
              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Enter your phone number"
                className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600 transition duration-200"
              />
            </div>
            {/* Specialist */}
            <div>
              <label className="block text-gray-700 text-sm font-semibold mb-2">
                Specialist
              </label>
              <input
                type="text"
                name="specialist"
                value={formData.specialist}
                onChange={handleChange}
                placeholder="Your field of specialization"
                className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600 transition duration-200"
              />
            </div>
            {/* Experience */}
            <div>
              <label className="block text-gray-700 text-sm font-semibold mb-2">
                Experience (Years)
              </label>
              <input
                type="number"
                name="experience"
                value={formData.experience}
                onChange={handleChange}
                placeholder="Years of experience"
                className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600 transition duration-200"
              />
            </div>
            {/* Age */}
            <div>
              <label className="block text-gray-700 text-sm font-semibold mb-2">
                Age
              </label>
              <input
                type="number"
                name="age"
                value={formData.age}
                onChange={handleChange}
                placeholder="Your age"
                className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600 transition duration-200"
              />
            </div>
            {/* Degree */}
            <div>
              <label className="block text-gray-700 text-sm font-semibold mb-2">
                Degree
              </label>
              <input
                type="text"
                name="degree"
                value={formData.degree}
                onChange={handleChange}
                placeholder="Your degree"
                className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600 transition duration-200"
              />
            </div>
            {/* City */}
            <div>
              <label className="block text-gray-700 text-sm font-semibold mb-2">
                City
              </label>
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleChange}
                placeholder="City"
                className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600 transition duration-200"
              />
            </div>
            {/* Address */}
            <div className="md:col-span-2">
              <label className="block text-gray-700 text-sm font-semibold mb-2">
                Address
              </label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="Full address"
                className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600 transition duration-200"
              />
            </div>
            {/* Contact No. */}
            <div>
              <label className="block text-gray-700 text-sm font-semibold mb-2">
                Contact No.
              </label>
              <input
                type="text"
                name="contactNo"
                value={formData.contactNo}
                onChange={handleChange}
                placeholder="Alternate contact number"
                className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600 transition duration-200"
              />
            </div>
            {/* Medical License Number */}
            <div>
              <label className="block text-gray-700 text-sm font-semibold mb-2">
                Medical License Number
              </label>
              <input
                type="text"
                name="medicalLicenseNumber"
                value={formData.medicalLicenseNumber}
                onChange={handleChange}
                placeholder="Medical License Number"
                className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600 transition duration-200"
              />
            </div>
          </div>

          {/* Documents Section */}
          <div className="mt-8">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Documents</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {docs.map((doc) => (
                <div
                  key={doc.key}
                  className="p-4 border border-gray-200 rounded-lg text-center hover:shadow-lg transition-shadow duration-200"
                >
                  <p className="text-gray-700 font-semibold">{doc.label}</p>
                  {formData[doc.key] ? (
                    <a
                      href={formData[doc.key]}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-2 inline-block text-purple-600 hover:text-purple-800"
                    >
                      View Document
                    </a>
                  ) : (
                    <p className="mt-2 text-gray-500">Not uploaded</p>
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={doc.fileHandler}
                    className="mt-2 block text-sm text-gray-500
                              file:mr-4 file:py-2 file:px-4
                              file:rounded-full file:border-0
                              file:text-sm file:font-semibold
                              file:bg-purple-50 file:text-purple-700
                              hover:file:bg-purple-100"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Submit Button */}
          <div className="mt-10">
            <button
              type="submit"
              disabled={updating} // Disable the button while updating
              className="w-full py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold rounded-lg shadow-lg hover:from-purple-700 hover:to-pink-700 transition duration-300"
            >
              {updating ? "Processing..." : "Update Profile"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Profile;
