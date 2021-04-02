const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();

const MongoClient = require('mongodb').MongoClient;
const { connect } = require('mongodb');
const ObjectID = require('mongodb').ObjectID;

const app = express();
const port = 5000

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }))

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.ew9hc.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  console.log('connection err', err);
  const itemCollection = client.db(process.env.DB_NAME).collection("items");
  const orderedItemCollection = client.db(process.env.DB_NAME).collection("orderedItems");
  //get
  app.get('/home', (req, res) => {
    itemCollection.find()
      .toArray((err, items) => {
        // console.log(items);
        res.send(items);
      })
  })

  app.get('/checkout/:id', (req, res) => {
    itemCollection.find({ _id: ObjectID(req.params.id) })
      .toArray((err, items) => {
        res.send(items);
      })
  })

  app.get('/orders', (req, res) => {
    // console.log(req.query.email);
    orderedItemCollection.find({email:req.query.email})
      .toArray((err, items) => {
        res.send(items);
      })
  })

  app.get('/admin/manageItems', (req, res) => {
    itemCollection.find()
      .toArray((err, items) => {
        res.send(items);
      })
  })
  //delete 
  app.delete('/admin/manageItems/:id', (req, res) => {
    console.log("delete",req.params.id);
    itemCollection.findOneAndDelete({ _id: ObjectID(req.params.id)})
      .then( items => {
        res.send(items);
        console.log(items)
      })
  })

  // post
  app.post('/admin/addItems', (req, res) => {
    const newItem = req.body;
    itemCollection.insertOne(newItem)
      .then(result => {
        console.log("inserted count", result.insertedCount)
        res.send(result.insertedCount > 0)
        console.log('res', result);
      })
    console.log('add', newItem);
  })

  app.post('/checkout/:id', (req, res) => {
    const newItem = req.body;
    orderedItemCollection.insertOne(newItem)
      .then(result => {
        console.log("inserted count", result.insertedCount)
        res.send(result.insertedCount > 0)
        console.log('res', result);
      })
    console.log('add', newItem);
  })
});


app.listen(process.env.PORT || port);