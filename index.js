const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();

const MongoClient = require('mongodb').MongoClient;
const { connect } = require('mongodb');

const app = express();
const port = 5000

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }))

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.ew9hc.mongodb.net/${process.env.DB}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  console.log('connection err', err);
  const itemCollection = client.db("foodAnywhere").collection("items");
  //get
  app.get('/home', (req, res) => {
    itemCollection.find()
    .toArray((err, items)=>{
      // console.log(items);
      res.send(items);
    })
  })

  // post
  app.post('/addItems', (req, res) => {
    const newItem = req.body;
    itemCollection.insertOne(newItem)
      .then(result => {
        console.log("inserted count", result.insertedCount)
        res.send(result.insertedCount > 0)
        console.log('res', result);
      })
    console.log('add', newItem);
  })
});




app.listen(port);