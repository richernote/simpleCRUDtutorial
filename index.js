require('dotenv').config()

const express = require('express');
const bodyParser = require('body-parser')
const app = express();

const MongoClient = require('mongodb').MongoClient

MongoClient.connect(`mongodb+srv://${process.env.USERNAME}:${process.env.PASSWORD}@cluster0.nygvbno.mongodb.net/?retryWrites=true&w=majority`, { useUnifiedTopology: true })
.then(client => {

    console.log('Connected to DataBase')
    const db = client.db('star-wars-quotes')
    const quoteCollection = db.collection('quotes')

        app.set('view engine', 'ejs')
    
        app.use(bodyParser.urlencoded({ extended: true }))
        app.use(bodyParser.json())
        app.use(express.static('public'))
        
        app.post('/quotes', (req, res) => {
            quoteCollection.insertOne(req.body)
                .then(result => {
                    console.log(result)
                    res.redirect('/')
                })
                .catch(err => console.error(err))
        })

        app.put('/quotes', (req, res) => {
            console.log(req.body)

            quoteCollection.findOneAndUpdate(
                {name: 'Yoda'},
                {$set: {
                    name: req.body.name,
                    quote: req.body.quote
                }},
                {
                    // create if none
                    upsert: true
                }
            ).then(result => {
                res.json('Success')
            })
            .catch(err => console.error(err))
        })

        app.delete('/quotes', (req, res) => {
            quoteCollection.deleteOne(
                { name: req.body.name }
            ).then( result => {
                if(result.deletedCount === 0){
                    return res.json('No more left to delete')
                }
                res.json('Deleted Darth Vader')
            })
            .catch(error => console.error(error))
        })

        app.get('/', (req, res) => {
            const cursor = db.collection('quotes').find().toArray()
                .then(results => {
                    console.log(results)
                    res.render('index.ejs', { quotes: results })
                })
                .catch(err => console.error(err))

        })


        app.listen(3000, ()=> {
            console.log('Listening on 3000')
        })
        
    }).catch(error => console.error(error))


