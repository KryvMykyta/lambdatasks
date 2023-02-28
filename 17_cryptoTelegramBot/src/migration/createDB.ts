const sqlite3 = require("sqlite3").verbose();

const DB_PATH = `./usersDb.db`

export const createTable = () => {
  console.log("created DB");
  const db = new sqlite3.Database(DB_PATH);
  db.run(
    "CREATE TABLE IF NOT EXISTS users (userId INTEGER PRIMARY KEY, favourite TEXT, lastViewed TEXT)"
  );
  db.close();
}
