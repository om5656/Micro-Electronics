require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 8000;
const MONGO_URL = process.env.MONGO_URL;


const taskSchema = new mongoose.Schema({
title: {
type: String,
required: true,
},
}, { timestamps: true });

const Task = mongoose.model("Task", taskSchema);



async function dbConnection() {
try {
await mongoose.connect(MONGO_URL);
console.log("Database Connected");
} catch (error) {
console.log(error);
}
}
dbConnection();



app.post("/tasks", async (req, res) => {
try {
const { title } = req.body;

if (!title) {
return res.status(400).json({ msg: "Title is required" });
}

const task = await Task.create({ title });

res.status(201).json({
    msg: "Task created successfully",
    data: task,
});
} catch (error) {
res.status(500).json({ msg: "Server Error" });
}
});

app.get("/tasks", async (req, res) => {
try {
const tasks = await Task.find();

res.status(200).json({
    msg: "Tasks fetched successfully",
    data: tasks,
});
} catch (error) {
res.status(500).json({ msg: "Server Error" });
}
});


app.listen(PORT, () => {
console.log(`Server running on port ${PORT}`);
});
