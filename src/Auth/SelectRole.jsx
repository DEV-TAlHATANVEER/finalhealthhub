import { Button, Select } from "flowbite-react";
import { Link, useNavigate } from "react-router-dom"; // Import useNavigate
import { useState } from "react";
import image from "../assets/Wavy_Lst-21_Single-12 1.png";

export default function SelectOrganization() {
  const navigate = useNavigate(); // Initialize the navigate function
  const [role, setRole] = useState(""); // State for selected role

  const handleNextClick = () => {
    if (!role) {
      alert("Please select a role before proceeding.");
      return;
    }
    navigate("/login", { state: { role } }); // Pass role as state
  };

  return (
    <div className="flex h-screen">
      {/* Left Section */}
      <div className="flex flex-1 flex-col justify-center items-center px-10 bg-gray-50">
        <div className="w-full max-w-md">
          {/* Heading */}
          <h1 className="text-3xl font-bold text-center mb-4">Select Your Organization</h1>
          <p className="text-center text-gray-600 mb-8">
            Please select the organization you belong to.
          </p>

          {/* Organization Dropdown */}
          <div className="mb-4 w-full">
            <label
              htmlFor="organization"
              className="block mb-1 text-sm font-medium text-gray-700"
            >
              Organization
            </label>
            <Select
              id="organization"
              required
              className="w-full"
              value={role}
              onChange={(e) => setRole(e.target.value)}
            >
              <option value="">Select a Role</option>
              <option value="admin">Admin</option>
              <option value="doctor">Doctor</option>
              <option value="lab">Lab</option>
              {/* Add more organizations dynamically as needed */}
            </Select>
          </div>

          {/* Next Button */}
          <Button
            className="w-full bg-blue-500 hover:bg-blue-600 text-white mb-4"
            onClick={handleNextClick} // Handle click
          >
            Next
          </Button>
        </div>
      </div>

      {/* Right Section */}
      <div className="hidden lg:flex flex-1 items-center justify-center bg-gray-100">
        <img
          src={image}
          alt="Organization Illustration"
          className="object-cover w-full h-full"
        />
      </div>
    </div>
  );
}
