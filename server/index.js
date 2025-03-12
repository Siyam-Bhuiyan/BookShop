const express = require("express");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const cors = require("cors");
require("dotenv").config();
const port = process.env.PORT || 3000;

const app = express();

app.use(cors());
app.use(express.json());

//connect mongodb
const uri = process.env.MONGODB_URL;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    //create db and collections
    const db = client.db("BOOKSHOP");
    const booksCollection = db.collection("books");

    //create a new book(post)
    app.post("/books", async (req, res) => {
        try {
          const book = await booksCollection.insertOne(req.body);
          res.status(201).json(book);
        } catch (err) {
          res.status(500).json({ error: err.message });
        }
      });

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Welcome to Book Management API");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

//admin
//5RF4kIyTygr6Fi4N
