const mongoose = require('mongoose')

const publisherSchema = new mongoose.Schema({
    name: {
        type: String
    }
})

publisherSchema.virtual('books', {
    ref: 'Book',
    localField: '_id',
    foreignField: 'book'
})

publisherSchema.virtual('authors', {
    ref: 'Author',
    localField: '_id',
    foreignField: 'author'
})

const Publisher = mongoose.model('Publisher', publisherSchema)

module.exports = Publisher




