
require('dotenv').config();

const mongoose = require('mongoose');
const mysql = require('mysql2/promise');

async function migrate() {
  let connection;

  try {
    await mongoose.connect(
      process.env.MONGO_URI || process.env.MONGODB_URI
    );

    connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      port: Number(process.env.DB_PORT || 3306),
      database: process.env.DB_NAME || 'paperhub',
      user: process.env.DB_USER || 'paperhub_user',
      password: process.env.DB_PASSWORD
    });

    const mongo = mongoose.connection.db;

    // Step 1: Universities
    const universities = await mongo
      .collection('universities')
      .find({})
      .toArray();

    const universityMap = new Map();

    for (const item of universities) {
      const [rows] = await connection.execute(
        'SELECT id FROM universities WHERE name = ?',
        [item.name]
      );

      let id;

      if (rows.length) {
        id = rows[0].id;
      } else {
        const [result] = await connection.execute(
          `INSERT INTO universities
           (name, logo, isActive, createdAt, updatedAt)
           VALUES (?, ?, ?, ?, ?)`,
          [
            item.name,
            item.logo || 'no-photo.jpg',
            item.isActive !== false ? 1 : 0,
            item.createdAt || new Date(),
            item.updatedAt || new Date()
          ]
        );

        id = result.insertId;
      }

      universityMap.set(String(item._id), id);
    }

    console.log(`Universities processed: ${universityMap.size}`);

    // Step 2: Courses
    // MongoDB courses have no department reference in the
    // inspected records. Leave department NULL for now.
    const courses = await mongo
      .collection('courses')
      .find({})
      .toArray();

    const courseMap = new Map();

    for (const item of courses) {
      const [rows] = await connection.execute(
        'SELECT id FROM courses WHERE name = ?',
        [item.name]
      );

      let id;

      if (rows.length) {
        id = rows[0].id;
      } else {
        const [result] = await connection.execute(
          `INSERT INTO courses
           (name, department, isActive, createdAt, updatedAt)
           VALUES (?, NULL, ?, ?, ?)`,
          [
            item.name,
            item.isActive !== false ? 1 : 0,
            item.createdAt || new Date(),
            item.updatedAt || new Date()
          ]
        );

        id = result.insertId;
      }

      courseMap.set(String(item._id), id);
    }

    console.log(`Courses processed: ${courseMap.size}`);

    // Step 3: Subjects
    const subjects = await mongo
      .collection('subjects')
      .find({})
      .toArray();

    let subjectsProcessed = 0;
    let subjectsSkipped = 0;

    for (const item of subjects) {
      const courseId = courseMap.get(String(item.course));

      if (!courseId || !item.code) {
        console.warn(`Skipping subject with missing course/code: ${item.name}`);
        subjectsSkipped++;
        continue;
      }

      const [existing] = await connection.execute(
        'SELECT id FROM subjects WHERE code = ?',
        [item.code]
      );

      if (existing.length) {
        subjectsProcessed++;
        continue;
      }

      await connection.execute(
        `INSERT INTO subjects
         (name, code, course, semester, isActive, createdAt, updatedAt)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [
          item.name,
          item.code,
          courseId,
          Number(item.semester || 1),
          item.isActive !== false ? 1 : 0,
          item.createdAt || new Date(),
          item.updatedAt || new Date()
        ]
      );

      subjectsProcessed++;
    }

    console.log(`Subjects processed: ${subjectsProcessed}`);
    console.log(`Subjects skipped: ${subjectsSkipped}`);
    console.log('Academic data migration finished.');
  } catch (error) {
    console.error('Migration failed:', error.message);
    process.exitCode = 1;
  } finally {
    if (connection) await connection.end();
    await mongoose.disconnect();
  }
}

migrate();
