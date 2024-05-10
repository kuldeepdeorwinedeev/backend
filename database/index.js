import mysql from "mysql2";
import env from "dotenv";
env.config();

const mysqlConfig = {
  host: process.env.host,
  user: process.env.user,
  password: process.env.password,
  database: process.env.database,
  port: process.env.port,
};

const pool = mysql.createPool(mysqlConfig);

async function executeQuery(query, params) {
  try {
    const connection = await pool.promise().getConnection();
    const [results] = await connection.query(query, params);
    connection.release();
    return results;
  } catch (error) {
    console.error("Error executing MySQL query:", error);
    throw error;
  }
}

export default executeQuery;
