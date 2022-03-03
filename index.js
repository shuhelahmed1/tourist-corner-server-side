const express = require('express');
const cors = require('cors');
require('dotenv').config();
const app = express();
const port = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.oesrn.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
async function run() {
  try {
    await client.connect();
    const database = client.db("tourist-corner");
    const offersCollection = database.collection("offers");
    const ordersCollection = database.collection("orders");

    // get api
    app.get('/offers',async(req,res)=>{
      const cursor = offersCollection.find({});
      const offers = await cursor.toArray();
      res.send(offers)
    })

    // get api
    app.get('/offers/:id',async(req,res)=>{
      const id = req.params.id;
      const query = {_id: ObjectId(id)}
      const offer = await offersCollection.findOne(query)
      console.log('load user with id',id);
      res.send(offer)
    })

    // get api for orders
    // app.get('/orders',(req,res)=>{
    //   const cursor = ordersCollection.find({})
    //   const orders = await cursor.toArray();
    //   res.send(orders) 
    // })

    // post api
    // app.post('/orders', async(req,res)=>{
    //   const newOrder = req.body;
    //   const result = await offersCollection.insertOne(newOrder)
    //   console.log('got new order', req.body)
    //   console.log('added order', result)
    //   res.json(result)
    // })
    

    // post api
    app.post('/orders', async(req,res)=>{
      const newOrder = req.body;
      const result = await ordersCollection.insertOne(newOrder)
      console.log('got new user', req.body)
      console.log('added user', result)
      res.json(result)
    })

    // post api
    app.post('/offers', async(req,res)=>{
      const newOffer = req.body;
      const result = await offersCollection.insertOne(newOffer)
      console.log('got new user', req.body)
      console.log('added user', result)
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