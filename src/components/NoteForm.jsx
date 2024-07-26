import { useState, useEffect } from "react";
import { v4 as uuidv4 } from 'uuid';

const NoteForm = ({ allNotes, editIndex, existingNote, setShowForm, setLoading }) => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [noteTime] = useState(new Date());
  const [initialNote, setInitialNote] = useState({ title: "", content: "" });
  useEffect(() => {
    if (existingNote) {
      setTitle(existingNote.title);
      setContent(existingNote.content);
      setInitialNote({ title: existingNote.title, content: existingNote.content });

    }
  }, [existingNote]);
  
  const submitData = (e) => {
    e.preventDefault();
    if (title && content) {
      setLoading(true); 
      const newNote = {
        id: existingNote ? existingNote.id : uuidv4(),
        title,
        content,
        timestamp: noteTime,
      };
  
      if (existingNote) {
        const updatedNotes = allNotes.map(note => 
          note.id === existingNote.id ? newNote : note
        );
        localStorage.setItem("Notes", JSON.stringify(updatedNotes));
        allNotes = updatedNotes;
      } else {
        const updatedNotes = [...allNotes, newNote];
        localStorage.setItem("Notes", JSON.stringify(updatedNotes));
        allNotes = updatedNotes;
      }
  
      setLoading(false); 
      setShowForm(false);
    }
  };
  
    const handleCancel = () => {
        setTitle(initialNote.title);
        setContent(initialNote.content);
      };
  return (
    <form onSubmit={submitData} className="bg-white rounded-xl shadow-lg sm2:w-96 sm:w-72 grid">
      <div className="bg-blue-500 rounded-t-xl p-2 flex">
        <h1 className="text-lg font-semibold text-white ml-2">Note</h1>
           <svg onClick={()=>setShowForm(false)} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6 ml-auto hover:cursor-pointer hover:bg-red-500 text-white rounded-md">
  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
</svg>
</div>
<div className="grid p-5">
      <h1 className="font-semibold text-lg">Title</h1>
      <input
        type="text"
        placeholder="Title..."
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="focus:outline-none "
      />
      <h1 className="font-semibold text-lg">Content</h1>
      <input
        type="text"
        placeholder="Write your mind..."
        className="focus:outline-none "
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />
      {!existingNote && <button type="submit" className={`bg-blue-500 rounded-3xl py-2 mt-5 text-white font-semibold hover:bg-blue-400 ${!title || !content ? 'cursor-not-allowed' : ''}`} disabled={!title || !content}>Submit</button>}
      {existingNote && <button type="submit"  className={`bg-blue-500 rounded-3xl py-2 mt-5 text-white font-semibold hover:bg-blue-400 ${initialNote.title == title && initialNote.content== content ? 'cursor-not-allowed' : ''}`} disabled={initialNote.title == title && initialNote.content== content}>Confirm</button>}
      {existingNote && <button type="button" onClick={handleCancel} className="bg-red-400 rounded-3xl mt-2 text-white font-semibold py-2 hover:bg-red-300">Undo Changes</button>    }
 </div>

    </form>
  )
}

export default NoteForm;
