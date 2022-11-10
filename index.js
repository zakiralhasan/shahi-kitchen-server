const express = require("express");
const app = express();
const { MongoClient, ServerApiVersion } = require("mongodb");
const cors = require("cors");
const { ObjectID } = require("bson");
const port = process.env.PORT || 5000;

//used for .env file active or use.
require("dotenv").config();

// midle ware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.USER_NAME}:${process.env.USER_PASSWORD}@cluster0.krkb3gw.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});
async function run() {
  try {
    const servicesCollection = client
      .db("shahi-kitchen")
      .collection("services");

    const reviewsCollection = client.db("shahi-kitchen").collection("reviews");

    //get multiple data from services collection on mongodb
    app.get("/services/all", async (req, res) => {
      const query = {};
      const cursor = servicesCollection.find(query);
      const result = await cursor.toArray();
      res.send(result);
    });

    //get limited data from services collection on mongodb
    app.get("/services", async (req, res) => {
      const query = {};
      const cursor = servicesCollection.find(query).limit(3);
      const result = await cursor.toArray();
      res.send(result);
    });

    //get single data from services collection on mongodb
    app.get("/details/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectID(id) };
      const result = await servicesCollection.findOne(query);
      res.send(result);
    });

    //create single service and set to the services collection on mongodb
    app.post("/services", async (req, res) => {
      const review = req.body;
      const result = await servicesCollection.insertOne(review);
      res.send(result);
    });

    //get single user's reviews or data from reviews collection on mongodb
    app.get("/reviews", async (req, res) => {
      let query = {};
      if (req.query.email) {
        query = { email: req.query.email };
      }
      const cursor = reviewsCollection.find(query);
      const result = await cursor.toArray();
      res.send(result);
    });

    //get multiple data from reviews collection on mongodb
    app.get("/reviews/:id", async (req, res) => {
      const id = req.params.id;
      const query = { reviewID: id };
      const cursor = reviewsCollection.find(query);
      const result = await cursor.toArray();
      res.send(result);
    });

    //create single review and set to the reviews collection on mongodb
    app.post("/reviews", async (req, res) => {
      const review = req.body;
      const result = await reviewsCollection.insertOne(review);
      res.send(result);
    });

    //singel review delete from reviews collection on mongodb
    app.delete("/reviews/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectID(id) };
      const result = await reviewsCollection.deleteOne(query);
      res.send(result);
    });

    //singel review update from reviews collection on mongodb
    app.patch("/reviews/:id", async (req, res) => {
      const id = req.params.id;
      const review = req.body.comment;
      const query = { _id: ObjectID(id) };
      const updatedData = {
        $set: { comment: review },
      };
      const result = await reviewsCollection.updateOne(query, updatedData);
      res.send(result);
    });
  } finally {
  }
}

//called the main mongoDB working function
run().catch((error) => console.error(error));

app.get("/", (req, res) => {
  res.send("server is running");
});

app.listen(port, () => {
  console.log("server is running on port:", port);
});
