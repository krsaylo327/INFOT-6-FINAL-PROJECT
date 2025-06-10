import React, { useEffect, useState } from "react";
import Navbar from "../../components/Navbar/Navbar";
import NoteCard from "../../components/Cards/NoteCard";
import moment from "moment/moment";
import { MdAdd } from "react-icons/md";
import AddEditNotes from "./AddEditNotes.jsx";
import { useNavigate } from "react-router-dom";
import Modal from "react-modal";
import { data } from "react-router-dom";
import axios from "axios";
import EmptyCard from "../../components/EmptyCard/EmptyCard.jsx";
import axiosInstance from "../../utils/axiosInstance";
import Toast from "../../components/ToastMessage/Toast";
import AddNotesImg from "../../assets/images/add-notes.svg";
import NoDataImg from "../../assets/images/no-data.svg";
import { MdClose } from "react-icons/md";




const Home = () => {   
  // State for controlling the add/edit note modal
  const [openAddEditModal, setOpenAddEditModal] = React.useState ({
    isShown: false,
    type: "add",
    data: null,
  });

  // State for showing toast notifications
  const [showToastMsg, setShowToastMsg] = React.useState({
    isShown: false,
    message: "",
    type: "add",
  });

  // State for controlling the view note modal
  const [openViewModal, setOpenViewModal] = useState({ 
    isShown: false,
    data: null,
  });

  // State for all notes, user info, and search mode
  const [allNotes, setAllNotes] = React.useState([]);
  const [userInfo, setUserInfo] = React.useState(null);
  const [isSearch, setIsSearch] = React.useState(false);


  const navigate = useNavigate();

  // Open the add/edit modal in edit mode with selected note data
  const handleEdit = (noteDetails) => {
    setOpenAddEditModal({
      isShown: true,
      type: "edit",
      data: noteDetails,
    });
  };
  
  // Show a toast notification with a message and type
  const showToastMessage = (message, type) => {
    setShowToastMsg({ 
      isShown: true, 
      message,
      type
    });
  };

  // Close the toast notification
  const handleCloseToast = () => {
    setShowToastMsg({
      isShown: false,
      message: "",
    });
  };


  //Get User Info -> Fetch user info from backend using JWT token
  const getUserInfo = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");  
        return;
      }

      const response = await fetch("http://localhost:8000/get-user", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Error response:", errorData);
        if (response.status === 401) {
          // unauthorized, maybe clear storage and redirect to login
          localStorage.clear();
          navigate("/login");
        }
        return;
      }

      const data = await response.json();
      console.log("User info:", data.user);

      setUserInfo(data.user);  // Set user data in state

    } catch (error) {
      console.error("Network or logic error:", error);
    }
  };

  //Get All Notes -> Fetch all notes from backend and sort pinned notes first
    const getAllNotes = async () => {
    try {
      const response = await axiosInstance.get("/get-all-notes");

      if (response.data && response.data.notes) {
        // Sort: pinned notes first
        const sortedNotes = response.data.notes.sort((a, b) => {
          return b.isPinned - a.isPinned; 
        });

        setAllNotes(sortedNotes);
      }
    } catch (error) {
      console.error("An unexpected error occurred. Please try again.");
    }
  };


  //Delete Note by its ID
  const deleteNote = async (data) => {
    const noteId = data._id
    try {
      const response = await axiosInstance.delete("/delete-note/" + noteId);

      if (response.data && !response.data.error) { 
          showToastMessage("Note Deleted Successfully", "delete");
          getAllNotes();
      }
    } catch (error) {
        if (error.response &&
            error.response.data && 
            error.response.data.message
        )  {
            console.error("An unexpected error occurred. Please try again.");
        }
    }
  }


  //Search Notes by query string
  const onSearchNote = async (query) =>{
    try {
      const response = await axiosInstance.get("/search-notes", {
        params: { query }
      });

      if (response.data && response.data.notes) {
        setIsSearch(true);
        setAllNotes(response.data.notes);
      }
      
    } catch (error) {
      console.log(error)
    }
  };

  //Pin or Unpin a Note
  const updateIsPinned = async (noteData) => {
  const noteId = noteData._id;
  const newPinState = !noteData.isPinned;

  try {
    const response = await axiosInstance.put("/update-note-pinned/" + noteId, {
      isPinned: newPinState,
    });

    if (response.data && response.data.note) {
      const message = newPinState
        ? "Note Pinned"
        : "Note Unpinned";

      showToastMessage(message);
      getAllNotes();
    }
    } catch (error) {
      console.log(error);
    }
  };

  //Clear Search and reload all notes
  const handleClearSearch = () => {
    setIsSearch(false);
    getAllNotes();
  };

  // Fetch all notes and user info when the Home component mounts
  useEffect(() => {
    getAllNotes();
    getUserInfo();
    return () => {};
  }, []);

  
  return (
    <>
      {/* Navbar with user info and search handlers */}
      <Navbar 
        userInfo={userInfo} 
        onSearchNote={onSearchNote} 
        handleClearSearch={handleClearSearch}
      />

      {/* Notes grid or empty state */}
      <div className="container mx-auto gap-4 px-10">
      {allNotes.length > 0 ? (
        <div className="grid grid-cols-3 gap-4 mt-8">
          {allNotes.map((item, index) => (
            <NoteCard
              key={item._id}
              title={item.title}
              date={moment(item.createdOn).format("DD MMM YYYY")}
              content={item.content}
              tags={item.tags}
              isPinned={item.isPinned}
              onEdit={() => handleEdit(item)}
              onDelete={() => deleteNote(item)}
              onPinNote={() => updateIsPinned(item)}
              onView={() => setOpenViewModal({ isShown: true, data: item })} 
            />
          ))}
          </div>
        ) : (
          <EmptyCard 
            imgSrc={ isSearch ? NoDataImg : AddNotesImg} 
            message={
              isSearch 
              ? `Oops! No notes found matching your search.`
              : "Start creating your first note! Click the 'Add' button to write down your thoughts, ideas, reminders and important events. Let's get started!"}
          />
        )}
      </div>
      
      {/*  Floating button to open the modal for adding a new note  */}
      <button 
        className="w-16 h-16 flex items-center justify-center rounded-2xl bg-blue-500 hover:bg-blue-600 fixed right-12 bottom-10 z-50 " 
        onClick={() => {
          setOpenAddEditModal ({isShown: true, type: "add", data:null });
        }}
      >
        <MdAdd className="text-[32px] text-white" />
      </button>


      {/*  Modal for adding or editing a note. */}
      <Modal
            isOpen={openAddEditModal.isShown}
            onRequestClose={() => {
            setOpenAddEditModal({ isShown: false, type: "add", data: null });
            }}
            style={{
            overlay: {
                backgroundColor: "rgba(0,0,0,0.2)",
            },
            }}
            contentLabel=""
            className="w-[40%] h-[30rem] bg-white rounded-md mx-auto mt-9 p-5 overflow-y-scroll border-none outline-none flex flex-col"
        >

            <AddEditNotes
            type={openAddEditModal.type}
            noteData={openAddEditModal.data}
            onClose={() => {
                setOpenAddEditModal({ isShown: false, type: "add", data:null});
            }}
            getAllNotes={getAllNotes}
            showToastMessage={showToastMessage}
            />
      </Modal>


      {/* Modal for viewing note details  */}
      <Modal
          isOpen={openViewModal.isShown}
          onRequestClose={() => setOpenViewModal({ isShown: false, data: null })}
          style={{
          overlay: {
              backgroundColor: "rgba(0,0,0,0.1)",
          },
          }}
          contentLabel="View Note"
          className="relative w-[600px] h-[500px] bg-amber-50 rounded-md mx-auto mt-10 p-5 border-none outline-none flex flex-col shadow-2xl"
        >
          {/* Close Button */}
          <button
              className="m-2 w-10 h-10 rounded-full flex items-center justify-center absolute top-0 right-0 bg-slate-200 shadow hover:bg-slate-100 z-50 pointer-events-auto"
              onClick={() => setOpenViewModal({ isShown: false, data: null })}
              >
              <MdClose className="text-xl text-slate-400" />
          </button>
  

          {/* Render the note details in the view modal when a note is selected */}
          {openViewModal.data && (
          <div className="flex flex-col flex-grow overflow-y-auto pt-2 min-h-full"> 
              <h2 className="text-slate-800 text-xl font-medium mb-2 pt-4">
              {openViewModal.data.title}
              </h2>
              <p className="text-[13px] text-slate-500 mb-8 mt-1">
              {moment(openViewModal.data.createdOn).format("DD MMM YYYY")}
              </p> 
                  
              <div className="text-sm font-light text-gray-800 whitespace-pre-line mb-3">
              {openViewModal.data.content}
              </div>
              <div className="mt-auto text-sm text-red-400 flex flex-wrap gap-2 pt-7 pb-5">
                  {openViewModal.data.tags.map((tag, idx) => (
                      <span key={idx} className="mr-3 bm-9">#{tag}</span>
                  ))}
              </div>
          </div>
          )}
      </Modal>


      {/*  Toast notification for user feedback  */}
      <Toast
        key={showToastMsg.message + showToastMsg.type} 
        isShown={showToastMsg.isShown}
        message={showToastMsg.message}
        type={showToastMsg.type}
        onClose={handleCloseToast}
      />
    </>
  );
};

export default Home;