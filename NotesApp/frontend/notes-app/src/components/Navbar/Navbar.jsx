import React from "react";
import ProfileInfo from "../cards/ProfileInfo";
import { useNavigate, useLocation } from "react-router-dom"; 
import SearchBar from "../SearchBar/SearchBar";

// Navbar component displays the app title, search bar, and user profile info
const Navbar = ({ userInfo, onSearchNote, handleClearSearch }) => { 
  const [searchQuery, setSearchQuery] = React.useState("");
  const navigate = useNavigate();
  const location = useLocation();

  // Hide Navbar on login and signup pages
  if (["/login", "/signUp"].includes(location.pathname)) {
    return null;
  }

  // Handle user logout: clear local storage and redirect to login
  const onLogout = () => {
    localStorage.clear(); // Clear token/localStorage
    navigate("/login");   // Redirect to login
  };

  // Trigger search when search button is clicked or enter is pressed
  const handleSearch = () => {
    if (searchQuery) {
      onSearchNote(searchQuery); // Call the onSearchNote function passed as prop
    }
  };

  // Clear the search input and reload all notes
  const onClearSearch = () => {
    setSearchQuery("");
    handleClearSearch(); // Call the handleClearSearch function passed as prop
  };

  return (
    <div className="bg-gray-100 flex items-center justify-between px-6 py-2 drop-shadow">
      <div className="text-center">

        {/* App title */}
        <h1 className="text-2xl font-extrabold text-blue-600 tracking-wide drop-shadow-md">
          Note<span className="text-slate-700">Craft</span>
        </h1>
      </div>

      {/* Search bar for notes */}
      <SearchBar 
        value={searchQuery}
        onChange={({ target }) => {
          const value = target.value;
          setSearchQuery(value);
          if (value.trim() === "") {
            handleClearSearch(); // Trigger clear when input is empty
          }
        }}
        handleSearch={handleSearch}
        onClearSearch={onClearSearch}

      />

      {/* Only render ProfileInfo if userInfo exists */}
      {userInfo && <ProfileInfo userInfo={userInfo} onLogout={onLogout} />}
    </div>
  );
};

export default Navbar;
