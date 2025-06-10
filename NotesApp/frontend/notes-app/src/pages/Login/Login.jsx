import React from "react";
import Navbar from "../../components/Navbar/Navbar";
import { Link } from "react-router-dom";
import PasswordInput from "../../components/Input/PasswordInput";
import { validateEmail } from "../../utils/helper";
import axiosInstance from "../../utils/axiosInstance";
import { useNavigate } from "react-router-dom";



const Login = () => {   
  // State for email, password, and error message
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [error, setError] = React.useState(null);

  const navigate = useNavigate();

  // Handle login form submission
  const handleLogin = async (e) => {
    e.preventDefault();

    // Validate email format
    if (!validateEmail(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    // Check if password is entered
    if (!password){
      setError("Please enter the password");
      return;
    }
    setError("")

    //Login API Call
    try {
      const response = await axiosInstance.post("/login", {
        email: email,
        password: password,
      });

      //Handle successful login: store token and redirect
      if (response.data &&  response.data.accessToken) {
        localStorage.setItem("token", response.data.accessToken);
        navigate("/dashboard");
      }

    } catch (error) {
        // Show error message from backend or generic error
        if (error.response && error.response.data && error.response.data.message) {
          setError(error.response.data.message);
        } else {
          setError("An unexpected error occurred. Please try again later.");
        }
    }
  };

  return (
    <>
      {/* Navbar at the top */}
      <Navbar/>
      <div className="text-center mt-10 mb-5">
        <h1 className="text-4xl font-extrabold text-blue-600 tracking-wide drop-shadow-md">
          Note<span className="text-slate-700">Craft</span>
        </h1>
        <p className="text-xs text-gray-400 mt-1">Organize your thoughts beautifully</p>
    </div>

      {/* Login form container */}
      <div className="flex items-center justify-center mt-18">
        <div className="w-96 border rounded border-gray-300 shadow-2xl px-7 py-10">
          <form onSubmit={handleLogin}>
            <h4 className="text-2xl mb-7">Login</h4>

            {/* Email input */}
            <input 
              type="text" 
              placeholder="Email Address" 
              className="input-box border-gray-300"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

             {/* Password input */}
            <PasswordInput 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            {/* Error message display */}
            {error && <p className="text-red-500 text-xs pb-1">{error}</p>}

            {/* Login button */}
            <button type="submit" className="btn-primary">
              Login
            </button>

            {/* Link to sign up page */}
            <p className="text-sm text-center mt-4">
              Not registered yet? {" "}
              <Link to="/signUp" className="font-medium text-blue-500 underline">
                Create an Account
              </Link>
            </p>
          </form>
        </div>
      </div>  
    </>
  )
};

export default Login;