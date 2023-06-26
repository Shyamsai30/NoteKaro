const express = require('express')
const router = express.Router();
const Note = require("../models/Note");
const fetchuser = require("../middleware/fetchuser")
const { body, validationResult } = require('express-validator');

// ROUTE-1 Get all notes using GET "api/notes/fetchallnotes" login required
router.get('/fetchallnotes', fetchuser, async (req, res) => {
    try {
        const notes = await Note.find({ user: req.user.id });
        res.json(notes);
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Some Error occured")
    }
});

// ROUTE-2 Add a new note using POST "api/notes/addnote" login required
router.post('/addnote', fetchuser, [body('title', 'Enter a valid title').isLength({ min: 3 }), body('description', 'Description must be atleast of length 3').isLength({ min: 3 })], async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { title, description, tag } = req.body;

        const note = new Note({ title, description, tag, user: req.user.id });
        const savedNote = await note.save();
        res.json(savedNote);
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Some Error occured")
    }
});


// ROUTE-3 Update an existing note using PUT "api/notes/updatenote:id" login required
router.put('/updatenote/:id', fetchuser, async (req, res) => {
    try {

        const { title, description, tag } = req.body;
        //  create a new note object
        const newNote = {};
        if (title) newNote.title = title;
        if (description) newNote.description = description;
        if (tag) newNote.tag = tag;

        // Find the note by id and update it;
        let note = await Note.findById(req.params.id);

        if (!note) {
            return res.status(404).send("Not Found");
        }
        if (note.user.toString() !== req.user.id) {
            return res.status(401).send("Not Allowed")
        }

        note = await Note.findByIdAndUpdate(req.params.id, { $set: newNote }, { new: true });
        res.json(note);
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Some Error occured")
    }
});


// ROUTE-4 delete an existing note using DELETE "api/notes/deletenote" login required
router.delete('/deletenote/:id', fetchuser, async (req, res) => {
    try {
        let note = await Note.findById(req.params.id);

        if (!note) {
            return res.status(404).send("Not Found");
        }
        if (note.user.toString() !== req.user.id) {
            return res.status(401).send("Not Allowed")
        }

        note = await Note.findByIdAndDelete(req.params.id);
        res.json({ sucess: "Note has been deleted", note });
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Some Error occured")
    }
});

module.exports = router;