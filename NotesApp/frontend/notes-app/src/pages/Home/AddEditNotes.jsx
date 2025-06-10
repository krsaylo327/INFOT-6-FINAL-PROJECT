import React from "react";
import TagInput from "../../components/Input/TagInput.jsx";
import { MdClose } from "react-icons/md";
import axiosInstance from "../../utils/axiosInstance";

const AddEditNotes = ({ noteData, type, getAllNotes, onClose, showToastMessage }) => {
    const safeNoteData = noteData || {};  // default to empty object if null or undefined
    const [title, setTitle] = React.useState(safeNoteData.title || "");
    const [content, setContent] = React.useState(safeNoteData.content || "");
    const [tags, setTags] = React.useState(safeNoteData.tags || []);

    const [error, setError] = React.useState(null);

    // Add Note
    const addNewNote = async () => {
        try {
            const response = await axiosInstance.post("/add-note", {
                title,
                content,
                tags,
            });

            if (response.data && response.data.note) {
                showToastMessage("Note Added Successfully", "add");
                getAllNotes();
                onClose()
            }
        } catch (error) {
            if (error.response &&
                error.response.data && 
                error.response.data.message
            )  {
                setError(error.response.data.message); 
            }
        }
    };

    // Edit Note
    const editNote = async () => {
        const noteId = noteData._id

        try {
            const response = await axiosInstance.put("/edit-note/" + noteId, {
                title,
                content,
                tags,
            });

            if (response.data && response.data.note) {
                showToastMessage("Note Updated Successfully", "edit");
                getAllNotes();
                onClose()
            }
        } catch (error) {
            if (error.response &&
                error.response.data && 
                error.response.data.message
            )  {
                setError(error.response.data.message); 
            }
        }
    };

    // Validate note fields and call add or edit function based on type.
    const handleAddNote = () => {
        if (!title) {
            setError("Insert a title");
            return;
        }
        
        if (!content) {
            setError("Insert a content");
            return;
        }

        setError("");

        if (type === "edit") {
            editNote();
        } else {
            addNewNote()
        }
    };

    

    return (
        <div className="relative h-[30rem] flex flex-col">

            {/* Close button */}
            <button
                className="w-10 h-10 rounded-full flex items-center justify-center absolute -top-3 -right-3 hover:bg-slate-100"
                onClick={onClose}
            >
                <MdClose className="text-xl text-slate-400"/>
            </button>

            {/* Title input field */}
            <div className="gap-1">
                <label className="input-label mb-1 block">TITLE</label>
                <input 
                    type="text" 
                    className="text-m text-slate-950 border-b border-gray-300 shadow-2xs outline-none pb-1 pt-1 w-[28rem]"
                    placeholder=""
                    value={title}
                    onChange={({target}) => setTitle(target.value)}
                />    
            </div>

            {/* Content textarea field */}
            <div className="flex flex-col gap-2 mt-5">
                <label className="input-label">CONTENT</label>
                <textarea
                    type="text"
                    className="text-xs text-slate-950 outline-none border border-gray-200 shadow-l p-2 rounded h-[150px]"
                    placeholder="write content"
                    rows={10}
                    value={content}
                    onChange={({target}) => setContent(target.value)}
                />
            </div>    

            {/* Tags input field */}
            <div className="mt-4">
                <label className="input-label">TAGS</label>
                <TagInput tags={tags} setTags={setTags}/>
            </div>

            {error && <p className="text-red-500 text-xs pt-4">{error}</p>}

            {/* Submit button for add or update */}
            <div>
                <button 
                    className="relative flex justify-center btn-primary font-medium mt-5 pb-3 mx-auto mb-5  " 
                    onClick={handleAddNote}
                >
                    {type === 'edit' ? 'UPDATE' : 'ADD'}
                </button>
            </div>
        
        </div> 
    );
};
export default AddEditNotes;