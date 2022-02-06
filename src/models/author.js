const mongoose = require('mongoose')

const authorSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    }
})

authorSchema.virtual('books', {
    ref: 'Book',
    localField: '_id',
    foreignField: 'book'
})

const Author = mongoose.model('Author', authorSchema )

module.exports = Author