
const mysql = require('mysql2/promise');

let pool;

const connectDB = async () => {
  try {
    pool = mysql.createPool({
      host: process.env.DB_HOST || 'localhost',
      port: Number(process.env.DB_PORT || 3306),
      database: process.env.DB_NAME || 'paperhub',
      user: process.env.DB_USER || 'paperhub_user',
      password: process.env.DB_PASSWORD,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0
    });

    const connection = await pool.getConnection();
    await connection.ping();
    connection.release();

    console.log('MySQL Connected: paperhub');
  } catch (error) {
    console.error('MySQL connection error:', error.message);
    throw error;
  }
};

const getDB = () => {
  if (!pool) {
    throw new Error('MySQL has not been connected yet');
  }
  return pool;
};

module.exports = connectDB;
module.exports.getDB = getDB;
