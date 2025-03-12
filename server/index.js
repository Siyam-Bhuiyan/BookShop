require("dotenv").config();
const express = require("express");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const cors = require("cors");

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection URL
const uri = process.env.MONGODB_URI;
if (!uri) {
  console.error("MONGODB_URI is not defined in environment variables");
  process.exit(1);
}

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function connectDB() {
  try {
    await client.connect();
    console.log("Connected to MongoDB");
  } catch (err) {
    console.error("MongoDB connection error:", err);
    process.exit(1);
  }
}

async function run() {
  try {
    const db = client.db("book-management");
    const booksCollection = db.collection("books");

    // 📌 Create a Book (POST)
    app.post("/books", async (req, res) => {
      try {
        const book = await booksCollection.insertOne(req.body);
        res.status(201).json(book);
      } catch (err) {
        res.status(500).json({ error: err.message });
      }
    });

    // 📌 Get Books with Pagination, Filtering, and Sorting (GET)
    app.get("/books", async (req, res) => {
      try {
        const books = await booksCollection.find({}).toArray();
        res.json({
          success: true,
          books: books || [],
        });
      } catch (err) {
        res.status(500).json({
          success: false,
          error: err.message,
        });
      }
    });

    // 📌 Get Book by ID (GET)
    app.get("/books/:id", async (req, res) => {
      const bookId = req.params.id;
      try {
        const book = await booksCollection.findOne({
          _id: new ObjectId(bookId),
        });
        if (!book) return res.status(404).json({ message: "Book not found" });
        res.json(book);
      } catch (err) {
        res.status(500).json({ error: err.message });
      }
    });

    // 📌 Update Book (PUT)
    app.put("/books/:id", async (req, res) => {
      try {
        const updatedBook = await booksCollection.updateOne(
          { _id: new ObjectId(req.params.id) },
          { $set: req.body }
        );
        res.json(updatedBook);
      } catch (err) {
        res.status(500).json({ error: err.message });
      }
    });

    // 📌 Delete Book (DELETE)
    app.delete("/books/:id", async (req, res) => {
      try {
        await booksCollection.deleteOne({
          _id: new ObjectId(req.params.id),
        });
        res.json({ message: "Book deleted" });
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

connectDB().then(() => {
  run().catch(console.dir);

  app.get("/", (req, res) => {
    res.send("Book Management System API!");
  });

  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
});
