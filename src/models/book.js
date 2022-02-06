const mongoose = require('mongoose')

const bookSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true

    },
    page: {
        type: Number,
        required: true,
        trim: true,
        validate(value) {
            if (value < 0) {
                throw new Error( 'Page number must be a positive number')
            }
        }
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Author'
    },
    language: {
        type: String,
        required: true,
        enum: [
            'tr', 'eng'
        ],
        default: 'eng'
    },
    year: {
        type: Number,
        default: 0,
        validate(value){
            if (value < 0) {
                throw new Error('Year must be a positive number')
            }
        }
    },
    shelfLoc: {
        type: String,
        uppercase: true
    },
    subject: {
        type: String,
        enum: [
            'arts', 'animals', 'fiction', 'science and math', 
            'children', 'history', 'health and wellness', 
            'biography', 'social sciences', 'text books', 
            'places', 'books by language'
        ]
    },
    publisher: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Publisher'
    },
    views: [{
        view: {
            type: String,
            trim: true,
            validate(value) {
                if ( value.lenght > 300 ) {
                    throw new Error("You cannor submit more than 300!")
                }
            }
        },
        userName: {
            type: String,
            trim: true

        },
        date: {
            type: String
        }
    }]


})


bookSchema.virtual('bookSeries', {
    ref: 'BookSeries',
    localField: '_id',
    foreignField: 'bookSeries'
})

const Book = mongoose.model('Book', bookSchema )

module.exports = Book