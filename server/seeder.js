require('dotenv').config();
const connectDB = require('./config/database');
const { getDB } = require('./config/database');

// This project uses MySQL. The previous seeder used Mongoose and deleteMany(),
// which did not match the active database and could destructively remove data.
async function run() {
  try {
    await connectDB();
    const db = getDB();
    const [rows] = await db.execute('SELECT DATABASE() AS databaseName');
    console.log(`MySQL connection OK (${rows[0].databaseName}).`);
    console.log('No demo data was inserted or deleted. Apply the SQL migrations before using the app.');
  } catch (error) {
    console.error('Database check failed:', error.message);
    process.exitCode = 1;
  }
  process.exit();
}
run();
