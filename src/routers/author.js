const express = require('express')
const Author = require('../models/author')
const Book = require('../models/book')
const router = new express.Router()

router.post('/authors', async (req,res) => {
    try {
        const author = new Author({            
            ...req.body
        })
        await author.save()
        //return res.status(201).send(author)
        return res.redirect('/authors')
    } catch(e) {
        return res.status(400).send(e)
        console.log(e)
    }
})

router.get('/authors', async (req,res) => {
    try {
        const authors = await Author.find({})

        res.render('authors_page', {
            authorsToRender: authors
        })

    } catch (e){
        console.log(e)
        res.status(400).send(e)
    }
})

router.get('/authors/:id', async (req,res) => {
    const _id = req.params.id

    try {
        const author = await Author.findById(_id)
        
        if(!author) {
            return res.status(404).send()
        }
        res.send(author)
    } catch(e) {
        res.status(500).send()
    }
})

router.patch('/authors/:id', async (req,res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = [ 'name', 'page' ]
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update))

    if(!isValidOperation) {
        return res.status(400).send({ error: 'Invalid updates!'})
    }

    try {
        const author = await Author.findByIdAndUpdate( req.params.id, req.body, { new: true, runValidators: true })

        if(!author) {
            return res.status(404).send()
        }
        res.send(author)
    } catch (e) {
        res.status(400).send(e)
    }
})

router.delete('/authors/:id', async(req, res) => {
    try{
        const author = await Author.findByIdAndDelete(req.params.id)

        if(!author) {
            return res.status(404).send()
        }

        res.send(author)
    } catch(e) {
        res.status(500).send()
    }

})

router.get('/authors/books/:id', async(req,res) => {
    const _id = req.params.id
    try{
        const author = await Author.findById(_id)
        const books = await Book.find({author: _id})

        res.render('authors_books_page', {
            nameOfAuthor: author.name,
            booksToRender: books
        })

    } catch(e) {
        console.log(e)
        res.status(400).send(e)
    }
})

module.exports = router