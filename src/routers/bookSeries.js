const express = require('express')
const Book = require('../models/book')
const BookSeries = require('../models/bookSeries')
const router = new express.Router()

router.post('/bookSeries', async (req,res) => {
    try { 
        const bookSeries = new BookSeries({
            ...req.body
        })
        await bookSeries.save()
        //return res.status(201).send(bookSeries)
        return res.redirect('/bookSeries')
    } catch(e) {
        console.log(e)
        return res.status(400).send(e)
    }
})

router.get('/bookSeries', async(req,res) => {
    try{
        const bookSeries = await BookSeries.find({})
        res.render('bookSeries_page', {
            seriesToRender: bookSeries
        })
    } catch(e){
        res.status(400).send(e)
    }
})

router.get('/bookSeries/:id', async (req,res) => {
    const _id = req.params._id
    try {
        const bookSeries = await BookSeries.findOne(_id)
        if (!bookSeries) {
            return res.status(404).send()
        } 

        res.send(bookSeries)
    } catch(e) {
        res.status(500).send()
    }
})

router.patch('/bookSeries/:id', async (req,res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = [ 'name', 'numOfBooks', 'books' ]
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update))

    if(!isValidOperation) {
        return res.status(400).send({ error: 'Invalid updates!'})
    }

    try {
        const bookSeries = await BookSeries.findByIdAndUpdate( req.params.id, req.body, { new: true, runValidators: true })

        if(!bookSeries) {
            return res.status(404).send()
        }
        res.send(bookSeries)
    } catch (e) {
        res.status(400).send(e)
    }
})

router.delete('/bookSeries/:id', async(req, res) => {
    try{
        const bookSeries = await BookSeries.findOneAndDelete(req.params.id)

        if(!bookSeries) {
            return res.status(404).send()
        }

        res.send(bookSeries)
    } catch(e) {
        console.log(e)
        res.status(500).send()
    }
})

router.post('/bookseries/books/:id', async(req,res) => {
    const _id = req.params.id
    try{
        const bookSeries = await BookSeries.findById(_id)

        if(!bookSeries) {
            return res.status(404).send()
        }
        
        let bookToAdd = req.body.book
        

        if (bookToAdd) {
            bookSeries.books.push(bookToAdd)
        }
        await bookSeries.save()
        return res.status(201).send(bookSeries)


    } catch (e) {
        console.log(e)
        res.status(400).send()
    }

})

router.delete('/bookSeries/books/:bookSeriesId/:bookId', async(req,res) => {
    try {
        const bookSeries = await BookSeries.findByIdAndUpdate({
            _id: req.params.bookSeriesId
        }, {
            '$pull': {
                'books': {
                    '_id': req.params.bookId
                }
            }
        }) 
        if(!bookSeries) {
            return res.status(404).send()
        }

        await bookSeries.save()
        return res.status(200).send(bookSeries)

    } catch (e) {
        res.status(400).send()
        
    }
})

router.get('/bookSeries/books/:id', async(req,res) => {
    const _id = req.params.id
    try{
        const series = await BookSeries.findById({_id})
        const booksOfSeries = series.books
        if(!booksOfSeries){
            return res.status(404).send()
        }
        let arrangedArr = []
        booksOfSeries.forEach( async(elem) => {
            let book = await Book.findOne({_id : elem._id})
            arrangedArr.push(book)
        })
        return res.render('booksOf_bookSeries_page', {
            nameOfSeries: series.name,
            booksToRender: arrangedArr
        })
    } catch(e){
        console.log(e)
        res.status(400).send(e)
    }
})

module.exports = router

