import React, { useEffect } from "react";
import { LuCheck } from "react-icons/lu";
import { MdDeleteOutline } from "react-icons/md";

// Toast component displays a temporary notification message
const Toast = ({ isShown, message, type, onClose }) => {

    useEffect(() => {
        // Automatically close the toast after 3 seconds
        const timeoutId = setTimeout(() => {
            onClose();
        }, 3000);

        // Clear timeout if component unmounts or dependencies change
        return () => {
            clearTimeout(timeoutId);
        };
        

    }, [isShown, onClose]);


    return (
        <div
            // Toast container: fixed position, fades in/out based on isShown
            className={`fixed top-2 right-6 transition-all duration-600 z-50 ${
                isShown ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
            }`}
                    
        >
            <div 
                // Toast box with colored left border based on type
                className={`min-w-52 bg-white border shadow-2xl rounded-md after:w-[5px] after:h-full ${
                    type === "delete" ? "after:bg-red-500" : "after:bg-green-500"
                }   after:absolute after:left-0 after:top-0 after:rounded-l-lg`}
            >
                <div className="flex items-center gap-3 py-2 px-4">
                    {/* Icon based on toast type */}
                    <div
                        className={`w-10 h-10 flex items-center justify-center rounded-full ${
                            type === "delete" ? "bg-red-50" : "bg-green-50"
                        }`}>
                            
                        {type === "delete" ? (
                            <MdDeleteOutline className="text-xl text-red-500"/>
                        ) : (
                            <LuCheck className="text-xl text-green-500"/>
                        )}

                    </div>

                    {/* Toast message */}
                    <p className="text-sm text-slate-800">{message}</p>
                </div>
            </div>
        </div>
        
    );
};

export default Toast;