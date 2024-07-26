import { useState, useEffect, useRef } from "react";
import NoteForm from "./NoteForm";
import NavBar from "./NavBar";

const NoteTake = () => {
  const [allNotes, setAllNotes] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editIndex, setEditIndex] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [searching, setSearching] = useState("");
  const [loading, setLoading] = useState(false); 

  const notesPerPage = 10;
  const formRef = useRef(null);

  useEffect(() => {
    const storedNotes = JSON.parse(localStorage.getItem("Notes")) || [];
    setAllNotes(sortNotesByTimestamp(storedNotes));
  }, [showForm]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (formRef.current && !formRef.current.contains(event.target)) {
        setShowForm(false);
      }
    };

    if (showForm) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showForm]);

  const sortNotesByTimestamp = (notes) => {
    return notes.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
  };

  const deletingNotes = (id) => {
    setLoading(true); 
    const updatedNotes = allNotes.filter(note => note.id !== id);
    localStorage.setItem("Notes", JSON.stringify(updatedNotes));
    setAllNotes(sortNotesByTimestamp(updatedNotes));
    
    const totalNotes = updatedNotes.length;
    const totalPages = Math.ceil(totalNotes / notesPerPage);
    
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(totalPages);
    } else if (totalNotes === 0) {
      setCurrentPage(1); 
    }
    
    setLoading(false); 
  };

  const startEditing = (id) => {
    setEditIndex(id);
    setShowForm(true);
  };

  const filteredNotes = sortNotesByTimestamp(
    allNotes.filter(note => note.title.toLowerCase().includes(searching.toLowerCase()))
  );

  useEffect(() => {
    // Update current page if the search results don't fit the current page
    const totalPages = Math.ceil(filteredNotes.length / notesPerPage);
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(totalPages);
    } else if (filteredNotes.length === 0) {
      setCurrentPage(1); 
    }
  }, [searching, filteredNotes]);

  const indexOfLastNote = currentPage * notesPerPage;
  const indexOfFirstNote = indexOfLastNote - notesPerPage;
  const currentNotes = filteredNotes.slice(indexOfFirstNote, indexOfLastNote);
  const totalPages = Math.ceil(filteredNotes.length / notesPerPage);

  const handlePageChange = (page) => {
    if (page > 0 && page <= totalPages) {
      setLoading(true); 
      setCurrentPage(page);
      setLoading(false); 
    }
  };

  const options = {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false 
  };

  const formattedTimestamp = (timestamp) =>{
    const date = new Date(timestamp);
    return date.toLocaleString('en-IN', options)
  };

  return (
    <div>
      <NavBar setSearching={setSearching} />
      <div className={`mt-20 flex flex-col gap-3 ${showForm ? 'filter blur-sm pointer-events-none' : ''}`} >
        {loading && (
          <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
            <div className="text-white">Loading...</div>
          </div>
        )}
        {allNotes.length === 0 && (
          <div className="flex flex-col gap-2"> 
            <h1 className="text-3xl font-bold text-center">Welcome to NoteKit</h1>
            <p className="text-center">Create your first note </p>
          </div>
        )}

        <button onClick={() => { setEditIndex(null); setShowForm(true); }} className="mx-auto rounded-3xl bg-blue-500 px-4 py-2 font-semibold text-white flex gap-2 hover:bg-blue-400">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
          </svg>
          Create Note
        </button>
      
        { currentNotes.length > 0 && <div className="flex justify-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1} strokeWidth="1.5" stroke="currentColor" className="size-6 hover:bg-gray-300 rounded-lg hover:cursor-pointer">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
          </svg>

          {Array.from({ length: totalPages }, (_, index) => (
            <button
              key={index + 1}
              onClick={() => handlePageChange(index + 1)}
              disabled={currentPage === index + 1}
              className={`${currentPage !== index +1 ? "bg-gray-500" : "bg-blue-800"} px-2 rounded-md text-white`}
            >
              {index + 1}
            </button>
          ))}
          <svg xmlns="http://www.w3.org/2000/svg" onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages} fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6 hover:bg-gray-300 rounded-lg hover:cursor-pointer">
            <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
          </svg>
        </div> }

        {currentNotes.length > 0 && (
          <div className="flex flex-wrap  sm:gap-2 justify-center">
            { currentNotes.map((data, index) => (
              <div key={index} className="flex flex-col p-3 rounded-lg w-80">
                <div className="flex gap-2 bg-blue-500 rounded-t-lg p-2 text-white">
                  <h1 className="font-semibold ">Created at: <span className="text-sm font-normal">{formattedTimestamp(data.timestamp)}</span></h1>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-7 ml-auto hover:bg-red-500 hover:rounded-sm hover:cursor-pointer" onClick={() => deletingNotes(data.id)}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                  </svg>
                  <svg xmlns="http://www.w3.org/2000/svg" onClick={() => startEditing(data.id)} fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-7 hover:bg-green-500 hover:rounded-sm hover:cursor-pointer">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125" />
                  </svg>
                </div>
                <div className="rounded-b-lg border p-3">
                  <h1 className="font-semibold ">Title</h1>
                  <h3>{data.title}</h3>
             
                  <h1 className="font-semibold ">Content</h1>
                  <p>{data.content}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {showForm && <div className="fixed top-1/3 z-10 flex w-[100%] justify-center " >
        <div ref={formRef}>
          <NoteForm
            allNotes={allNotes}
            editIndex={editIndex}
            existingNote={editIndex !== null ? allNotes.find(data => data.id == editIndex) : null}
            setShowForm={setShowForm}
            setLoading={setLoading} 
          />
        </div>
      </div>}
    </div>
  );
};

export default NoteTake;
