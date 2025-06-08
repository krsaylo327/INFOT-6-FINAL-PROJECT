import React from "react";
import { FaMagnifyingGlass } from "react-icons/fa6";
import { IoMdClose} from "react-icons/io";

// SearchBar component for searching notes with clear and search icons
const SearchBar = ({value, onChange, handleSearch, onClearSearch}) => {
    return (
        <div className="w-80 flex items-center px-4 bg-slate-100 rounded-md border border-black- shadow-lg">
            {/* Input field for search query */}
            <input
                type="text"
                placeholder="Search Notes"
                className="w-full text-xs text-slate-500 bg-transparent py-[11px] outline-none"
                value={value}
                onChange={onChange}
            />

            {/* Show clear icon only if there is a value */}
            {value && (
                <IoMdClose 
                    className="text-xl text-slate-500 cursor-pointer hover:text-black mr-3" 
                    onClick={onClearSearch} 
                />
            )}
            
            {/* Search icon to trigger search */}
            <FaMagnifyingGlass 
                className="text-slate-400 cursor-pointer hover:text-black" 
                onClick={handleSearch} 
            />
        </div>
    );
}

export default SearchBar;