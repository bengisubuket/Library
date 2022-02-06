const path = require('path')

const express = require('express')
require('./db/mongoose')
const bookRouter = require('./routers/book')
const authorRouter = require('./routers/author')
const publisherRouter = require('./routers/publisher')
const bookSeries = require('./routers/bookSeries')
const handler = require('./routers/handler')

const app = express()
const port = process.env.PORT || 3000

const publicDirectoryPath = path.join(__dirname, '../public')

app.set('view engine', 'hbs')
app.use(express.static(publicDirectoryPath))

//configuring express to automatically pass the incoming json
app.use(express.urlencoded({extended: true}))
app.use(express.json())
app.use(bookRouter)
app.use(authorRouter)
app.use(publisherRouter)
app.use(bookSeries)
app.use(handler)


app.listen(port, () => {
    console.log('Server is up on port ' + port)
})


