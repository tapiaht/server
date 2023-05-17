import express from  'express';
import {
  createUser,
  getUsers,
  getUserByID,
  getUserByEmail,
  createTodo,
  getTodos,
  getTodos8,
  getTodosById,
  getTodosById8,
  deleteTodo,
  createChallenge,
  getChallenge,
  getChallengeByID,
  getChallengeByUserId,
  getChallengeByUserIdDate,
  getChallengeByIdUserIdtodo,
  toggleCompleted,
  challengeTime,
    shareTodo,
    getSharedTodoByID,
    deleteChallenge,
} from "./database.js";
import bodyParser from "body-parser";
import cors from "cors";

const corsOptions = {
    // origin: "http://127.0.0.1:5173", // specify the allowed origin
    // origin: "https://apiexpress-hu67.onrender.com:5173", // specify the allowed origin
    origin: "https://planar-ray-386522.rj.r.appspot.com:5173", // specify the allowed origin
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
//TODO
  app.get("/todos",async (req,res)=>{
  const todos=await getTodos8();
  res.status(200).send(todos);
  });
  app.get("/todos/:id",async (req,res)=>{
    const todos=await getTodosById8(req.params.id);
    if (!todos) {
      return res.status(404).send({ message: "TOdo not found" });
    }
    res.status(200).send(todos);
  })
  app.delete("/todos/:id", async (req, res) => {
    await deleteTodo(req.params.id);
    res.send({ message: "Todo deleted successfully" });
  });
  app.post("/todos", async (req, res) => {
    const { title,type,advice,intime } = req.body;
    const todo = await createTodo(title,type,advice,intime);
    res.status(201).send(todo);
  });
//USERS
  app.get("/users", async (req, res) => {
    try {
    const users = await getUsers();
    res.status(200).send(users);
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: 'No se pudo obtener la información de los usuarios' });
  }
  });
  app.post("/users", async (req, res) => {
    const { name, email } = req.body;
    const user = await createUser(name, email);
    res.status(201).send(user);
  });
  app.get("/users/:id", async (req, res) => {
    const user = await getUserByID(req.params.id);
    res.status(200).send(user);
  });
  app.get("/user/:email", async (req, res) => {
    const user = await getUserByEmail(req.params.email);
  if (!user) {
    return res.status(404).send({ message: "User not found" });
  }
  res.status(200).send(user);
  });
  
//CHALLENGE
  app.post("/challenge", async (req, res) => {
  const { todo_id, user_id, inday, intime } = req.body;
  try {
    const todo = await createChallenge(todo_id,user_id, inday, intime);
    res.status(201).send(todo);
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: "Error creating challenge" });
  }
  });
  app.get("/challenge", async (req, res) => {
    try {
      const todo = await getChallenge();
      res.status(200).send(todo);
    } catch (error) {
      console.error(error);
      res.status(500).send("Error al obtener todos los retos ");
    }
  });
  app.get("/challenge/:id", async (req, res) => {
    try {
      const todo = await getChallengeByID(req.params.id);
      res.status(200).send(todo);
    } catch (error) {
      console.error(error);
      res.status(500).send("Error al obtener todos los retos ");
    }
  });
  app.get("/challengeuser/:user_id", async (req, res) => {
    try {
      const todo = await getChallengeByUserId(req.params.user_id);
      res.status(200).send(todo);
    } catch (error) {
      console.error(error);
      res.status(500).send("Error al obtener los retos del usuario");
    }
  });
  app.get("/challenge/:userId/:daytime", async (req, res) => {
    try {
      const todo = await getChallengeByUserIdDate(req.params.userId, req.params.daytime);
      res.status(200).send(todo);
    } catch (error) {
      console.error(error);
      res.status(500).send("Error al obtener los todos");
    }
  }); 
  app.get("/challengeuser/:userId/:todoId", async (req, res) => {
    try {
      const todo = await getChallengeByIdUserIdtodo(req.params.userId, req.params.todoId);
      if (!todo) {
        return res.status(404).send({ message: "Nofound" });
      }
      res.status(200).send(todo);
    } catch (error) {
      console.error(error);
      res.status(500).send("Error al obtener los todos");
    }
  });
  app.put("/challenge/:id", async (req, res) => {
    const { value } = req.body;
    const todo = await toggleCompleted(req.params.id, value);
    res.status(200).send(todo);
  });
  app.put("/challengetime/:id", async (req, res) => {
    const { value } = req.body;
    const todo = await challengeTime(req.params.id, value);
    res.status(200).send(todo);
  });
  app.delete("/challenge/:id", async (req, res) => {
    await deleteChallenge(req.params.id);
    res.send({ message: "Challenge deleted successfully" });
  });
//SHARE 
  app.post("/todos/shared_todos", async (req, res) => {
    const { todo_id, user_id, email } = req.body;
    // const { todo_id, user_id, shared_with_id } = req.body;
    const userToShare = await getUserByEmail(email);
    const sharedTodo = await shareTodo(todo_id, user_id, userToShare.id);
    res.status(201).send(sharedTodo);
  });
 
  
  app.get("/todos/shared_todos/:id", async (req, res) => {
    const todo = await getSharedTodoByID(req.params.id);
    const author = await getUserByID(todo.user_id);
    const shared_with = await getUserByID(todo.shared_with_id);
    res.status(200).send({ author, shared_with });
  });

app.get('/', (req, res) => {
  res.send('Hello from App Engine!');
});

// Listen to the App Engine-specified port, or 8080 otherwise
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}...`);
});