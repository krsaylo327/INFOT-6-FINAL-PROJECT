import React from "react";
import { MdOutlinePushPin, MdCreate, MdDelete} from "react-icons/md";


// NoteCard component displays a single note's summary with actions
const NoteCard = ({
    title, 
    date, 
    content, 
    tags, 
    isPinned, 
    onEdit, 
    onDelete, 
    onPinNote,
    onView, 
}) => {
    return (
        // Card container; clicking opens the note view modal
        <div className="relative h-40 border rounded border-gray-300 p-4 mb-7 hover:shadow-2xl transition-all ease-in-out break-words overflow-hidden whitespace-pre-wrap"
            onClick={onView}
        >
            <div className="text-l flex items-center justify-between">
                <div className="pr-8 w-90 min-w-0">
                    
                    {/* Note title and date */}
                    <h6 className="text-[18px] font-medium truncate">{title}</h6>
                    <span className="text-[10px] slate-blue-400 font-extralight ">{date}</span>  
                    
                </div>
                
                {/* Pin/unpin icon */}
                <MdOutlinePushPin 
                    className={`cursor-pointer transition-colors duration-100 absolute top-5 right-4  ${
                        isPinned ? 'text-blue-500 hover:text-slate-300' : 'text-slate-500 hover:text-blue-300' 
                    }`}

                    onClick={(e) => {
                        e.stopPropagation(); 
                        onPinNote();
                    }}
                />  
            </div>

            {/* Note content preview */}
            <p className="text-xs text-gray-500 mt-2 line-clamp-2">{content}</p>

            <div className="flex items-center justify-between mt-1 mb-2">

                {/* Tags list */}
                <div className="mt-3 font-medium text-[11px] text-gray-500 flex flex-wrap gap-1 max-h-[1rem] overflow-hidden pr-8">
                    {tags.map((item, idx) => (
                        <span key={idx} className="mr-2 inline-block">#{item}</span>
                    ))} 
                </div>

                {/* Edit and delete icons */}
                <div className="absolute bottom-4 right-5 flex items-center gap-2">
                    <MdCreate
                        className="text-slate-400 hover:text-green-600"
                        onClick={(e) => {
                            e.stopPropagation();
                            onEdit();
                        }}
                    />
                    <MdDelete
                        className="text-slate-400 hover:text-red-500"
                        onClick={(e) => {
                            e.stopPropagation();
                            onDelete();
                        }}
                    />
                </div>
            </div>
        </div>
    );
};
export default NoteCard;