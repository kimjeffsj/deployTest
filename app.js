require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require("body-parser");
const schema = require("./models/bookSchema");

const Book = schema.Book;
const Author = schema.Author;

const app = express();
app.use(bodyParser.json());
// app.use(express.json());

const PORT = 3000
const MONGO_URI = process.env.MONGO_URI

// CONNECT TO MONGODB
mongoose.connect(MONGO_URI)
    .then(() => console.log("Connected to MONGODB"))
    .catch((err) => console.log(err));

app.get("/", (req, res) => {
    res.send("Welcome to my API");
});

// GET ALL BOOKS
app.get("/books", async (req, res) => {
    const books = await Book
        .find()
        .sort({ author: 1 });


    if (books.length > 0) {
        res.status(200).json(books);
    }
    else {
        res.status(200).send("Database is empty");
    }
});



app.post("/books", async (req, res) => {
    const newTitle = req.body.title;

    const authorName = req.body.authorName;
    const authorWebsite = req.body.authorWebsite;

    const publishedYear = req.body.publishedYear;
    const genre = req.body.genre

    try {
        const newAuthor = new Author(
            {
                name: authorName,
                website: authorWebsite
            }
        );

        const createdAuthor = await newAuthor.save();
        console.log(createdAuthor);

        const newBook = new Book(
            {
                title: newTitle,
                author_id: createdAuthor._id,
                publishedYear,
                genre
            }
        );

        await newBook.save();
        res.status(201).send("Book saved successfully");
    }
    catch (err) {
        console.log(err);
    }
});

app.delete('/books/:id', async (req, res) => {
    const bookId = req.params.id;
    try {
        await Book.deleteOne({ _id: new mongoose.Types.ObjectId(bookId) });
        res.status(200).send("Book deleted successfully");
    } catch (err) {
        res.send("Could not delete the book");
    }
});

app.patch('/books/:id', async (req, res) => {
    const bookId = new mongoose.Types.ObjectId(req.params.id);

    const title = req.body.title;

    try {
        const updatedBook = await Book.findByIdAndUpdate(bookId, {
            $set:
            {
                title
            }
        }, { new: true, runValidators: true }
        );
        if (updatedBook) {
            res.status(200).json(updatedBook);
        }
        else {
            res.status(404).send("Book not found!");
        }

    } catch (err) {
        console.log(err);
        res.send("Could not update the book");
    }
})
app.listen(PORT, () => console.log(`Running Server on ${PORT}`));