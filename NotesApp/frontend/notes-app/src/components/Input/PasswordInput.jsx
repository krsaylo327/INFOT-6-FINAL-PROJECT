import React, { useState } from "react";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";

// PasswordInput component with show/hide password functionality
const PasswordInput = ({value, onChange, placeholder}) => {   
  const [isShowPassword, setIsShowPassword] = useState(false);

  // Toggle password visibility
  const togglePasswordVisibility = () => {
    setIsShowPassword(!isShowPassword);
  };

  return (
    <div className="flex items-center bg-transparent border-[1.5px] border-gray-300 px-5 rounded mb-3">
      {/* Password input field */}
      <input
      value={value}
      onChange={onChange}
      type={isShowPassword ? "text" : "password"}
      placeholder={placeholder || "Enter Password"}
      className="w-full text-sm bg-transparent py-3 mr-3 rounded outline-none"
      />   

      {/* Show/hide password icon */}
      {isShowPassword ? (
        <FaRegEye
        size={22}
        className="text-blue-500 cursor-pointer"
        onClick={() => togglePasswordVisibility()}
      /> 
      ) : ( 
      <FaRegEyeSlash
        size={22}
        className="text-slate-400 cursor-pointer"
        onClick={() => togglePasswordVisibility()}
      />
      )} 
    </div>  
  );
}

export default PasswordInput;