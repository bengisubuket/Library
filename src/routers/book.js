const express = require('express')
const dateformat = require('dateformat')

const Author = require('../models/author')
const Book = require('../models/book')
const BookSeries = require('../models/bookSeries')
const Publisher = require('../models/publisher')
const router = new express.Router()


router.post('/books', async (req,res) => {
    try {
        const book = new Book({
            ...req.body
        })
        await book.save()
        //return res.status(201).send(book)
        return res.redirect('/books')
    } catch(e) {
        return res.status(400).send(e)
    }
})

router.get('/books', async(req, res) => {
    try {
        const books = await Book.find({})
        books.forEach(async(book) => {
            await book.populate('author').execPopulate()
            await book.populate('publisher').execPopulate()
            book.views.forEach((view)=>{
                view.formattedDate = dateformat(view.date, 'dd.mm.yyyy' )
            })
        })
        const authors = await Author.find({})
        const publishers = await Publisher.find({})
        res.render('books_page', {
            booksToRender: books,
            authors: authors,
            publishers: publishers
        })
    } catch (e) {
        console.log(e)
        res.status(400).send(e)
    }
})

router.get('/books/:id', async (req,res) => {
    const _id = req.params.id

    try {
        const book = await Book.findById(_id)
        await book.populate('author').execPopulate()

        if(!book) {
            return res.status(404).send()
        }

        res.send(book)
        
    } catch(e) {
        res.status(500).send()
    }
})

router.patch('/books/:id', async (req,res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = [ 'name', 'page', 'author', 'language', 'subject' ]
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update))

    if(!isValidOperation) {
        return res.status(400).send({ error: 'Invalid updates!'})
    }

    try {
        const book = await Book.findByIdAndUpdate( req.params.id, req.body, { new: true, runValidators: true })

        if(!book) {
            return res.status(404).send()
        }
        res.send(book)
    } catch (e) {
        res.status(400).send(e)
    }
})

router.delete('/books/:id', async(req, res) => {
    try{
        const book = await Book.findOneAndDelete(req.params.id)

        if(!book) {
            return res.status(404).send()
        }

        res.send(book)
    } catch(e) {
        console.log(e)
        res.status(500).send()
    }
})

router.post('/books/views/:id', async(req,res) => {
    const _id = req.params.id
    try{
        const book = await Book.findById(_id)
        if(!book) {
            return res.status(404).send()
        }

        let view = {
            'view': req.body.view,
            'userName': req.body.userName,
            'date': new Date()
        }

        if (req.body['view']) {
            book.views.push(view)
        }
        await book.save()
        //return res.status(201).send(book)
        return res.redirect('/books')

    } catch (e) {
        res.status(400).send()

    }

})

router.delete('/books/views/:bookid/:viewid', async(req,res) => {
    try {
        const book = await Book.findByIdAndUpdate({
            _id: req.params.bookid
        }, {
            '$pull': {
                'views': {
                    '_id': req.params.viewid
                }
            }
        }) 
        if(!book) {
            return res.status(404).send()
        }

        await book.save()
        return res.status(200).send(book)

    } catch (e) {
        res.status(400).send()
        
    }
})

//$ used as a shortcut to the function document.getElementById()
//_ used to tell the user that it is a private/protected variable in question

router.patch('/books/views/:bookid/:viewid', async(req,res) => {
    try{
        let view = req.body.view
        const book = await Book.findOneAndUpdate({
            _id: req.params.bookid,
            'views._id': req.params.viewid
        }, {
            '$set': {
                "views.$.view": view
            }
        })

        if(!book) {
            return res.status(404).send()
        }

        await book.save()
        return res.status(200).send(book)
    } catch(e) {
        res.status(400).send(e)
    }
})


module.exports = router
