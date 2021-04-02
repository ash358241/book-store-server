const express = require('express')
const MongoClient = require('mongodb').MongoClient;
const bodyParser = require('body-parser');
const cors = require('cors');
const ObjectId = require('mongodb').ObjectId;
require('dotenv').config()
const app = express()
const port = process.env.PORT || 5055;

app.use(cors())
app.use(bodyParser.json())

app.get('/', (req, res) => {
  res.send('Hello World!')
})

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.suylw.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  const bookCollection = client.db(`${process.env.DB_NAME}`).collection("collection");
  const orderCollection = client.db(`${process.env.DB_NAME}`).collection("orders");
  app.get('/books', (req, res) => {
    bookCollection.find({})
    .toArray((err, items) => {
      res.send(items);
    })
  })

  app.get('/book/:id', (req, res) => {
    console.log('from req.params', req.params.id)
    bookCollection.find({_id: ObjectId(req.params.id)})
    .toArray((err, items) => {
      res.send(items);
    })
  })

  app.get('/orders', (req, res) => {
    const queryEmail = req.query.email;
    orderCollection.find({email: queryEmail})
    .toArray((err, orders) => {
      res.send(orders);
    })
  })

  app.get('/orderDetails/:orderId', (req, res) => {
    orderCollection.find({_id: ObjectId(req.params.orderId)})
    .toArray((err, orderDetails) => {
      res.send(orderDetails[0]);
      console.log(err);
    })
  })

  app.post('/addBook', (req, res) => {
      const newBook = req.body;
      console.log('adding new book', newBook)
      bookCollection.insertOne(newBook)
      .then(result => {
          console.log('result inserted', result.insertedCount)
          res.send(result.insertedCount > 0)
      })
  })

  app.post('/addOrder', (req, res) => {
    const newOrder = req.body;
    orderCollection.insertOne(newOrder)
    .then(result => {
      console.log('order inserted', result.insertedCount)
      res.send(result.insertedCount > 0)
    })
  })

  app.delete('/delete/:id', (req,res) => {
    bookCollection.deleteOne({_id: ObjectId(req.params.id)})
    .then(result => {
      res.send(result.deletedCount > 0)
    })
  })
//   client.close();
});


app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})