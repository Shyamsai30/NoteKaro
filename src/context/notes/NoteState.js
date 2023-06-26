import { useState } from "react";
import NoteContext from "./NoteContext";
const NoteState = (props) => {
  const initialNotes = []
  const [notes, setNotes] = useState(initialNotes);
  const url = "http://localhost:5000";


  // Get All Notes
  const getAllNotes = async () => {
    // API call
    const response = await fetch(`${url}/api/notes/fetchallnotes`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "auth-token": localStorage.getItem('token')
      },
    });
    const json = await response.json();
    setNotes(json);
  }

  // Add Note
  const addNote = async (title, description, tag) => {
    // API call
    const response = await fetch(`${url}/api/notes/addnote`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "auth-token": localStorage.getItem('token')
      },
      body: JSON.stringify({title, description, tag})
    });

    const note = await response.json();
    setNotes(notes.concat(note));
  }


  // Delete Note
  const deleteNote = async (id) => {
    // API call
    const response = await fetch(`${url}/api/notes/deletenote/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        "auth-token": localStorage.getItem('token')
      },
    });
    const json = await response.json();
    // console.log(json);

    // Logic to delete in client
    const newNotes = notes.filter((note) => note._id !== id);
    setNotes(newNotes);
  }

  // Edit Note
  const editNote = async (id, title, description, tag) => {
    // API call
    const response = await fetch(`${url}/api/notes/updatenote/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "auth-token": localStorage.getItem('token')
      },
      body: JSON.stringify({title, description, tag})
    });
    const json = await response.json();
    // console.log(json);

    // Logic to edit in client
    let newNotes = JSON.parse(JSON.stringify(notes))
    for (let index = 0; index < newNotes.length; index++) {
      if (newNotes[index]._id === id) {
        newNotes[index].title = title;
        newNotes[index].description = description;
        newNotes[index].tag = tag;
        break;
      }
    }
    setNotes(newNotes);
  }


  return (
    <NoteContext.Provider value={{ notes, addNote, deleteNote, editNote, getAllNotes }}>
      {props.children}
    </NoteContext.Provider>
  );
}

export default NoteState;