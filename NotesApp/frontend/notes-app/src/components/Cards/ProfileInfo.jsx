import React from "react";
import { getInitials } from "../../utils/helper";
import { MdLogout } from "react-icons/md";

// ProfileInfo component displays user initials, name, and logout button
const ProfileInfo = ({ userInfo, onLogout }) => {
  // If user info is not available, render nothing
  if (!userInfo) return null;

  return (
    <div className="flex items-center gap-3">
      {/* User initials avatar */}
      <div className="w-12 h-12 flex items-center justify-center rounded-full text-slate-950 font-medium bg-slate-300 border border-slate-500 shadow-xl">
        {getInitials(userInfo.fullName)}
      </div>

      <div>
        {/* Display user's full name */}
        <p className="text-sm font-medium">{userInfo.fullName}</p>

        {/* Logout button */}
        <button
          className="text-sm text-slate-900 underline hover:text-slate-600"
          onClick={onLogout}
        >
          <MdLogout className="inline-block mr-1" />
          Logout
        </button>
      </div>
    </div>
  );
};

export default ProfileInfo;
