import { useState, useEffect } from "react";
import { Button, TextInput } from "flowbite-react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import image from "../assets/Wavy_Lst-21_Single-12 1.png";
import { signInWithEmailAndPassword, getAuth } from "firebase/auth";
import app from "../firebase"; // Import Firestore
import { doc, getDoc, getFirestore } from "firebase/firestore"; // Firestore functions

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const role = location.state?.role || "";
  const auth = getAuth(app);
  const db = getFirestore(app);
  
  useEffect(() => {
    console.log("Received Role:", role);
  }, [role]);

  const handleSignIn = async () => {
    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error("Please enter a valid email address!", { position: "top-right", autoClose: 3000 });
      return;
    }

    // Validate password (minimum 6 characters)
    if (password.length < 6) {
      toast.error("Password must be at least 6 characters long!", { position: "top-right", autoClose: 3000 });
      return;
    }

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      if (!user.emailVerified) {
        toast.error("Please verify your email address before logging in!", {
          position: "top-right",
          autoClose: 3000,
        });
        await auth.signOut();
        return;
      }

      // Handle admin login
      if (role === 'admin') {
        const idTokenResult = await user.getIdTokenResult();
        const claims = idTokenResult.claims;
        if (claims.admin) {
          toast.success("Admin login successful!", { position: "top-right", autoClose: 3000 });
          setTimeout(() => navigate("/admin/dashboard"), 2000);
        } else {
          toast.error("Access denied! Only admins can log in.", { position: "top-right", autoClose: 3000 });
          await auth.signOut();
        }
        return;
      }

      // Fetch user data from appropriate collection
      let userDocRef;
      if (role === 'doctor') {
        userDocRef = doc(db, "doctors", user.uid);
      } else if (role === 'lab') {
        userDocRef = doc(db, "labs", user.uid);
      } else {
        userDocRef = doc(db, "doctors", user.uid); // fallback to doctors
      }

      const userDoc = await getDoc(userDocRef);
      
      if (userDoc.exists()) {
        const userData = userDoc.data();
        const userRole = userData.Role;

        if ((userRole === "doctor" && role === "doctor") || (userRole === "lab" && role === "lab")) {
          const successMessage = `${userRole.charAt(0).toUpperCase() + userRole.slice(1)} login successful!`;
          toast.success(successMessage, { position: "top-right", autoClose: 3000 });
          setTimeout(() => navigate(`/${userRole}/dashboard`), 2000);
        } else {
          toast.error("Access denied! Unauthorized user.", { position: "top-right", autoClose: 3000 });
          await auth.signOut();
        }
      } else {
        toast.error("User not found!", { position: "top-right", autoClose: 3000 });
        await auth.signOut();
      }
    } catch (error) {
      toast.error(error.message, { position: "top-right", autoClose: 3000 });
    }
  };

  return (
    <div className="flex h-screen">
      <ToastContainer />

      {/* Left Section */}
      <div className="flex flex-1 flex-col justify-center items-center px-10 bg-gray-50">
        <div className="w-full max-w-md">
          {/* Heading */}
          <h1 className="text-3xl font-bold text-center mb-4">Welcome Back</h1>
          <p className="text-center text-gray-600 mb-8">
            {role ? `Logging in as ${role}` : "Please enter your details to log in"}
          </p>

          {/* Email Field */}
          <div className="mb-4">
            <label htmlFor="email" className="block mb-1 text-sm font-medium text-gray-700">
              Email Address
            </label>
            <TextInput
              id="email"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          {/* Password Field */}
          <div className="mb-4">
            <label htmlFor="password" className="block mb-1 text-sm font-medium text-gray-700">
              Password
            </label>
            <TextInput
              id="password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {/* Forgot Password */}
          <div className="text-right mb-4">
            <Link to="/forget-password" className="text-sm text-blue-500 hover:underline">
              Forgot Password?
            </Link>
          </div>

          {/* Sign In Button */}
          <Button className="w-full bg-blue-500 hover:bg-blue-600 text-white mb-4" onClick={handleSignIn}>
            Sign In
          </Button>

          {/* Signup Link - Hide if role is 'admin' */}
          {role !== "admin" && (
            <div className="mt-6 text-sm text-center text-gray-700">
              Don't have an account?{" "}
              <Link 
                to={role === "lab" ? "/signup-lab" : "/signup"} 
                className="font-medium text-blue-500 hover:underline"
              >
                Sign Up
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Right Section */}
      <div className="hidden lg:flex flex-1 items-center justify-center bg-gray-100">
        <img src={image} alt="Login Illustration" className="object-cover w-full h-full" />
      </div>
    </div>
  );
}
