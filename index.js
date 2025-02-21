require('dotenv').config();
const jwt = require('jsonwebtoken');
const express = require('express');
const app = express();
const cors = require('cors');
const port = process.env.PORT || 5000;
const morgan = require('morgan');

// middleware
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.oo5u4.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;
// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    const userCollection = client.db("TaskNoJujutsu").collection("users");    
    const taskCollection = client.db("TaskNoJujutsu").collection("tasks");    

    // jwt apis
    // 1
    app.post('/jwt', async (req, res) => {
      const user = req.body;
      const token = jwt.sign(user, process.env.ACCSESS_TOKEN_SECRET, {
        expiresIn: '3h'
      });
      res.send({ token });
    });

    // middlewares
    // 2
    const verifyToken = (req, res, next) => {
      if (!req.headers.authorization) {
        return res.status(401).send({ message: `Forbidden access!` });
      }
      const token = req.headers.authorization.split(' ')[1];
      jwt.verify(token, process.env.ACCSESS_TOKEN_SECRET, (error, decoded) => {
        if (error) {
          return res.status(401).send({ message: `Forbidden access!` });
        }
        req.decoded = decoded;
        next();
      });
    };

    // user APIs
    app.post('/users', async (req, res) => {
        const user = req.body;
        try {
          const existingUser = await userCollection.findOne({ email: user.email });
          if (existingUser) {
            return res.status(400).json({ message: 'User already exists', insertedId: null });
          }
          const result = await userCollection.insertOne(user);
          res.status(201).json({ message: 'User created', insertedId: result.insertedId });
        } 
        catch (err) {
          console.error('Error:', err);
          res.status(500).json({ message: 'Error creating user', error: err.message });
        }
      });



    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensure client will close when you finish/error
  }
}

run().catch(console.dir);

app.get('/', (req, res) => {
  res.send('Task No Jujutsu');
});

app.listen(port, () => {
  console.log(`Server is active on port ${port}`);
});
