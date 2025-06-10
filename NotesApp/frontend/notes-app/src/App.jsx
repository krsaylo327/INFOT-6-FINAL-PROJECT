import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./pages/Home/Home";
import Login from "./pages/Login/Login";
import SignUp from "./pages/SignUp/SignUp";

// Define application routes for navigation between pages
const routes = (
 <Router> 
    <Routes>
      {/* Home/Dashboard page route */}
      <Route path="/dashboard" exact element={<Home />} />
      {/* Login page route */}
      <Route path="/login" exact element={<Login />} />
      {/* Sign up page route */}
      <Route path="/signup" exact element={<SignUp />} />
    </Routes>
  </Router>
);


const App = () => {
    // Render the main app with defined routes
    return (
        <div>{routes}</div>
    )
}

export default App;