const sqlite3 = require('sqlite3').verbose();

export function createTable(){
    console.log("created DB")
    const db = new sqlite3.Database(`./usersDb.db`)
    db.run("CREATE TABLE IF NOT EXISTS users (userId INTEGER PRIMARY KEY, favourite TEXT, lastViewed TEXT)")
    db.close()
}

