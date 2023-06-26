import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes
} from "react-router-dom";

import About from "./components/About";
import Navbar from "./components/Navbar";

import NoteState from "./context/notes/NoteState";
import Login from "./components/Login";
import Signup from "./components/Signup";
import Notes from "./components/Notes";

function App() {
  return (
    <>
      <NoteState>
        <Router>
          <Navbar />
          
          <div className="container">
            <Routes>
              <Route exact path="/" element={<Notes />} />
              <Route exact path="/about" element={<About />} />
              <Route exact path="/login" element={<Login />} />
              <Route exact path="/signup" element={<Signup />} />
            </Routes>
          </div>
        </Router>
      </NoteState>
    </>
  );
}

export default App;