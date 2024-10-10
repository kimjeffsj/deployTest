const mongoose = require('mongoose');

const authorSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    website: {
        type: String
    }
});

const schema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: [true, 'Title is required'],
            unique: true,
            minlength: [3, 'Title must be atleast 3 characters long'],
            maxlength: [100, 'Title should be less than 100 characters']
        },
        author_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Author',
            required: true
        },
        publishedYear: {
            type: Number,
            required: true,
            min: [1900, 'Year must be greater than 1900'],
            max: [new Date().getFullYear(), 'Year must be less than current year']
        },
        genre: {
            type: [String],
            enum: {
                values: ['Fiction', 'Non Fiction', 'Science Fiction', 'Horror'],
                message: '{VALUE} is not a valid genre'
            }
        }

    }
)

const Book = mongoose.model("Book", schema);
const Author = mongoose.model("Author", authorSchema);

module.exports = { Book, Author }