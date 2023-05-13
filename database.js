import mysql from 'mysql2';
import dotenv from 'dotenv';
dotenv.config();
const pool=mysql
.createPool({
    host:process.env.MYSQL_HOST,
    user:process.env.MYSQL_USER,
    password:process.env.MYSQL_PASSWORD,
    database:process.env.MYSQL_DATABASE,

})
.promise();
//USERS CRUD
export async function getUserByID(id) {
    const [rows] = await pool.query(`SELECT * FROM user WHERE id = ?`, [id]);
    return rows[0];
  }
  export async function getUsers() {
    const [rows] = await pool.query("SELECT * FROM user");
    return rows;
  }  
export async function getUserByEmail(email) {
    const [rows] = await pool.query(`SELECT * FROM user WHERE email = ?`, [email]);
    return rows[0];
}

export async function createUser(name,email) {
  const [result] = await pool.query(
    `
    INSERT INTO user (name, email)
    VALUES (?, ?)
  `,
    [name, email]
  );
  const userID = result.insertId;
  return getUserByID(userID);
}

//TODOS CRUD
  export async function getTodosById(id){
    const [row]= await pool.query(`SELECT * FROM todos WHERE id=?`, [id]);
    return row[0];
}
  export async function getTodos() {
    const [rows] = await pool.query("SELECT * FROM todos");
    return rows;
  }
  export async function createTodo( title, type, advice, intime) {
    const [result] = await pool.query(
      `
      INSERT INTO todos (title, type, advice, intime)
      VALUES (?, ?, ?, ?)
    `,
      [title, type, advice, intime]
    );
    const todoID = result.insertId;
    return getTodosById(todoID);
  }
  export async function deleteTodo(id) {
    const [result] = await pool.query(
      `
      DELETE FROM todos WHERE id = ?;
      `,
      [id]
    );
    return result;
  }

//CHALLENGE CRUD
export async function createChallenge(todo_id, user_id, inday) {
  try {
  const [result] = await pool.query(
    `
INSERT INTO challenge (todo_id, user_id, inday) 
VALUES (?,?,?);
  `,
  [ todo_id, user_id, inday]
  );
  const challengeID = result.insertId;
  return getChallengeByID(challengeID);
} catch (error) {
  console.error(error);
  throw new Error("Error creating challenge");
}
}
export async function getChallenge() {
  const [rows] = await pool.query(`SELECT * FROM challenge`);
  return rows;
}
export async function getChallengeByID(id) {
  const [rows] = await pool.query(`SELECT * FROM challenge WHERE id = ?`,[id]);
  return rows[0];
}
export async function getChallengeByUserId(user_id) {
const [rows] = await pool.query(`SELECT * FROM challenge WHERE user_id = ?`,[user_id]);
return rows;
}
export async function getChallengeByUserIdDate(userId,daytime) {
  const [rows] = await pool.query(`SELECT * FROM challenge WHERE user_id = ? AND DATE(inday) = ?`,[userId,daytime]);
  return rows;
}
  export async function toggleCompleted(id, value) {
    const newValue = value === true ? "TRUE" : "FALSE";
    const [result] = await pool.query(
      `
      UPDATE challenge
      SET completed = ${newValue} 
      WHERE id = ?;
      `,
      [id]
    );
    return result;
  }
//SHARE
  export async function getSharedTodoByID(id) {
    const [rows] = await pool.query(
      `SELECT * FROM shared_todos WHERE todo_id = ?`,
      [id]
    );
    return rows[0];
  }

  export async function shareTodo(todo_id, user_id, shared_with_id) {
    const [result] = await pool.query(
      `
      INSERT INTO shared_todos (todo_id, user_id, shared_with_id) 
      VALUES (?, ?, ?);
      `,
      [todo_id, user_id, shared_with_id]
    );
    return result.insertId;
  }

  // export async function getTodosByID(id) {
  //   const [rows] = await pool.query(
  //     `
  //     SELECT todos.*, shared_todos.shared_with_id
  //     FROM todos
  //     LEFT JOIN shared_todos ON todos.id = shared_todos.todo_id
  //     WHERE todos.user_id = ? OR shared_todos.shared_with_id = ?
  //   `,
  //     [id, id]
  //   );
  //   return rows;
  // }
