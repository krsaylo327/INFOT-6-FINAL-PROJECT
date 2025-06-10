import React from "react";
import { MdAdd, MdClose } from "react-icons/md";

// TagInput component allows users to add, display, and remove tags
const TagInput = ({tags, setTags}) => {

    // State for the current input value
    const [inputValue, setInputValue] = React.useState("");

    // Update input value as user types
    const handleInputChange = (e) => {
        setInputValue (e.target.value);
    };

    // Add a new tag if input is not empty
    const addNewTag = () => {
        if (inputValue.trim() !== "") {
            setTags([...tags, inputValue.trim()]);
            setInputValue("");
        }
    };

    // Add tag when Enter key is pressed
    const handleKeyDown = (e) => {
        if (e.key === "Enter") {
            addNewTag();
        }
    };

    // Remove a tag when close button is clicked
    const handleRemoveTag = (tagToRemove) => {
        setTags(tags.filter((tag) => tag !== tagToRemove));
    };

    return (
        <div>
            {/* Display existing tags with remove option */}
            {tags?.length > 0 && (
                <div className="flex items-center gap-2 flex-wrap mt-2">
                    {tags.map((tag, index) => (
                        <span key={index} className="flex items-center gap-2 text-[10px] text-slate-500 bg-gray-100 shadow-1xs px-3 py-1 rounded">
                            #{tag}
                            <button 
                                onClick={() => {
                                    handleRemoveTag(tag);
                                }}
                            >
                                <MdClose className="text-black"/>
                            </button>
                        </span>
                    ))}
                </div>
            )}

            {/* Input field and add button for new tags */}
            <div className="flex items-center gap-4 mt-2">
                <input 
                    type="text" 
                    value={inputValue}
                    className="text-[10px] bg-transparent border border-gray-300 px-3 py-2 rounded outline-none" 
                    placeholder="Add tags"
                    onChange={handleInputChange}
                    onKeyDown={handleKeyDown}
                />

                <button 
                    className="w-8 h-8 flex items-center justify-center rounded border border-blue-500 hover:bg-blue-700"
                    onClick={() => {
                        addNewTag();
                    }}
                >
                    <MdAdd className="text-3xl font-extrabold text-blue-500 hover:text-white"/>
                </button>

            </div>
        </div>
    )
}

export default TagInput;