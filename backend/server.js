const express = require('express');
const cors = require('cors');
const library = require('./models/Library');

const app = express();
app.use(cors());
app.use(express.json());

app.get('/api/books', async (req, res) => res.json(await library.getData(library.booksPath)));
app.get('/api/members', async (req, res) => res.json(await library.getData(library.membersPath)));

app.post('/api/books', async (req, res) => res.json(await library.addBook(req.body)));
app.delete('/api/books/:id', async (req, res) => {
    await library.deleteBook(req.params.id);
    res.json({ success: true });
});

app.post('/api/members', async (req, res) => res.json(await library.addMember(req.body)));
app.delete('/api/members/:id', async (req, res) => {
    await library.deleteMember(req.params.id);
    res.json({ success: true });
});

app.post('/api/issue', async (req, res) => {
    try {
        const result = await library.issueBook(req.body.bookId, req.body.memberId);
        res.json(result);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});
app.post('/api/return', async (req, res) => {
    try {
        const result = await library.returnBook(req.body.bookId, req.body.memberId);
        res.json(result);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});
app.put('/api/:type/:id', async (req, res) => {
    try {
        const result = await library.updateEntry(req.params.type, req.params.id, req.body);
        res.json(result);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});
app.listen(5000, () => console.log("System Online at Port 5000"));