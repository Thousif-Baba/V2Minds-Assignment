require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(cors());

const mongoUri = process.env.MONGODB_URI;
mongoose.connect(mongoUri, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected...'))
    .catch(err => console.log('MongoDB connection error:', err));

const noteSchema = new mongoose.Schema({
    content: String
});

const Note = mongoose.model('Note', noteSchema);

app.post('/notes', async (req, res) => {
    try {
        const note = new Note({
            content: req.body.content
        });
        await note.save();
        res.status(201).send(note);
    } catch (error) {
        res.status(500).send({ message: 'Error saving note', error });
    }
});

app.get('/notes', async (req, res) => {
    try {
        const notes = await Note.find();
        res.status(200).send(notes);
    } catch (error) {
        res.status(500).send({ message: 'Error fetching notes', error });
    }
});

app.delete('/notes/:id', async (req, res) => {
    try {
        const note = await Note.findByIdAndDelete(req.params.id);
        if (!note) {
            return res.status(404).send({ message: 'Note not found' });
        }
        res.status(200).send(note);
    } catch (error) {
        res.status(500).send({ message: 'Error deleting note', error });
    }
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
