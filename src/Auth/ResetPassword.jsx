import { useState } from "react";
import { Button, TextInput } from "flowbite-react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Link, useNavigate } from "react-router-dom";
import image from "../assets/Wavy_Lst-21_Single-12 1.png";

export default function ResetPassword() {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const navigate = useNavigate();

  const handleResetPassword = () => {
    if (!newPassword || !confirmPassword) {
      toast.error("Both fields are required!", {
        position: "top-right",
        autoClose: 3000,
      });
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match!", {
        position: "top-right",
        autoClose: 3000,
      });
      return;
    }

    // If everything is fine, show success toast
    toast.success("Password reset successfully!", {
      position: "top-right",
      autoClose: 3000,
    });

    // Navigate to login screen after a short delay
    setTimeout(() => {
      navigate("/login");
    }, 3000); // Navigate after 3 seconds
  };

  return (
    <div className="flex h-screen">
      <ToastContainer /> {/* Toast container for notifications */}

      {/* Left Section */}
      <div className="flex flex-1 flex-col justify-center items-center px-10 bg-gray-50">
        <div className="w-full max-w-md">
          {/* Heading */}
          <h1 className="text-3xl font-bold text-center mb-4">
            Create a New Password
          </h1>
          <p className="text-center text-gray-600 mb-8">
            Please enter a new password to secure your account
          </p>

          {/* New Password Field */}
          <div className="mb-4">
            <label
              htmlFor="new-password"
              className="block mb-1 text-sm font-medium text-gray-700"
            >
              New Password
            </label>
            <TextInput
              id="new-password"
              type="password"
              placeholder="Enter your new password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
          </div>

          {/* Confirm Password Field */}
          <div className="mb-4">
            <label
              htmlFor="confirm-password"
              className="block mb-1 text-sm font-medium text-gray-700"
            >
              Confirm Password
            </label>
            <TextInput
              id="confirm-password"
              type="password"
              placeholder="Confirm your new password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>

          {/* Reset Password Button */}
          <Button
            className="w-full bg-blue-500 hover:bg-blue-600 text-white mb-4"
            onClick={handleResetPassword}
          >
            Reset Password
          </Button>

          {/* Back to Login Link */}
          <div className="mt-6 text-sm text-center text-gray-700">
            Remember your password?{" "}
            <Link
              to="/login"
              className="font-medium text-blue-500 hover:underline"
            >
              Back to Login
            </Link>
          </div>
        </div>
      </div>

      {/* Right Section */}
      <div className="hidden lg:flex flex-1 items-center justify-center bg-gray-100">
        <img
          src={image}
          alt="Password Reset Illustration"
          className="object-cover w-full h-full"
        />
      </div>
    </div>
  );
}
