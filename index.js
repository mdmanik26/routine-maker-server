const express = require('express');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express()
const cors = require('cors');
require('dotenv').config()
const port = process.env.PORT || 5000

app.use(cors())
app.use(express.json())




const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ouuvt7g.mongodb.net/?retryWrites=true&w=majority`;

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
        // Connect the client to the server	(optional starting in v4.7)
        // await client.connect();

        const toDosCollection = client.db("toDoDB").collection("toDos");


        app.post('/toDos', async (req, res) => {
            const todo = req.body
            const result = await toDosCollection.insertOne(todo)
            res.send(result)


        })

        app.get('/todos/:email', async (req, res) => {
            const email = req.params.email
            // console.log(email)
            const query = { email: email }
            const result = await toDosCollection.find(query).toArray()
            res.send(result)
        })

        app.get('/todo/:id', async (req, res) => {
            const id = req.params.id
            // console.log(id);
            const query = { _id: new ObjectId(id) }
            const result = await toDosCollection.findOne(query)
            res.send(result)
        })

        app.put('/update/:id', async (req, res) => {
            const id = req.params.id;
     
            const updateTodo = req.body;
            console.log(updateTodo)
            const filter = { _id: new ObjectId(id) };
            const options = { upsert: true };

            const update = {
                $set: {
                    title: updateTodo.title,
                    description: updateTodo.description,
                    deadline: updateTodo.deadline,
                    priority: updateTodo.priority,
                    
                }
            }
            const result = await toDosCollection.updateOne(filter, update, options);
            res.send(result)

        })











        app.delete('/todos/:id', async (req, res) => {
            const id = req.params.id
            console.log(id)
            const query = { _id: new ObjectId(id) }
            const result = await toDosCollection.deleteOne(query)
            res.send(result)
        })







        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);
















app.get('/', (req, res) => {
    res.send('Job Task server is running')
})

app.listen(port, () => {
    console.log(`job task is running on port : ${port}`)
})
