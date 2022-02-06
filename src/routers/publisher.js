const express = require('express')
const Publisher = require('../models/publisher')
const router = new express.Router()

router.post('/publishers', async (req,res) => {

    try {
        const publisher = new Publisher({
            ...req.body
        })
        await publisher.save()
        //res.status(201).send(publisher)
        return res.redirect('/publishers')
    } catch(e) {
        res.status(400).send(e)
    }
})

router.get('/publishers', async(req,res) => {
    try{
        const publishers = await Publisher.find({})
        res.render('publishers_page', {
            publishersToRender: publishers
        })
    } catch(e){
        res.status(400).send(e)
    }
})

router.get('/publishers/:id', async (req,res) => {
const _id = req.params.id

    try {
        const publisher = await Publisher.findById(_id)
        
        if(!publisher) {
            return res.status(404).send()
        }
        res.send(publisher)
    } catch(e) {
        res.status(500).send()
    }
})

router.patch('/publishers/:id', async (req,res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = [ 'name', 'page', 'author' ]
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update))

    if(!isValidOperation) {
        return res.status(400).send({ error: 'Invalid updates!'})
    }

    try {
        const publisher = await Publisher.findByIdAndUpdate( req.params.id, req.body, { new: true, runValidators: true })

        if(!publisher) {
            return res.status(404).send()
        }
        res.send(publisher)
    } catch (e) {
        res.status(400).send(e)
    }
})

router.delete('/publishers/:id', async(req, res) => {
    try{
        const publisher = await Publisher.findByIdAndDelete(req.params.id)

        if(!publisher) {
            return res.status(404).send()
        }

        res.send(publisher)
    } catch(e) {
        res.status(500).send()
    }

})




module.exports = router