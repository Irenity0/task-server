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
        const users = req.body;
      const query = { email: users.email };
      const existingUser = await userCollection.findOne(query);
      if (existingUser) {
        return res.send({ message: "user already exists" });
      }
      const result = await userCollection.insertOne(users);
      res.send(result);
      });

    // tasks APIs
    app.post("/tasks", verifyToken, async (req, res) => {
      try {
        const task = req.body;
        const result = await taskCollection.insertOne(task);
        res.status(201).send(result);
      } catch (error) {
        res.status(500).send({ message: "err adding task", error });
      }
    });

    app.get("/tasks", verifyToken, async (req, res) => {
      try {
        const userEmail = req.decoded.email;
        const tasks = await taskCollection.find({ userEmail: userEmail }).toArray();
        res.send(tasks);
      } catch (error) {
        res.status(500).send({ message: "Error fetching tasks", error });
      }
    });

    app.get("/tasks/:id", async (req, res) => {
      try {
        const { id } = req.params;
    
        // Check if id is a valid MongoDB ObjectId
        if (!ObjectId.isValid(id)) {
          return res.status(400).send({ message: "Invalid task ID format" });
        }
    
        const query = { _id: new ObjectId(id) };
        const result = await taskCollection.findOne(query);
    
        if (!result) {
          return res.status(404).send({ message: "Task not found" });
        }
    
        res.send(result);
      } catch (error) {
        res.status(500).send({ message: "Server error", error: error.message });
      }
    });

    // PUT endpoint to update task by id
    app.put("/tasks/:id", verifyToken, async (req, res) => {
      try {
        const id = new ObjectId(req.params.id);  
        const updatedTask = req.body;
      
        
        const result = await taskCollection.updateOne({ _id: id },  
          {
            $set: updatedTask,
          }
        );
      
        if (result.modifiedCount === 0) {
          return res.status(404).send({ message: "Task not found or no changes made" });
        }
      
        res.send({ message: "Task updated successfully", updatedTask });
      } catch (error) {
        res.status(500).send({ message: "Error updating task", error });
      }
    });

    app.patch("/tasks/:id/status", verifyToken, async (req, res) => {
      try {
        const id = req.params.id;
        
        // Check if the ID is valid
        if (!ObjectId.isValid(id)) {
          return res.status(400).send({ message: "Invalid task ID format" });
        }
    
        const { status } = req.body;  // Expecting the status to be passed in the request body
    
        // Validate if status is provided
        if (!status) {
          return res.status(400).send({ message: "Status is required" });
        }
    
        // Update only the status of the task
        const result = await taskCollection.updateOne(
          { _id: new ObjectId(id) },
          { $set: { status } }
        );
    
        if (result.modifiedCount === 0) {
          return res.status(404).send({ message: "Task not found or no changes made" });
        }
    
        res.send({ message: "Task status updated successfully", status });
      } catch (error) {
        console.error("Error updating task status:", error); // Log the error
        res.status(500).send({ message: "Error updating task status", error });
      }
    });
    

    app.delete("/tasks/:id", verifyToken, async (req, res) => {
      try {
        const id = new ObjectId(req.params.id);
        const result = await taskCollection.deleteOne({ _id: id });

        if (result.deletedCount === 0) 
          return res.status(404).send({ message: "Task not found" });

        res.send({ message: "Task deleted successfully" });
      } catch (error) {
        res.status(500).send({ message: "Error deleting task", error });
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
