// app/db.js
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';

// Open the SQLite database with the given username
const initDatabase = async (username) => {
  const db = await open({
    filename: `${username}.db`,
    driver: sqlite3.Database,
  });

  await db.exec(`
    CREATE TABLE IF NOT EXISTS phone_numbers (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      number TEXT NOT NULL
    )
  `);

  return db;
};

export default initDatabase;
