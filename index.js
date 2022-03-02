const express = require('express');
const cors = require('cors');
require('dotenv').config();
const app = express();
const port = 5000;
const { MongoClient, ServerApiVersion } = require('mongodb');
app.use(cors());
app.use(express.json());

// user: tourist-corner\
// pass: YuODHZn19Gcm4YH9



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.oesrn.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
async function run() {
  try {
    await client.connect();
    const database = client.db("tourist-corner");
    const offersCollection = database.collection("offers");

    // get api
    app.get('/offers',async(req,res)=>{
      const cursor = offersCollection.find({});
      const offers = await cursor.toArray();
      res.send(offers)
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
  console.log(`Example  listening${port}`)
})