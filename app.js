const express = require('express')
const cors = require('cors')
const { nanoid } = require('nanoid')
const lowDb = require('lowdb')
const fileSync = require('lowdb/adapters/FileSync')
const bodyParser = require('body-parser')

const db = lowDb(new fileSync('store.json'))

db.defaults({ products: [] }).write()

const app = express()
app.use(cors())
app.use(bodyParser.json())

app.get('/products', (req, res) => {
    const data = db.get('products').value()
    return res.json(data)
})

// get all male watches
app.get('/products/male', (req, res) => {
    const data = db.get('products').filter(prod => {
        return prod.gender == "male"
    }).value()
    console.log(data)
    return res.json(data)
})

// get all female watches
app.get('/products/female', (req, res) => {
    const data = db.get('products').filter(prod => {
        return prod.gender == "female"
    }).value()
    console.log(data)
    return res.json(data)
})

// get a specific watch brand
app.get('/products/female', (req, res) => {
    const data = db.get('products').filter(prod => {
        return prod.brand == "Hoblot"
    }).value()
    console.log(data)
    return res.json(data)
})

app.post('/products/new', (req, res) => {
    const product = req.body
    console.log(product)
    db.get('products').push({
        ...product, id: nanoid()
    }).write()
    res.json({
        success: true
    })
    // res.redirect('/products')
})

app.get('/categories', (req, res) => {
    const cats = db.get('categories').value()
    return res.json(cats)
})
app.post('/categories/new', (req, res) => {
    const category = req.body
    // const value = Object.values(category)
    db.get('categories').push(category.cat).write()
    res.json({
        success: true
    })
})

app.get('/categories/adults', (req, res) => {
    const adults = db.get('categories')
        .find('adults')
        .value()
    console.log(adults)

    return res.send(adults)
})

const PORT = 4000
app.listen(PORT, () => { console.log(`sever started on port ${PORT}`) })