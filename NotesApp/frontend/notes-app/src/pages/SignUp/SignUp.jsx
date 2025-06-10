import React from "react";
//import React, {useState} from "react";
import Navbar from "../../components/Navbar/Navbar";
import { Link, useNavigate } from "react-router-dom";
import { validateEmail } from "../../utils/helper";
import PasswordInput from "../../components/Input/PasswordInput";
import axiosInstance from "../../utils/axiosInstance"; 


const SignUp = () => {   
  // State for name, email, password, and error message
  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [error, setError] = React.useState(null);

  const navigate = useNavigate();

  // Handle sign up form submission
  const handleSignUp = async (e) => {
    e.preventDefault();

    // Validate name
    if (!name) {
      setError("Please enter your name");
      return;
    }

    // Validate email format
    if (!validateEmail(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    // Validate password
    if (!password) {
      setError("Please enter the password");
      return;
    }

    setError('')

    //SignUp API Call
    try {
      const response = await axiosInstance.post("/create-account", {
        fullName: name,
        email: email,
        password: password,
      });


      //Handle successful register response: store token and redirect
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
  }
  

  return (
    <>
      {/* Navbar at the top */}
      <Navbar/>

      {/* App title and subtitle */}
      <div className="text-center mb-5 mt-8">
        <h1 className="text-4xl font-extrabold text-blue-600 tracking-wide drop-shadow-md">
          Note<span className="text-slate-700">Craft</span>
        </h1>
        <p className="text-xs text-gray-400 mt-1">
          Create your account and start crafting smarter notes for your education
        </p>
      </div>

      {/* Sign up form container */}
      <div className="flex items-center justify-center mt-18">
        <div className="w-96 border rounded border-gray-300 shadow-2xl px-7 py-10">
          <form onSubmit={handleSignUp}>
            <h4 className="text-2xl mb-7">SignUp</h4>

            {/* Name input */}
            <input
              type="text"
              placeholder="Name"
              className="input-box border-gray-300"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />

            {/* Email input */}
            <input
              type="text"
              placeholder="Email"
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
            
            {/* Sign up button */}
            <button type="submit" className="btn-primary">
              Create Account {" "}        
            </button>            
            
            {/* Link to login page */}
            <p className="text-sm text-center mt-4">            
              Already have an acount? {" "}
              <Link to="/login" className="font-medium text-blue-500 underline">
                Login          
              </Link>            
            </p>            
              
          </form>
        </div>
      </div>
    </>  
  );
}

export default SignUp;