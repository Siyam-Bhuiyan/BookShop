const express = require("express");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const cors = require("cors");
const { parse } = require("dotenv");
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
        const bookData = req.body;
        try {
            const book = await booksCollection.insertOne(bookData);
            res.status(201).json({message: "Book created successfully"});
        } catch (error) {
            res.status(400).json({ message: "Error creating book" });
        }
      });

    //get all books
    app.get("/books", async (req, res) => {
        const  {page, limit, genre, minYear, maxYear, author, minPrice, maxPrice, sortBy, order, search} = req.query;
        try {
            const currentPage = Math.max(1, parseInt(page) || 1);
            const perPage = parseInt(limit) || 10;
            const skip = (currentPage - 1) * perPage;
            const filter = {};

            if(search) {
                filter.$or = [
                    {title: {$regex: search, $options: 'i'}},
                    {desctiprion: {$regex: search, $options: 'i'}},
                ]
            }

            if(genre) filter.genre = genre;
            if(minYear || maxYear) {
                filter.publishYear = {
                    ...filter(minYear && { $gte: parseInt(minYear) }),
                    ...filter(maxYear && { $lte: parseInt(maxYear) })
                };
            }
            if(author) filter.author = author;
            if(minPrice || maxPrice) {
                filter.price = {
                    ...filter(minPrice && { $gte: parseInt(minPrice) }),
                    ...filter(maxPrice && { $lte: parseInt(maxPrice) })
                };
            }

            const sortOptions = { [sortBy || "title"]: order === "desc" ? -1 : 1 };


            const books = await booksCollection.find(filter).sort(sortOptions).skip(skip).limit(perPage).toArray();

            const [] = await Promise.all([
                booksCollection.find(filter).sort(sortOptions).skip(skip).limit(perPage).
                booksCollection.distinct("genre"),
                booksCollection.distinct("author")
            ]);

            res.status(201).json(books);
        } catch (error) {
            res.status(500).json({ message: "Error fetching books" });
        } 

    })

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
