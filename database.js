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

export async function getUserByID(id) {
    const [rows] = await pool.query(`SELECT * FROM user WHERE id = ?`, [id]);
    return rows[0];
  }
  export async function getTodosByUserIdDate(userId,daytime) {
      // const [rows] = await pool.query(`SELECT * FROM todos WHERE DATE_FORMAT(daytime, '%Y-%m-%d') = ?`,[daytime]);
    const [rows] = await pool.query(`SELECT * FROM todos WHERE user_id = ? AND DATE(inday) = ?`,[userId,daytime]);
    return rows;
  }
  // SELECT * FROM todos WHERE user_id=2 and date(?)=date(daytime)
export async function getUserByEmail(email) {
    const [rows] = await pool.query(`SELECT * FROM user WHERE email = ?`, [email]);
    return rows[0];
}
  export async function getTodosByID(id) {
    const [rows] = await pool.query(
      `
      SELECT todos.*, shared_todos.shared_with_id
      FROM todos
      LEFT JOIN shared_todos ON todos.id = shared_todos.todo_id
      WHERE todos.user_id = ? OR shared_todos.shared_with_id = ?
    `,
      [id, id]
    );
    return rows;
  }
  export async function getTodoById(id){
    const [row]= await pool.query(`SELECT * FROM todos WHERE id=?`, [id]);
    return row[0];
}
export async function getTodo(id) {
    const [rows] = await pool.query(`SELECT * FROM todos WHERE id = ?`, [id]);
    return rows[0];
  }
  export async function getTodos() {
    const [rows] = await pool.query("SELECT * FROM todos");
    return rows;
  }
  export async function getUsers() {
    const [rows] = await pool.query("SELECT * FROM user");
    return rows;
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
  export async function createTodo(user_id, title) {
    const [result] = await pool.query(
      `
      INSERT INTO todos (user_id, title)
      VALUES (?, ?)
    `,
      [user_id, title]
    );
    const todoID = result.insertId;
    return getTodo(todoID);
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
  export async function toggleCompleted(id, value) {
    const newValue = value === true ? "TRUE" : "FALSE";
    const [result] = await pool.query(
      `
      UPDATE todos
      SET completed = ${newValue} 
      WHERE id = ?;
      `,
      [id]
    );
    return result;
  }

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