const mongoose = require('mongoose')

const bookSeriesSchema = new mongoose.Schema({
    name: {
        type: String,
        require: true,
        trim: true
    },
    numOfBooks: {
        type: Number,
        require: true
    },
    books: [{
        book: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Book'
        }
    }]
})

const BookSeries = mongoose.model('BookSeries', bookSeriesSchema)

module.exports = BookSeries