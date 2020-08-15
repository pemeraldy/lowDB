const express = require('express')
const cors = require('cors')
const { nanoid } = require('nanoid')
const lowDb = require('lowdb')
const fileSync = require('lowdb/adapters/FileSync')
const bodyParser = require('body-parser')

const db = lowDb(new fileSync('store.json'))

db.defaults({ store: [] }).write()

const app = express()
app.use(cors())
app.use(bodyParser.json())

app.get('/store', (req, res) => {
    const data = db.get('store').value()
    return res.json(data)
})

app.post('/store/new', (req, res) => {
    const product = req.body
    db.get('store').push({
        ...product, id: nanoid()
    }).write()
    res.json({
        success: true
    })
})

const PORT = 4000
app.listen(PORT, () => { console.log(`sever started on port ${PORT}`) })