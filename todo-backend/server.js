const express = require("express");
const mongoose = require("mongoose");
const cors = require('cors')

const app = express();
app.use(express.json());
app.use(cors())

const port = process.env.PORT || 2799;
mongoose
  .connect(
    process.env.MONGODB
  )
  .then(() => {
    console.log("MONGO DB CONNECTED");
  })
  .catch((err) => {
    console.log(err);
  });

// creating schema
const todoSchema = new mongoose.Schema({
  title: { required: true, type: String },
  description: { required: true, type: String },
});

// creating model
const todoModel = mongoose.model("Todo", todoSchema);

app.post("/todo", async (req, res) => {
  const { title, description } = req.body;
  try {
    const newtodo = new todoModel({ title, description });
    await newtodo.save();
    res.status(201).json(newtodo);
  } catch (err) {
    console.log("object", err);
    res.status(500).json({ message: err.message });
  }
});

app.put("/todo/:id", async (req, res) => {
  try {
    const { title, description } = req.body;
    const id = req.params.id;
    const updatedTodo =await todoModel.findByIdAndUpdate(id, { title, description },{new : true});
    if (!updatedTodo) {
      return res.status(404).json({ message: "Todo not found!" });
    }
    res.status(200).json(updatedTodo);
  } catch (err) {
    console.log("ERROR IN UPDATE TODO",err)
    res.json({message : err.message})
  }
});

app.delete('/todo/:id' , async (req,res) => {
    try{
        const id = req.params.id
        await todoModel.findByIdAndDelete(id)
        res.status(204).end()
    }catch(err){}
})

app.get("/todo", async (req, res) => {
  try {
    const todosData = await todoModel.find();
    res.json(todosData);
  } catch (err) {
    console.log("ERROR GETTING TODO DATA", err);
    res.status(500).json({ message: err.message });
  }
});

app.listen(port, () => {
  console.log("Server is running in this " + port);
});
