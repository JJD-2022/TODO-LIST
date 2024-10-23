const express = require('express');
const mongoose = require('mongoose');
const path = require('path');

const port = 5000; // Use the desired port
const app = express();

app.use(express.json()); // Middleware to parse JSON bodies
app.use(express.static(__dirname)); // Serve static files

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/students', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const db = mongoose.connection;

db.once('open', () => {
    console.log("MongoDB connection successful");
});

// Define the To-Do schema
const todoSchema = new mongoose.Schema({
    task: String // The task string
});

const Todo = mongoose.model("Todo", todoSchema);

// API Endpoints

// Add a new task
app.post('/api/todos', async (req, res) => {
    const { task } = req.body; // Get task from request body
    const todo = new Todo({ task }); // Create a new To-Do item

    await todo.save();
    res.status(201).json(todo); // Respond with the created To-Do item
});

// Fetch all tasks
app.get('/api/todos', async (req, res) => {
    const todos = await Todo.find(); // Retrieve all To-Do items
    res.json(todos); // Respond with the To-Do list
});

// Delete a task
app.delete('/api/todos/:id', async (req, res) => {
    const { id } = req.params; // Get the ID from request parameters
    await Todo.findByIdAndDelete(id); // Delete the To-Do item by ID
    res.json({ message: 'Todo deleted successfully' }); // Respond with success message
});

// Serve the main HTML file
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'todo.html')); // Change to your actual HTML file name
});

// Start the server
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
