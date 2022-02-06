const express = require('express')

const router = new express.Router()

router.get('/', async (req,res) => {
    try {
        res.render('welcome_page', {})

    } catch {
        res.status(400).send(e)
    }
})

router.get('/*', async (req,res) => {
    try {
        res.render('404page', {})
    } catch {
        res.status(400).send(e)
    }
})

module.exports = router