const express = require('express');
const cors = require('cors');
require('dotenv').config();
const app = express();
const port = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
app.use(express.json());

// middleware
app.use(cors())


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ypbjopw.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
async function run() {
  try {
    await client.connect();
    const database = client.db("tourist-corner");
    const offersCollection = database.collection("offers");
    const ordersCollection = database.collection("orders");

    // get api for offers
    app.get('/offers',async(req,res)=>{
      const cursor = offersCollection.find({});
      const offers = await cursor.toArray();
      res.send(offers)
    })

    // get api particular offer id
    app.get('/offers/:id',async(req,res)=>{
      const id = req.params.id;
      const query = {_id: ObjectId(id)}
      const offer = await offersCollection.findOne(query)
      res.send(offer)
    })

    // post api for offers
    app.post('/offers', async(req,res)=>{
      const newOffer = req.body;
      const result = await offersCollection.insertOne(newOffer)
      console.log('got new user', req.body)
      console.log('added user', result)
      res.json(result)
    })

    // get api for orders
    app.get('/orders',async(req,res)=>{
      const cursor = ordersCollection.find({});
      const orders = await cursor.toArray();
      res.send(orders)
    })
    
    // post api for orders
    app.post('/orders', async(req,res)=>{
      const newOrder = req.body;
      const result = await ordersCollection.insertOne(newOrder)
      console.log('got new user', req.body)
      console.log('added user', result)
      res.json(result)
    })

    // delete api for orders
    app.delete('/orders/:id', async(req,res)=>{
      const id = req.params.id;
      const query = {_id: ObjectId(id)};
      const result = await ordersCollection.deleteOne(query)
      res.json(result)
    })

    // put api for orders
    app.put('/orders/:id', async(req,res)=>{
      const id = req.params.id;
      const query = {_id: ObjectId(id)};
      const updatedUser = req.body;
      const options = {upsert: true}
      const updateDoc = {$set: {
        address: updatedUser.address,
        phone: updatedUser.phone
      }}
      const result = await ordersCollection.updateOne(query,updateDoc,options)
      res.json(result)
    })
   
  } finally {
    // await client.close();
  }
}
run().catch(console.dir);

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`listening to port ${port}`)
})