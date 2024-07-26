const backendUrl = 'https://notes-backend-data.onrender.com';

document.getElementById('saveNoteBtn').addEventListener('click', saveNote);
document.getElementById('listNotesBtn').addEventListener('click', listNotes);

async function saveNote() {
    const content = document.getElementById('noteInput').value;
    if (!content) {
        alert('Please enter a note');
        return;
    }

    try {
        const response = await fetch(`${backendUrl}/notes`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ content })
        });

        if (!response.ok) {
            throw new Error('Error saving note');
        }

        document.getElementById('noteInput').value = '';
        alert('Note saved successfully');
    } catch (error) {
        console.error(error);
        alert('Failed to save note');
    }
}

async function listNotes() {
    try {
        const response = await fetch(`${backendUrl}/notes`);
        if (!response.ok) {
            throw new Error('Error fetching notes');
        }

        const notes = await response.json();
        const notesList = document.getElementById('notesList');
        notesList.innerHTML = '';

        notes.forEach(note => {
            const noteDiv = document.createElement('div');
            noteDiv.className = 'note-taking-item';
            noteDiv.innerHTML = `
                <span>${note.content}</span>
                <button class="note-taking-delete-button" onclick="deleteNote('${note._id}')">Delete</button>
            `;
            notesList.appendChild(noteDiv);
        });
    } catch (error) {
        console.error(error);
        alert('Failed to fetch notes');
    }
}

async function deleteNote(id) {
    try {
        const response = await fetch(`${backendUrl}/notes/${id}`, {
            method: 'DELETE'
        });

        if (!response.ok) {
            throw new Error('Error deleting note');
        }

        alert('Note deleted successfully');
        listNotes();
    } catch (error) {
        console.error(error);
        alert('Failed to delete note');
    }
}
