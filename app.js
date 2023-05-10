import express from  'express';
import {
    getTodos,
    getUsers,
    shareTodo,
    deleteTodo,
    getTodosByID,
    createTodo,
    createUser,
    toggleCompleted,
    getUserByEmail,
    getUserByID,
    create8m,
    getTodosByUserIdDate,
    getSharedTodoByID,
} from "./database.js";
import bodyParser from "body-parser";
import cors from "cors";

const corsOptions = {
    // origin: "http://127.0.0.1:5173", // specify the allowed origin
    origin: "https://apiexpress-hu67.onrender.com:5173", // specify the allowed origin
    methods: ["POST", "GET"], // specify the allowed methods
    credentials: true, // allow sending credentials (cookies, authentication)
  };
  const developers = [
    { id: 1, name: "Beto", apiKey: "abcdef123456" },
    { id: 2, name: "Pedro", apiKey: "ghijkl789012" },
  ];
  const ckeckApiKey = (req, res, next) => {
    const apiKey = req.headers["x-api-key"];
    const developer = developers.find((d) => d.apiKey === apiKey); //check if we have a dev with that key
    if (!developer) {
      return res.status(401).json({ message: "Unauthorized, invalid Api Key" });
    }
    req.developer = developer;
    next();
  };

const app=express();
app.use(bodyParser.json());
app.use(express.json());
app.use(cors(corsOptions));
// app.use(ckeckApiKey);

app.get("/todos/:id",async (req,res)=>{
    const todos=await getTodosByID(req.params.id);
    res.status(200).send(todos);
})

app.get("/todos/shared_todos/:id", async (req, res) => {
    const todo = await getSharedTodoByID(req.params.id);
    const author = await getUserByID(todo.user_id);
    const shared_with = await getUserByID(todo.shared_with_id);
    res.status(200).send({ author, shared_with });
  });
  app.get("/users", async (req, res) => {
    try {
    const users = await getUsers();
    res.status(200).send(users);
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: 'No se pudo obtener la información de los usuarios' });
  }
  });
  app.get("/users/:id", async (req, res) => {
    const user = await getUserByID(req.params.id);
    res.status(200).send(user);
  });
  app.get("/todos/",async (req,res)=>{
    const todos=await getTodos();
    
    res.status(200).send(todos);
  });

  app.get("/todos/:userId/:daytime", async (req, res) => {
    try {
      const todo = await getTodosByUserIdDate(req.params.userId, req.params.daytime);
      res.status(200).send(todo);
    } catch (error) {
      console.error(error);
      res.status(500).send("Error al obtener los todos");
    }
  });
  app.get("/user/:email", async (req, res) => {
    const user = await getUserByEmail(req.params.email);
  if (!user) {
    return res.status(404).send({ message: "User not found" });
  }
  res.status(200).send(user);
  });
  app.put("/todos/:id", async (req, res) => {
    const { value } = req.body;
    const todo = await toggleCompleted(req.params.id, value);
    res.status(200).send(todo);
  });
  
  app.delete("/todos/:id", async (req, res) => {
    await deleteTodo(req.params.id);
    res.send({ message: "Todo deleted successfully" });
  });
  
  app.post("/todos/shared_todos", async (req, res) => {
    const { todo_id, user_id, email } = req.body;
    // const { todo_id, user_id, shared_with_id } = req.body;
    const userToShare = await getUserByEmail(email);
    const sharedTodo = await shareTodo(todo_id, user_id, userToShare.id);
    res.status(201).send(sharedTodo);
  });
  app.post("/todos", async (req, res) => {
    const { user_id, title } = req.body;
    const todo = await createTodo(user_id, title);
    res.status(201).send(todo);
  });
  app.post("/create8m", async (req, res) => {
    const { user_id, day } = req.body;
    try {
      const todo = await create8m(user_id, day);
      res.status(201).send(todo);
    } catch (error) {
      console.error(error);
      res.status(500).send({ message: "Error creating 8map" });
    }
  });
  app.post("/users", async (req, res) => {
    const { name, email } = req.body;
    const user = await createUser(name, email);
    res.status(201).send(user);
  });

app.listen(8080,()=>{
    console.log("SErver runnin on por 8080");
})