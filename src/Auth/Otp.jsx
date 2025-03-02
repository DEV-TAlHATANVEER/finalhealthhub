import { useState } from "react";
import { TextInput, Button } from "flowbite-react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import image from "../assets/Wavy_Lst-21_Single-12 1.png";

export default function Otp() {
  const [otp, setOtp] = useState(["", "", "", ""]);
  const navigate = useNavigate();

  const handleVerify = () => {
    if (otp.some((digit) => digit === "")) {
      toast.error("Please enter all 4 digits!", {
        position: "top-right",
        autoClose: 3000,
      });
      return;
    }

    // Check if OTP is valid (Example: we assume the correct OTP is '1234' for demonstration)
    if (otp.join("") === "1234") {
      toast.success("OTP verified successfully!", {
        position: "top-right",
        autoClose: 3000,
      });

      // Navigate to the new password screen
      setTimeout(() => {
        navigate("/new-password");
      }, 3000);
    } else {
      toast.error("Invalid OTP. Please try again.", {
        position: "top-right",
        autoClose: 3000,
      });
    }
  };

  const handleOtpChange = (e, index) => {
    const value = e.target.value;
    if (/[^0-9]/.test(value)) return; // Only allow numbers

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
  };

  return (
    <div className="flex h-screen">
      <ToastContainer /> {/* Toast container for notifications */}

      {/* Left Section (OTP Form) */}
      <div className="flex flex-1 flex-col justify-center px-12 bg-white">
        <div className="max-w-sm mx-auto">
          <h1 className="text-2xl font-bold mb-4 text-gray-900">
            Verify your identity
          </h1>
          <p className="text-gray-600 mb-6">
            Enter the 4-digit code sent to your email to verify your identity.
          </p>

          {/* OTP Input */}
          <div className="grid grid-cols-4 gap-2 mb-6">
            {otp.map((digit, index) => (
              <TextInput
                key={index}
                type="text"
                maxLength={1}
                value={digit}
                onChange={(e) => handleOtpChange(e, index)} // Update OTP input
                className="text-center w-full h-12 text-lg font-semibold  rounded-lg focus:ring-2 focus:ring-blue-500"
                required
              />
            ))}
          </div>

          {/* Verify Button */}
          <Button className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium" onClick={handleVerify}>
            Verify
          </Button>

          {/* Resend OTP */}
          <div className="mt-6 text-sm text-center text-gray-700">
            Didn’t receive a code?{" "}
            <button className="font-medium text-blue-500 hover:underline">
              Resend
            </button>
          </div>
        </div>
      </div>

      {/* Right Section (Image) */}
      <div className="hidden lg:flex flex-1 items-center justify-center bg-gray-100">
        <img
          src={image}
          alt="Verification Illustration"
          className="object-cover w-full h-full"
        />
      </div>
    </div>
  );
}
